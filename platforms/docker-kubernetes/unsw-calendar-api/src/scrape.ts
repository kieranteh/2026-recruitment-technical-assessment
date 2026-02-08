import * as https from "https";
import * as cheerio from "cheerio";

export type TermCode = "U1" | "T1" | "T2" | "T3";
interface Period {
  start: string;
  end: string;
}
export interface TermData {
  o_week?: Period;
  teaching_period: Period;
  flex_week?: Period;
  study_period?: Period;
  exams: Period;
}

const URL =
  "https://www.unsw.edu.au/student/managing-your-studies/key-dates/academic-calendar";

const TERM_MAP: Record<string, TermCode> = {
  "Summer Term": "U1",
  "Term 1": "T1",
  "Term 2": "T2",
  "Term 3": "T3",
};

const MON: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  sept: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};

function fetchHTML(url: string): Promise<string> {
  return new Promise((res, rej) => {
    https
      .get(url, (r) => {
        if (r.statusCode !== 200) {
          rej(new Error("HTTP " + (r.statusCode?.toString() ?? "no code")));
          return;
        }
        let data = "";
        r.setEncoding("utf8");
        r.on("data", (c: string) => (data += c));
        r.on("end", () => {
          res(data);
        });
      })
      .on("error", rej);
  });
}

const NORM = (s: string) =>
  s
    .replace(/\u00A0|&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[–—]/g, "-")
    .trim();

const pad2 = (n: number) => String(n).padStart(2, "0");

const toISO = (y: number, m: string, d: string) =>
  `${y.toString()}-${pad2(MON[m.toLowerCase().slice(0, 3)])}-${pad2(+d)}`;

function parseRange(
  txt: string,
  baseYear: number,
): { start: string; end: string } {
  const t = NORM(txt);
  const m =
    /^(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?\s*-\s*(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?$/.exec(
      t,
    );
  if (!m) throw new Error("bad range: " + txt);
  const [, d1, m1, , d2, m2] = m;
  let [, , , y1, , , y2] = m;
  y1 = y1 ? y1 : baseYear.toString();
  y2 = y2 ? y2 : baseYear.toString();
  // handle Dec-Jan wrap when end year omitted
  const start = new Date(
    `${y1}-${pad2(MON[m1.toLowerCase().slice(0, 3)])}-${pad2(+d1)}`,
  );
  let end = new Date(
    `${y2}-${pad2(MON[m2.toLowerCase().slice(0, 3)])}-${pad2(+d2)}`,
  );
  if (!m[6] && end < start)
    end = new Date(
      `${(baseYear + 1).toString()}-${pad2(MON[m2.toLowerCase().slice(0, 3)])}-${pad2(+d2)}`,
    );
  return {
    start: toISO(start.getFullYear(), m1, d1),
    end: toISO(end.getFullYear(), m2, d2),
  };
}

const scrape_year = async (
  year: number,
): Promise<Record<TermCode, TermData>> => {
  const html = await fetchHTML(URL);
  const $ = cheerio.load(html);

  // In <section class="accordion">
  // there will be an li with class "accordion-list-item" and data-hash="term"
  // This contains all tables we need, so first find this element
  const termSection = $(
    'section.accordion li.accordion-list-item[data-hash="term"]',
  );
  if (termSection.length === 0) {
    throw new Error("Could not find term section");
  }

  // In this find a div with class "2025Tab" where 2025 is the chosen year
  // Class names that start with digits are not valid in CSS selectors without escaping,
  // so use an attribute/class token selector instead of `.2025Tab`.
  const yearDiv = termSection.find(`div[class~="${year.toString()}Tab"]`);
  if (yearDiv.length === 0) {
    throw new Error(`Could not find ${year.toString()} term data`);
  }

  // Tables inside the year div should have term dates (expecting Summer Term, Term 1, Term 2, Term 3)
  const tables = yearDiv.find("table");
  if (tables.length !== 4) {
    throw new Error("Could not correctly find term date tables");
  }

  const terms: Partial<Record<TermCode, TermData>> = {};

  for (const tableEl of tables) {
    const table = $(tableEl);
    const termName = NORM(
      table.prev("h3").text().trim() ||
        table
          .parent()
          .parent()
          .parent()
          .prev()
          .find("h3")
          .first()
          .text()
          .trim(),
    );
    if (termName !== "Summer Term" && !termName.startsWith("Term ")) {
      throw new Error(`Unexpected term name: ${termName}`);
    }

    // Each table has two columns: Session and Date
    // We only care about
    // O-Week (Only for T1-3)
    // (Summer)? teaching period (U1)|(T(1-3))
    // Flexibility week T(1-3)
    // Study period T(1-3)
    // Exams (U1)|(T(1-3))
    const rows = table.find("tr");

    let o_week: Period | undefined = undefined;
    let teaching_period: Period | undefined = undefined;
    let flex_week: Period | undefined = undefined;
    let study_period: Period | undefined = undefined;
    let exams: Period | undefined = undefined;

    rows.each((_, row) => {
      const cols = $(row).find("td");
      if (cols.length === 0) {
        // Skip header row
        return;
      } else if (cols.length !== 2) {
        throw new Error("Unexpected number of columns in term date table");
      }

      const session = NORM($(cols[0]).text().trim());

      // Date is in form "DD Mon - DD Mon" or "DD Mon YYYY - DD Mon YYYY"
      const date = $(cols[1]).text().trim();
      const { start, end } = parseRange(date, year);

      if (session === "O-Week") {
        o_week = { start, end };
      } else if (
        session ===
        `${termName === "Summer Term" ? "Summer t" : "T"}eaching period ${
          TERM_MAP[termName]
        }`
      ) {
        teaching_period = { start, end };
      } else if (session === `Flexibility week ${TERM_MAP[termName]}`) {
        flex_week = { start, end };
      } else if (session === `Study period ${TERM_MAP[termName]}`) {
        study_period = { start, end };
      } else if (session === `Exams ${TERM_MAP[termName]}`) {
        exams = { start, end };
      } else {
        // Ignore unneeded row
        return;
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (teaching_period === undefined || exams === undefined) {
      throw new Error(
        `Could not find all required sessions for term ${termName}`,
      );
    }

    terms[TERM_MAP[termName]] = {
      o_week,
      teaching_period,
      flex_week,
      study_period,
      exams,
    };
  }

  if (!terms.U1 || !terms.T1 || !terms.T2 || !terms.T3) {
    throw new Error("Missing term data");
  }

  return terms as Record<TermCode, TermData>;
};

export default scrape_year;
