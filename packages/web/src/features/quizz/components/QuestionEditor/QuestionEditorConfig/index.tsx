import ConfigField from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorConfig/ConfigField"
import ConfigNumberInput from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorConfig/ConfigNumberInput"
import ConfigSection from "@rahoot/web/features/quizz/components/QuestionEditor/QuestionEditorConfig/ConfigSection"
import { useQuizzEditor } from "@rahoot/web/features/quizz/contexts/quizz-editor-context"
import { Clock, Timer } from "lucide-react"

const QuestionEditorConfig = () => {
  const { currentQuestion, currentIndex, updateQuestion } = useQuizzEditor()

  const handleUpdateQuestion = (key: string) => (value: string | number) => {
    updateQuestion(currentIndex, { [key]: value })
  }

  return (
    <aside className="z-10 flex w-68 shrink-0 flex-col gap-6 overflow-auto bg-white p-4 shadow-sm">
      <ConfigSection title="Timings">
        <ConfigField>
          <ConfigField.Label
            icon={<Clock className="size-4" />}
            label="Question display"
          />
          <ConfigNumberInput
            value={currentQuestion.cooldown}
            min={3}
            onChange={handleUpdateQuestion("cooldown")}
          />
          <ConfigField.Description>
            Duration before answers appear
          </ConfigField.Description>
        </ConfigField>

        <ConfigField>
          <ConfigField.Label
            icon={<Timer className="size-4" />}
            label="Answer time"
          />
          <ConfigNumberInput
            value={currentQuestion.time}
            min={5}
            onChange={handleUpdateQuestion("time")}
          />
          <ConfigField.Description>
            Time players have to answer
          </ConfigField.Description>
        </ConfigField>
      </ConfigSection>
    </aside>
  )
}

export default QuestionEditorConfig
