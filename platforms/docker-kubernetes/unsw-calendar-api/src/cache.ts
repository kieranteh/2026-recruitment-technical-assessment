import { promises as fs } from "fs";
import { dirname, resolve } from "path";
import { CacheShape, YearData, CacheSchema } from "./types.js";

const CACHE_PATH = resolve(process.cwd(), "cache/term-dates.json");

let mem: CacheShape = { data: {}, meta: { lastRefreshOk: false } };

export async function initCache(): Promise<CacheShape> {
  // Open and read the file - create if missing, throw if cannot read
  const raw = await fs
    .readFile(CACHE_PATH, "utf8")
    .catch(async (err: unknown) => {
      if (err instanceof Error && "code" in err && err.code === "ENOENT") {
        await fs.mkdir(dirname(CACHE_PATH), { recursive: true });
        await fs.writeFile(CACHE_PATH, JSON.stringify(mem, null, 2), "utf8");
        return JSON.stringify(mem);
      } else {
        throw err;
      }
    });

  // This will throw if the file is malformed
  mem = CacheSchema.parse(JSON.parse(raw));
  return mem;
}

export async function flush() {
  const tmp = CACHE_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(mem, null, 2), "utf8");
  await fs.rename(tmp, CACHE_PATH);
}

export function getYear(year: number): YearData | undefined {
  return mem.data[String(year)];
}

export async function setYear(year: number, y: YearData) {
  mem.data[String(year)] = y;
  await flush();
}

export async function setRefreshStatus(ok: boolean) {
  mem.meta.lastRefreshOk = ok;
  mem.meta.lastRefreshAt = new Date().toISOString();
  await flush();
}

export function health() {
  return mem.meta;
}
