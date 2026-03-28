import type { Quizz, QuizzWithId } from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"
import Input from "@rahoot/web/features/game/components/Input"
import clsx from "clsx"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  quizz: QuizzWithId
  onBack: () => void
  onSave: (_quizzId: string, _quizz: Quizz) => void
}

const createEmptyQuestion = () => ({
  question: "",
  answers: ["", ""],
  solution: 0,
  cooldown: 5,
  time: 20,
  image: "",
  video: "",
  audio: "",
})

const QuizzEditor = ({ quizz, onBack, onSave }: Props) => {
  const [draft, setDraft] = useState<Quizz>({
    subject: quizz.subject,
    questions: quizz.questions.map((question) => ({
      ...question,
      image: question.image ?? "",
      video: question.video ?? "",
      audio: question.audio ?? "",
    })),
  })

  useEffect(() => {
    setDraft({
      subject: quizz.subject,
      questions: quizz.questions.map((question) => ({
        ...question,
        image: question.image ?? "",
        video: question.video ?? "",
        audio: question.audio ?? "",
      })),
    })
  }, [quizz])

  const updateQuestion = (
    index: number,
    updater: (_question: Quizz["questions"][number]) => Quizz["questions"][number],
  ) => {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question, questionIndex) =>
        questionIndex === index ? updater(question) : question,
      ),
    }))
  }

  const handleQuestionText = (index: number, value: string) => {
    updateQuestion(index, (question) => ({
      ...question,
      question: value,
    }))
  }

  const handleQuestionNumberField = (
    index: number,
    field: "cooldown" | "time" | "solution",
    value: number,
  ) => {
    updateQuestion(index, (question) => ({
      ...question,
      [field]: value,
    }))
  }

  const handleQuestionAssetField = (
    index: number,
    field: "image" | "video" | "audio",
    value: string,
  ) => {
    updateQuestion(index, (question) => ({
      ...question,
      [field]: value,
    }))
  }

  const handleAnswerChange =
    (questionIndex: number, answerIndex: number) => (value: string) => {
      updateQuestion(questionIndex, (question) => ({
        ...question,
        answers: question.answers.map((answer, index) =>
          index === answerIndex ? value : answer,
        ),
      }))
    }

  const handleAddQuestion = () => {
    setDraft((current) => ({
      ...current,
      questions: [...current.questions, createEmptyQuestion()],
    }))
  }

  const handleDeleteQuestion = (index: number) => () => {
    if (draft.questions.length === 1) {
      toast.error("A quiz needs at least one question")

      return
    }

    setDraft((current) => ({
      ...current,
      questions: current.questions.filter((_, questionIndex) => questionIndex !== index),
    }))
  }

  const handleAddAnswer = (questionIndex: number) => () => {
    const question = draft.questions[questionIndex]

    if (question.answers.length >= 4) {
      toast.error("Questions can have at most 4 answers")

      return
    }

    updateQuestion(questionIndex, (currentQuestion) => ({
      ...currentQuestion,
      answers: [...currentQuestion.answers, ""],
    }))
  }

  const handleDeleteAnswer =
    (questionIndex: number, answerIndex: number) => () => {
      const question = draft.questions[questionIndex]

      if (question.answers.length <= 2) {
        toast.error("Questions need at least 2 answers")

        return
      }

      updateQuestion(questionIndex, (currentQuestion) => {
        const answers = currentQuestion.answers.filter(
          (_, index) => index !== answerIndex,
        )
        const solution =
          currentQuestion.solution >= answers.length
            ? answers.length - 1
            : currentQuestion.solution > answerIndex
              ? currentQuestion.solution - 1
              : currentQuestion.solution

        return {
          ...currentQuestion,
          answers,
          solution,
        }
      })
    }

  const handleSave = () => {
    onSave(quizz.id, draft)
  }

  return (
    <div className="z-10 flex w-full max-w-6xl flex-col gap-5 rounded-md bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">Editing quiz</p>
          <h1 className="text-2xl font-bold">{draft.subject || quizz.subject}</h1>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <Button className="bg-white px-4 !text-black" onClick={onBack}>
            Back to quizzes
          </Button>
          <Button className="px-4" onClick={handleSave}>
            Save quiz
          </Button>
        </div>
      </div>

      <div className="rounded-md bg-gray-50 p-4">
        <label className="mb-2 block text-sm font-semibold text-gray-600">
          Quiz title
        </label>
        <Input
          value={draft.subject}
          onChange={(event) =>
            setDraft((current) => ({ ...current, subject: event.target.value }))
          }
          placeholder="Quiz title"
          className="w-full"
        />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Questions</h2>
        <Button className="px-4" onClick={handleAddQuestion}>
          Add question
        </Button>
      </div>

      <div className="space-y-4">
        {draft.questions.map((question, questionIndex) => (
          <section
            key={`${quizz.id}-${questionIndex}`}
            className="rounded-md border border-gray-200 bg-gray-50 p-4"
          >
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-bold">Question {questionIndex + 1}</h3>
              <Button
                className={clsx(
                  "bg-red-500 px-4",
                  draft.questions.length === 1 && "opacity-50",
                )}
                onClick={handleDeleteQuestion(questionIndex)}
                type="button"
              >
                Delete question
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Question text
                </label>
                <textarea
                  className="min-h-24 w-full rounded-sm p-2 text-lg font-semibold outline-2 outline-gray-300"
                  value={question.question}
                  onChange={(event) =>
                    handleQuestionText(questionIndex, event.target.value)
                  }
                  placeholder="Question text"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Cooldown (seconds)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={question.cooldown}
                  onChange={(event) =>
                    handleQuestionNumberField(
                      questionIndex,
                      "cooldown",
                      Number(event.target.value),
                    )
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Answer time (seconds)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={question.time}
                  onChange={(event) =>
                    handleQuestionNumberField(
                      questionIndex,
                      "time",
                      Number(event.target.value),
                    )
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Image URL
                </label>
                <Input
                  value={question.image ?? ""}
                  onChange={(event) =>
                    handleQuestionAssetField(
                      questionIndex,
                      "image",
                      event.target.value,
                    )
                  }
                  placeholder="Optional image URL"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Video URL
                </label>
                <Input
                  value={question.video ?? ""}
                  onChange={(event) =>
                    handleQuestionAssetField(
                      questionIndex,
                      "video",
                      event.target.value,
                    )
                  }
                  placeholder="Optional video URL"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-600">
                  Audio URL
                </label>
                <Input
                  value={question.audio ?? ""}
                  onChange={(event) =>
                    handleQuestionAssetField(
                      questionIndex,
                      "audio",
                      event.target.value,
                    )
                  }
                  placeholder="Optional audio URL"
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-base font-bold">Answers</h4>
                <Button
                  type="button"
                  className="px-3 py-1 text-sm"
                  onClick={handleAddAnswer(questionIndex)}
                >
                  Add answer
                </Button>
              </div>

              <div className="space-y-3">
                {question.answers.map((answer, answerIndex) => (
                  <div
                    key={`${quizz.id}-${questionIndex}-${answerIndex}`}
                    className="grid gap-2 md:grid-cols-[minmax(0,1fr)_140px_120px]"
                  >
                    <Input
                      value={answer}
                      onChange={(event) =>
                        handleAnswerChange(
                          questionIndex,
                          answerIndex,
                        )(event.target.value)
                      }
                      placeholder={`Answer ${answerIndex + 1}`}
                    />

                    <label className="flex items-center gap-2 rounded-sm bg-white px-3 py-2 outline-2 outline-gray-300">
                      <input
                        type="radio"
                        name={`solution-${questionIndex}`}
                        checked={question.solution === answerIndex}
                        onChange={() =>
                          handleQuestionNumberField(
                            questionIndex,
                            "solution",
                            answerIndex,
                          )
                        }
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        Correct answer
                      </span>
                    </label>

                    <Button
                      type="button"
                      className={clsx(
                        "bg-red-500 px-3 py-1 text-sm",
                        question.answers.length <= 2 && "opacity-50",
                      )}
                      onClick={handleDeleteAnswer(questionIndex, answerIndex)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default QuizzEditor
