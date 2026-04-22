import type { GameResult } from "@rahoot/common/types/game"
import ResultModalAnswers from "@rahoot/web/features/manager/components/ResultModal/ResultModalAnswers"
import ResultModalHeader from "@rahoot/web/features/manager/components/ResultModal/ResultModalHeader"
import ResultModalStats from "@rahoot/web/features/manager/components/ResultModal/ResultModalStats"
import ResultModalTable from "@rahoot/web/features/manager/components/ResultModal/ResultModalTable"
import { ResultModalProvider } from "@rahoot/web/features/manager/contexts/result-modal-context"

type Props = {
  result: GameResult
  onClose: () => void
}

const ResultModal = ({ result, onClose }: Props) => (
  <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
    <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded bg-white shadow-2xl">
      <ResultModalProvider result={result} onClose={onClose}>
        <ResultModalHeader />
        <ResultModalAnswers />
        <ResultModalStats />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ResultModalTable />
        </div>
      </ResultModalProvider>
    </div>
  </div>
)

export default ResultModal
