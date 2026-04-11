import type { QuestionMediaType } from "@rahoot/common/types/game"
import { questionMediaValidator } from "@rahoot/common/validators/quizz"
import Button from "@rahoot/web/components/Button"
import Card from "@rahoot/web/components/Card"
import QuestionMedia from "@rahoot/web/components/QuestionMedia"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import { Image, ImageOff, Music, Video } from "lucide-react"
import { type ChangeEvent } from "react"
import toast from "react-hot-toast"

const QuestionEditorMedia = () => {
  const { updateQuestion, currentIndex, currentQuestion } = useQuizzEditor()
  const questionMedia = currentQuestion.media

  const hadnleChangeMediaType = (type: QuestionMediaType) => () => {
    const result = questionMediaValidator.safeParse({
      type,
      url: questionMedia?.url,
    })

    if (!result.success) {
      toast.error(result.error.issues[0].message)

      return
    }

    updateQuestion(currentIndex, { media: result.data })
  }

  const handleRemoveMedia = () => {
    if (!questionMedia) {
      return
    }

    updateQuestion(currentIndex, { media: undefined })
  }

  const handleChangeMedia = (e: ChangeEvent<HTMLInputElement>) => {
    updateQuestion(currentIndex, {
      media: { url: e.target.value },
    })
  }

  return (
    <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 p-4">
      <QuestionMedia media={currentQuestion.media} alt="Question Media" />

      {!questionMedia?.type && (
        <Card className="my-14 flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-2 bg-white">
          <ImageOff className="size-16 stroke-gray-600" />
          <p className="text-center text-sm text-gray-600">
            Add an image, video or audio to your question
          </p>
          <input
            className="focus:border-primary w-full max-w-md rounded-md border-2 border-gray-300 px-3 py-2 text-sm outline-none"
            placeholder={`Enter URL...`}
            value={questionMedia?.url || ""}
            onChange={handleChangeMedia}
          />
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              onClick={hadnleChangeMediaType("image")}
              className={`bg-gray-200 text-gray-600 transition-colors hover:bg-gray-200`}
            >
              <div className="flex items-center gap-1.5">
                <Image className="size-6" />
                <p>Image</p>
              </div>
            </Button>
            <Button
              onClick={hadnleChangeMediaType("video")}
              className={`bg-gray-200 text-gray-600 transition-colors hover:bg-gray-200`}
            >
              <div className="flex items-center gap-1.5">
                <Video className="size-6" />
                <p>Video</p>
              </div>
            </Button>
            <Button
              onClick={hadnleChangeMediaType("audio")}
              className={`bg-gray-200 text-gray-600 transition-colors hover:bg-gray-200`}
            >
              <div className="flex items-center gap-1.5">
                <Music className="size-6" />
                <p>Audio</p>
              </div>
            </Button>
          </div>
        </Card>
      )}

      {questionMedia?.type && (
        <div className="absolute bottom-4">
          <Button
            className="rounded-sm bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            onClick={handleRemoveMedia}
          >
            Remove
          </Button>
        </div>
      )}
    </div>
  )
}

export default QuestionEditorMedia
