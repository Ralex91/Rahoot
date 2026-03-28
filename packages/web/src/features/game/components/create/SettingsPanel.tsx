import type {
  ManagerSettings,
  ManagerSettingsUpdate,
} from "@mindbuzz/common/types/game"
import Button from "@mindbuzz/web/features/game/components/Button"
import Input from "@mindbuzz/web/features/game/components/Input"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

type Props = {
  settings: ManagerSettings
  uploadedAudioUrl: string | null
  onSave: (_settings: ManagerSettingsUpdate) => void
  onUploadLocalAudio: (_data: { filename: string; content: string }) => void
}

const LOCAL_AUDIO_PREFIX = "/media/"

const getAudioSource = (value?: string) =>
  value?.startsWith(LOCAL_AUDIO_PREFIX) ? "local" : "remote"

const readFileAsBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unsupported file payload"))

        return
      }

      const [, base64 = ""] = reader.result.split(",")
      resolve(base64)
    }

    reader.readAsDataURL(file)
  })

const SettingsPanel = ({
  settings,
  uploadedAudioUrl,
  onSave,
  onUploadLocalAudio,
}: Props) => {
  const [managerPassword, setManagerPassword] = useState("")
  const [audioSource, setAudioSource] = useState<"remote" | "local">(
    getAudioSource(settings.defaultAudio),
  )
  const [remoteAudioUrl, setRemoteAudioUrl] = useState("")
  const [localAudioUrl, setLocalAudioUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    const defaultAudio = settings.defaultAudio ?? ""
    const nextSource = getAudioSource(settings.defaultAudio)

    setAudioSource(nextSource)
    setRemoteAudioUrl(nextSource === "remote" ? defaultAudio : "")
    setLocalAudioUrl(nextSource === "local" ? defaultAudio : "")
  }, [settings.defaultAudio])

  useEffect(() => {
    if (!uploadedAudioUrl) {
      return
    }

    setAudioSource("local")
    setLocalAudioUrl(uploadedAudioUrl)
    setSelectedFile(null)
  }, [uploadedAudioUrl])

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Choose an audio file first")

      return
    }

    try {
      const content = await readFileAsBase64(selectedFile)

      onUploadLocalAudio({
        filename: selectedFile.name,
        content,
      })
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to read audio file",
      )
    }
  }

  const handleSave = () => {
    const nextAudio =
      audioSource === "remote" ? remoteAudioUrl.trim() : localAudioUrl.trim()

    onSave({
      managerPassword: managerPassword.trim() || undefined,
      defaultAudio: nextAudio || null,
    })
    setManagerPassword("")
  }

  const currentAudio = audioSource === "remote" ? remoteAudioUrl : localAudioUrl

  return (
    <div className="z-10 flex w-full max-w-4xl flex-col gap-5 rounded-md bg-white p-4 shadow-sm md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500">
          Question-level audio still overrides the global quiz audio.
        </p>
      </div>

      <section className="rounded-md bg-gray-50 p-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold">Manager password</h2>
          <p className="text-sm text-gray-500">
            Leave this blank if you do not want to change it.
          </p>
        </div>

        <Input
          type="password"
          value={managerPassword}
          onChange={(event) => setManagerPassword(event.target.value)}
          placeholder="New manager password"
          className="w-full"
        />
      </section>

      <section className="rounded-md bg-gray-50 p-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold">Global quiz audio</h2>
          <p className="text-sm text-gray-500">
            This plays during answer selection when a question does not provide
            its own audio.
          </p>
        </div>

        <div className="mb-4 flex gap-2">
          <Button
            className={audioSource === "remote" ? "px-4" : "bg-white px-4 !text-black"}
            onClick={() => setAudioSource("remote")}
            type="button"
          >
            Remote URL
          </Button>
          <Button
            className={audioSource === "local" ? "px-4" : "bg-white px-4 !text-black"}
            onClick={() => setAudioSource("local")}
            type="button"
          >
            Local file
          </Button>
        </div>

        {audioSource === "remote" ? (
          <Input
            value={remoteAudioUrl}
            onChange={(event) => setRemoteAudioUrl(event.target.value)}
            placeholder="https://example.com/audio.mp3"
            className="w-full"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Input
              type="file"
              accept="audio/*"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] ?? null)
              }
            />
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <Button
                className="px-4"
                onClick={handleUpload}
                type="button"
              >
                Upload selected file
              </Button>
              <span className="text-sm text-gray-500">
                Files are stored in the sibling `media` folder.
              </span>
            </div>
            {localAudioUrl && (
              <p className="text-sm text-gray-600">Current file: {localAudioUrl}</p>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Button
            className="bg-white px-4 !text-black"
            onClick={() => {
              setRemoteAudioUrl("")
              setLocalAudioUrl("")
              setSelectedFile(null)
            }}
            type="button"
          >
            Clear audio
          </Button>
          <Button className="px-4" onClick={handleSave} type="button">
            Save settings
          </Button>
        </div>

        {currentAudio && (
          <audio className="mt-4 w-full" controls src={currentAudio} />
        )}
      </section>
    </div>
  )
}

export default SettingsPanel

