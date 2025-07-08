"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onImageUpload: (image: string) => void
  isDark: boolean
}

export default function ImageUpload({ onImageUpload, isDark }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        onImageUpload(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    onImageUpload("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!uploadedImage ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? isDark
                ? "border-purple-400 bg-purple-400/10"
                : "border-purple-500 bg-purple-50"
              : isDark
                ? "border-gray-600 hover:border-purple-400"
                : "border-gray-300 hover:border-purple-500"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleChange} className="hidden" />

          <div className="space-y-4">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                isDark ? "bg-purple-400/20" : "bg-purple-100"
              }`}
            >
              <Upload className={`w-8 h-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
            </div>

            <div>
              <p className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                Drop your image here or click to browse
              </p>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Supports JPG, JPEG, PNG files
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className={`rounded-2xl overflow-hidden border-2 ${isDark ? "border-gray-600" : "border-gray-200"}`}>
            <img src={uploadedImage || "/placeholder.svg"} alt="Uploaded" className="w-full h-64 object-cover" />
          </div>

          <Button
            onClick={removeImage}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="mt-4 flex items-center gap-2">
            <ImageIcon className={`w-5 h-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
            <span className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-600"}`}>
              Image uploaded successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
