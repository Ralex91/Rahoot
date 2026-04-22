import * as RadixAlertDialog from "@radix-ui/react-alert-dialog"
import Button from "@rahoot/web/components/Button"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

type Props = {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
}

const AlertDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: Props) => {
  const { t } = useTranslation()

  return (
    <RadixAlertDialog.Root>
      <RadixAlertDialog.Trigger asChild>{trigger}</RadixAlertDialog.Trigger>

      <RadixAlertDialog.Portal>
        <RadixAlertDialog.Overlay className="data-[state=open]:animate-fade-in fixed inset-0 z-50 bg-black/40" />

        <RadixAlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-xl">
          <RadixAlertDialog.Title className="text-lg font-semibold text-gray-900">
            {title}
          </RadixAlertDialog.Title>

          <RadixAlertDialog.Description className="mt-2 text-gray-500">
            {description}
          </RadixAlertDialog.Description>

          <div className="mt-6 flex justify-end gap-2">
            <RadixAlertDialog.Cancel asChild>
              <Button className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                {t("cancel")}
              </Button>
            </RadixAlertDialog.Cancel>

            <RadixAlertDialog.Action asChild>
              <Button
                className="bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                onClick={onConfirm}
              >
                {confirmLabel ?? t("confirm")}
              </Button>
            </RadixAlertDialog.Action>
          </div>
        </RadixAlertDialog.Content>
      </RadixAlertDialog.Portal>
    </RadixAlertDialog.Root>
  )
}

export default AlertDialog
