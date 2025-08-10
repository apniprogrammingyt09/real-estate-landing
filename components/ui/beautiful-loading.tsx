import { cn } from "@/lib/utils"

interface BeautifulLoadingProps {
  className?: string
  variant?: "card" | "skeleton" | "spinner" | "pulse"
  text?: string
}

export function BeautifulLoading({ className, variant = "skeleton", text }: BeautifulLoadingProps) {
  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-secondary rounded-full animate-spin animation-delay-150"></div>
        </div>
        {text && <p className="mt-4 text-sm text-gray-600 animate-pulse">{text}</p>}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg h-full w-full"></div>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border p-4 animate-pulse", className)}>
        <div className="flex space-x-4">
          <div className="w-48 h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg"></div>
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-20"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default skeleton
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-lg h-48 w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-3/4"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded w-1/2"></div>
      </div>
    </div>
  )
}

// Add shimmer animation to globals.css
export const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`
