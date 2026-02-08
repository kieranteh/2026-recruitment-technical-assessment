# UNSW Academic Calendar API

This repo contains a basic API to fetch UNSW term dates, scraping for updates on a daily basis directly from UNSW.

## Endpoints

- `GET /v1/dates/:year`: Fetches the term dates for the specified year.

```json5
// Example response for GET /v1/dates/2025
{
  U1: {
    teaching_period: {
      start: "2025-01-06",
      end: "2025-02-07",
    },
    exams: {
      start: "2025-02-08",
      end: "2025-02-10",
    },
  },
  T1: {
    o_week: {
      start: "2025-02-10",
      end: "2025-02-14",
    },
    teaching_period: {
      start: "2025-02-17",
      end: "2025-04-24",
    },
    flex_week: {
      start: "2025-03-24",
      end: "2025-03-30",
    },
    study_period: {
      start: "2025-04-26",
      end: "2025-05-01",
    },
    exams: {
      start: "2025-05-02",
      end: "2025-05-15",
    },
  },
  T2: {
    o_week: {
      start: "2025-05-26",
      end: "2025-05-30",
    },
    teaching_period: {
      start: "2025-06-02",
      end: "2025-08-08",
    },
    flex_week: {
      start: "2025-07-07",
      end: "2025-07-13",
    },
    study_period: {
      start: "2025-08-09",
      end: "2025-08-14",
    },
    exams: {
      start: "2025-08-15",
      end: "2025-08-28",
    },
  },
  T3: {
    o_week: {
      start: "2025-09-08",
      end: "2025-09-12",
    },
    teaching_period: {
      start: "2025-09-15",
      end: "2025-11-21",
    },
    flex_week: {
      start: "2025-10-20",
      end: "2025-10-26",
    },
    study_period: {
      start: "2025-11-22",
      end: "2025-11-27",
    },
    exams: {
      start: "2025-11-28",
      end: "2025-12-11",
    },
  },
}
```
