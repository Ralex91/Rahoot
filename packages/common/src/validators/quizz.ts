import { MEDIA_TYPES } from "@rahoot/common/constants"
import { z } from "zod"

export const questionMediaValidator = z.object({
  type: z
    .enum([MEDIA_TYPES.IMAGE, MEDIA_TYPES.VIDEO, MEDIA_TYPES.AUDIO])
    .optional(),
  url: z.url("Media URL must be a valid URL"),
})

const questionValidator = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  media: questionMediaValidator.optional(),
  answers: z
    .array(z.string().min(1, "Answer cannot be empty"))
    .min(2, "A question must have at least 2 answers")
    .max(4, "A question cannot have more than 4 answers"),
  solutions: z
    .union([z.number().int().min(0), z.array(z.number().int().min(0)).min(1)])
    .transform((v) => (Array.isArray(v) ? v : [v])),
  cooldown: z.number().int().min(3).max(15),
  time: z.number().int().min(5).max(120),
})

export const quizzValidator = z.object({
  subject: z.string().min(1, "Subject cannot be empty"),
  questions: z
    .array(questionValidator)
    .min(1, "A quizz must have at least one question"),
})

export type QuizzValidated = z.infer<typeof quizzValidator>
