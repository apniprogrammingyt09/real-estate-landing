"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  className?: string
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp = true, className }: StatsCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1 flex items-center",
              trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
            )}
          >
            <span
              className={cn(
                "inline-block w-0 h-0 mr-1",
                trendUp
                  ? "border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent border-b-green-600"
                  : "border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-red-600",
              )}
            />
            {trend} from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}
