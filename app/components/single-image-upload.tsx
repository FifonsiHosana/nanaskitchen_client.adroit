"use client"

import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "~/components/ui/dropzone"
import { CloudUploadIcon, Loader2Icon, Trash2Icon } from "lucide-react"
import { useState } from "react"
import { api } from "../lib/axios"

export function SingleImageUpload({
  value,
  onUploaded,
}: {
  value: string
  onUploaded: (url: string) => void
}) {
  const [isUploading, setIsUploading] = useState(false)

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("image", file)

      try {
        const res = await api.post("/products/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        onUploaded(res.data.url)
        return { status: "success", result: res.data.url }
      } catch {
        return { status: "error", error: "Upload failed" }
      } finally {
        setIsUploading(false)
      }
    },
    validation: {
      accept: { "image/*": [".png", ".jpg", ".jpeg"] },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 1,
    },
  })

  return (
    <Dropzone {...dropzone}>
      <DropZoneArea>
        <DropzoneTrigger className="flex flex-col items-center gap-2 text-sm">
          {isUploading ? (
            <Loader2Icon className="size-6 animate-spin" />
          ) : value ? (
            <img
              src={value}
              alt=""
              className="h-16 w-16 rounded object-cover"
            />
          ) : (
            <CloudUploadIcon className="size-6" />
          )}
          <DropzoneDescription>
            {value ? "Replace image" : "Upload an image"}
          </DropzoneDescription>
        </DropzoneTrigger>
      </DropZoneArea>
      <DropzoneMessage />
      <DropzoneFileList>
        {dropzone.fileStatuses.map((file) => (
          <DropzoneFileListItem key={file.id} file={file}>
            <DropzoneRemoveFile>
              <Trash2Icon className="size-4" />
            </DropzoneRemoveFile>
          </DropzoneFileListItem>
        ))}
      </DropzoneFileList>
    </Dropzone>
  )
}
