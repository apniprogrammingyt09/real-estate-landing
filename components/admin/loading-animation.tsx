"use client"

import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface LoadingAnimationProps {
  status: "idle" | "loading" | "success" | "error"
  message?: string
}

export default function LoadingAnimation({ status, message }: LoadingAnimationProps) {
  if (status === "idle" || !message) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      {status === "loading" && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-blue-600">{message}</span>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-600">{message}</span>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-600">{message}</span>
        </>
      )}
    </div>
  )
}
