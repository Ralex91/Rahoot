import { MEDIA_TYPES } from "@razzia/common/constants"
import { z } from "zod"

export const questionMediaValidator = z.object({
  type: z
    .enum([MEDIA_TYPES.IMAGE, MEDIA_TYPES.VIDEO, MEDIA_TYPES.AUDIO])
    .optional(),
  url: z.url("errors:quizz.invalidMediaUrl"),
})

const questionValidator = z.object({
  question: z.string().min(1, "errors:quizz.questionEmpty"),
  media: questionMediaValidator.optional(),
  answers: z
    .array(z.string().min(1, "errors:quizz.answerEmpty"))
    .min(2, "errors:quizz.tooFewAnswers")
    .max(4, "errors:quizz.tooManyAnswers"),
  solutions: z
    .union([z.number().int().min(0), z.array(z.number().int().min(0)).min(1)])
    .transform((v) => (Array.isArray(v) ? v : [v])),
  cooldown: z.number().int().min(3).max(15),
  time: z.number().int().min(5).max(120),
})

export const quizzValidator = z.object({
  subject: z.string().min(1, "errors:quizz.subjectEmpty"),
  questions: z.array(questionValidator).min(1, "errors:quizz.noQuestions"),
})

export type QuizzValidated = z.infer<typeof quizzValidator>
