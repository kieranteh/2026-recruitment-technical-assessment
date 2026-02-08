import { z } from "zod";

const SessionSchema = z.object({
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const SummerTermSchema = z.object({
  o_week: SessionSchema.optional(),
  teaching_period: SessionSchema,
  flex_week: SessionSchema.optional(),
  study_period: SessionSchema.optional(),
  exams: SessionSchema,
});

const TermSchema = z.object({
  o_week: SessionSchema,
  teaching_period: SessionSchema,
  flex_week: SessionSchema,
  study_period: SessionSchema,
  exams: SessionSchema,
});

export const YearSchema = z.object({
  U1: SummerTermSchema,
  T1: TermSchema,
  T2: TermSchema,
  T3: TermSchema,
});

export type YearData = z.infer<typeof YearSchema>;

export const CacheSchema = z.object({
  data: z.record(z.string(), YearSchema),
  meta: z.object({
    lastRefreshOk: z.boolean(),
    lastRefreshAt: z.string().optional(),
  }),
});

export type CacheShape = z.infer<typeof CacheSchema>;
