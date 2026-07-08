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
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { Button } from "./ui/button"
import { api } from "../lib/axios"

export function MultiImages({
  setValue,
  getValues,
  imagesWatch,
  removeExistingImage,
  product,
}) {
  const [uploadingCount, setUploadingCount] = useState(0)
  const isUploading = uploadingCount > 0
  const dropzoneRef = useRef<HTMLDivElement>(null)
  const [mainImage, setMainImage] = useState<string>(
    product.image !== null ? product.mainImage : product.images[0]
  )
  console.log(` main${product.mainImage} and array ${product.images[0]} `)
  console.log("product", product)

  useEffect(() => {
    setValue("image", mainImage, { shouldDirty: true })
  }, [mainImage])

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      const input = dropzoneRef.current?.querySelector(
        "input[type='file']"
      ) as HTMLInputElement | null
      if (input) input.value = ""

      const alreadyUploaded = Array.isArray(imagesWatch)
        ? imagesWatch.length
        : 0
      if (alreadyUploaded >= 4) {
        return {
          status: "error",
          error: `Maximum 4 images allowed`,
        }
      }
      setUploadingCount((c) => c + 1)
      const formData = new FormData()
      formData.append("image", file)
      // formData.append("upload_preset", "default_preset")

      // const response = await fetch(
      //   "https://api.cloudinary.com/v1_1/du3ndnjmd/image/upload",
      //   { method: "POST", body: formData }
      // )

      try {
        const res = await api.post("/products/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        const data = await res.data
        const cloudinaryUrl = data.url

        // 2. Append the URL to RHF's otherImages array
        const currentImages = getValues("images") ?? []
        setValue("otherImages", [...currentImages, cloudinaryUrl], {
          shouldDirty: true,
        })
        return {
          status: "success",
          result: cloudinaryUrl,
        }
      } finally {
        setUploadingCount((c) => Math.max(0, c - 1))
      }
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 4,
    },
  })

  //   useEffect(() => {
  //     const successfulImages = dropzone.fileStatuses
  //       .filter((f) => f.status === "success")
  //       .map((f) => f.result)
  //     const original = product?.images ?? []
  //     const merged = [...new Set([...original, ...successfulImages])]

  //     setValue("images", merged, { shouldDirty: true })
  //   }, [dropzone.fileStatuses])

  useEffect(() => {
    const successfulImages = dropzone.fileStatuses
      .filter((f) => f.status === "success")
      .map((f) => f.result)

    //   const original = Array.isArray(product?.images) ? product.images : []
    const current = Array.isArray(getValues("images"))
      ? getValues("images")
      : []

    const merged = [...new Set([...current, ...successfulImages])]

    if (dropzone.fileStatuses.length > 0) {
      setValue("images", merged, { shouldDirty: true })
    }
  }, [dropzone.fileStatuses])

  return (
    <div className="not-prose flex flex-col gap-4">
      <div className="flex gap-3">
        {Array.isArray(imagesWatch) &&
          imagesWatch?.map((image: string, index) => (
            <div
              key={index}
              className="relative h-32 max-w-30 rounded-2xl border object-cover"
            >
              <img
                key={image}
                src={image}
                alt=""
                className={`aspect-video h-full w-full cursor-pointer rounded-md object-cover ${mainImage === image && "border-8 border-red-500"}`}
                onClick={() => setMainImage(image)}
              />
              <div className="">
                <Button
                  className="absolute top-1 right-1"
                  onClick={() => removeExistingImage(image)}
                  type="button"
                  variant={"destructive"}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </div>
          ))}
      </div>

      <Dropzone {...dropzone}>
        <div>
          <div className="flex justify-between">
            <DropzoneDescription>
              Please select up to 4 images
            </DropzoneDescription>
            <DropzoneMessage />
          </div>
          <DropZoneArea
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = ""
            }}
          >
            <DropzoneTrigger
              onChange={() => (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = ""
              }}
              className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm"
            >
              {isUploading ? (
                <>
                  <Loader2Icon className="size-8 animate-spin text-primary" />
                  <div>
                    <p className="font-semibold text-primary">
                      Uploading image{uploadingCount > 1 ? "s" : ""}…
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Please wait while your image
                      {uploadingCount > 1 ? "s are" : " is"} being uploaded
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CloudUploadIcon className="size-8" />
                  <div>
                    <p className="font-semibold">Upload listing images</p>
                    <p className="text-sm text-muted-foreground">
                      Click here or drag and drop to upload
                    </p>
                  </div>
                </>
              )}
            </DropzoneTrigger>
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  )
}
