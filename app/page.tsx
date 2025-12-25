"use client"

import { useState, useEffect } from "react"
import { FileUploader } from "@/components/file-uploader"
import { TextInput } from "@/components/text-input"
import { EncryptionPanel } from "@/components/encryption-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"file" | "text">("file")
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState<string>("")
  const [encryptedData, setEncryptedData] = useState<ArrayBuffer | null>(null)
  const [decryptedData, setDecryptedData] = useState<ArrayBuffer | null>(null)
  const [originalFileName, setOriginalFileName] = useState<string>("")
  const [viewMode, setViewMode] = useState<"input" | "encrypted" | "decrypted">("input")
  const [videoLoaded, setVideoLoaded] = useState(false)

  useEffect(() => {
    // Force video reload
    const videoElement = document.getElementById("background-video") as HTMLVideoElement
    if (videoElement) {
      videoElement.load()
      videoElement.play().catch((e) => console.error("Video autoplay failed:", e))
    }
  }, [])

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setText("")
    setEncryptedData(null)
    setDecryptedData(null)
    setViewMode("input")
  }

  const handleTextChange = (value: string) => {
    setText(value)
    setFile(null)
    setEncryptedData(null)
    setDecryptedData(null)
    setViewMode("input")
  }

  const handleEncryptedData = (data: ArrayBuffer) => {
    setEncryptedData(data)
    setViewMode("encrypted")
  }

  const handleDecryptedData = (data: ArrayBuffer, fileName: string) => {
    setDecryptedData(data)
    setOriginalFileName(fileName)
    setViewMode("decrypted")
  }

  const handleReset = () => {
    setFile(null)
    setText("")
    setEncryptedData(null)
    setDecryptedData(null)
    setViewMode("input")
  }

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          id="background-video"
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={handleVideoLoad}
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/imageback.jpg" // Fallback image while video loads
        >
          <source src="/images/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Static Background (fallback) */}
      {!videoLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url(/images/imageback.jpg)" }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <Card className="bg-black/70 backdrop-blur-sm border-cyan-500/30 text-white shadow-lg shadow-cyan-500/20">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-cyan-400">Secure File Encryption</h1>

            <Tabs
              defaultValue="file"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as "file" | "text")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900/50">
                <TabsTrigger value="file" className="text-cyan-400 data-[state=active]:bg-cyan-900/50">
                  File Encryption
                </TabsTrigger>
                <TabsTrigger value="text" className="text-cyan-400 data-[state=active]:bg-cyan-900/50">
                  Text Encryption
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-0">
                <FileUploader onFileSelect={handleFileSelect} label="Select file to encrypt/decrypt" file={file} />
              </TabsContent>

              <TabsContent value="text" className="mt-0">
                <TextInput value={text} onChange={handleTextChange} />
              </TabsContent>
            </Tabs>

            <EncryptionPanel
              file={file}
              text={text}
              inputType={activeTab}
              encryptedData={encryptedData}
              decryptedData={decryptedData}
              originalFileName={originalFileName}
              viewMode={viewMode}
              onEncryptedData={handleEncryptedData}
              onDecryptedData={handleDecryptedData}
              onViewModeChange={setViewMode}
              onReset={handleReset}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

