import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { z } from "zod";
import {
  getYear,
  health as healthMeta,
  initCache,
  setRefreshStatus,
  setYear,
} from "./cache.js";
import scrapeYear from "./scrape.js";
import { YearSchema } from "./types.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST ?? "localhost";

const app = Fastify({ logger: true });

app.register(helmet);
app.register(rateLimit, {
  max: 60,
  timeWindow: "1 minute",
  ban: 5,
  addHeaders: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
  },
});

app.get("/v1/dates/:year", async (req, reply) => {
  // I know I'm giving myself a Y2K problem but honestly if this is used in the year 3000, then my
  // great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-
  // great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-great-
  // great-great-great-great-grandchild can take care of it (assuming 39 generations at 25 years each, and that they go to UNSW and do CS)
  const params = z
    .object({ year: z.coerce.number().int().gte(2025).lte(3000) })
    .parse(req.params);

  const data = getYear(params.year);
  if (!data) {
    reply
      .code(404)
      .send({ error: "Data not found for year " + params.year.toString() });
    return;
  }
  reply.send(data);
});

app.get("/health", (req, reply) => {
  const meta = healthMeta();
  const ok = !!meta.lastRefreshAt;
  const ageMs = Date.now() - Date.parse(meta.lastRefreshAt ?? "");
  const fresh = ageMs < 25 * 60 * 60 * 1000; // less than 25 hours old
  reply.code(ok && fresh ? 200 : 503).send({ ok, fresh, ...meta });
});

const update = async () => {
  const today = new Date();
  const thisYear = today.getFullYear();
  const nextYear = thisYear + 1;

  try {
    const data = await scrapeYear(thisYear);
    const yearData = YearSchema.parse(data);
    await setYear(thisYear, yearData);
  } catch (e) {
    app.log.error(
      `Error scraping year ${thisYear.toString()}: ${(e as Error).message}`,
    );
    await setRefreshStatus(false);
  }

  try {
    const data = await scrapeYear(nextYear);
    const yearData = YearSchema.parse(data);
    await setYear(nextYear, yearData);
  } catch (e) {
    // First check if next year was already cached - if not, don't mark refresh as failed (it may just not be available yet)
    const existing = getYear(nextYear);
    if (existing) {
      app.log.error(
        `Error scraping year ${nextYear.toString()}: ${(e as Error).message}`,
      );
      await setRefreshStatus(false);
    }
  }

  await setRefreshStatus(true);
};

const scheduleDailyUpdate = () => {
  const now = new Date();
  const sydneyNow = new Date(
    now.toLocaleString("en-AU", { timeZone: "Australia/Sydney" }),
  );
  const target = new Date(sydneyNow);
  target.setHours(3, 0, 0, 0); // 3:00 AM Sydney time

  if (sydneyNow >= target) {
    target.setDate(target.getDate() + 1);
  }
  const delay = target.getTime() - sydneyNow.getTime();

  setTimeout(() => {
    void update().finally(() => {
      scheduleDailyUpdate();
    });
  }, delay);
};

await initCache().then(async () => {
  try {
    const address = await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server listening at ${address}`);

    await update();
    scheduleDailyUpdate();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
});
