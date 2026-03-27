import type { QuizRunHistorySummary } from "@rahoot/common/types/game"
import Button from "@rahoot/web/features/game/components/Button"

type Props = {
  history: QuizRunHistorySummary[]
  onDownload: (_runId: string) => void
}

const HistoryPanel = ({ history, onDownload }: Props) => (
  <div className="z-10 flex w-full max-w-5xl flex-col gap-5 rounded-md bg-white p-4 shadow-sm md:p-6">
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">Run history</h1>
      <span className="text-sm font-semibold text-gray-500">
        {history.length} runs
      </span>
    </div>

    <div className="space-y-3">
      {history.length === 0 && (
        <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-gray-500">
          No quiz runs recorded yet.
        </div>
      )}

      {history.map((run) => (
        <div
          key={run.id}
          className="flex flex-col gap-3 rounded-md border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">{run.subject}</h2>
            <p className="text-sm text-gray-600">
              Finished: {new Date(run.endedAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Players: {run.totalPlayers} | Questions: {run.questionCount} |
              Winner: {run.winner ?? "n/a"}
            </p>
          </div>

          <Button className="px-4" onClick={() => onDownload(run.id)}>
            Download CSV
          </Button>
        </div>
      ))}
    </div>
  </div>
)

export default HistoryPanel
