"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart showing agent call activity over time"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150, tablet: 80 },
  { date: "2024-04-02", desktop: 97, mobile: 180, tablet: 95 },
  { date: "2024-04-03", desktop: 167, mobile: 120, tablet: 75 },
  { date: "2024-04-04", desktop: 242, mobile: 260, tablet: 120 },
  { date: "2024-04-05", desktop: 373, mobile: 290, tablet: 160 },
  { date: "2024-04-06", desktop: 301, mobile: 340, tablet: 140 },
  { date: "2024-04-07", desktop: 245, mobile: 180, tablet: 90 },
  { date: "2024-04-08", desktop: 409, mobile: 320, tablet: 180 },
  { date: "2024-04-09", desktop: 59, mobile: 110, tablet: 45 },
  { date: "2024-04-10", desktop: 261, mobile: 190, tablet: 105 },
  { date: "2024-04-11", desktop: 327, mobile: 350, tablet: 165 },
  { date: "2024-04-12", desktop: 292, mobile: 210, tablet: 125 },
  { date: "2024-04-13", desktop: 342, mobile: 380, tablet: 170 },
  { date: "2024-04-14", desktop: 137, mobile: 220, tablet: 85 },
  { date: "2024-04-15", desktop: 120, mobile: 170, tablet: 70 },
  { date: "2024-04-16", desktop: 138, mobile: 190, tablet: 85 },
  { date: "2024-04-17", desktop: 446, mobile: 360, tablet: 200 },
  { date: "2024-04-18", desktop: 364, mobile: 410, tablet: 180 },
  { date: "2024-04-19", desktop: 243, mobile: 180, tablet: 110 },
  { date: "2024-04-20", desktop: 89, mobile: 150, tablet: 60 },
  { date: "2024-04-21", desktop: 137, mobile: 200, tablet: 75 },
  { date: "2024-04-22", desktop: 224, mobile: 170, tablet: 95 },
  { date: "2024-04-23", desktop: 138, mobile: 230, tablet: 100 },
  { date: "2024-04-24", desktop: 387, mobile: 290, tablet: 170 },
  { date: "2024-04-25", desktop: 215, mobile: 250, tablet: 115 },
  { date: "2024-04-26", desktop: 75, mobile: 130, tablet: 55 },
  { date: "2024-04-27", desktop: 383, mobile: 420, tablet: 185 },
  { date: "2024-04-28", desktop: 122, mobile: 180, tablet: 80 },
  { date: "2024-04-29", desktop: 315, mobile: 240, tablet: 135 },
  { date: "2024-04-30", desktop: 454, mobile: 380, tablet: 205 },
  { date: "2024-05-01", desktop: 165, mobile: 220, tablet: 90 },
  { date: "2024-05-02", desktop: 293, mobile: 310, tablet: 140 },
  { date: "2024-05-03", desktop: 247, mobile: 190, tablet: 110 },
  { date: "2024-05-04", desktop: 385, mobile: 420, tablet: 180 },
  { date: "2024-05-05", desktop: 481, mobile: 390, tablet: 220 },
  { date: "2024-05-06", desktop: 498, mobile: 520, tablet: 240 },
  { date: "2024-05-07", desktop: 388, mobile: 300, tablet: 175 },
  { date: "2024-05-08", desktop: 149, mobile: 210, tablet: 85 },
  { date: "2024-05-09", desktop: 227, mobile: 180, tablet: 105 },
  { date: "2024-05-10", desktop: 293, mobile: 330, tablet: 145 },
  { date: "2024-05-11", desktop: 335, mobile: 270, tablet: 155 },
  { date: "2024-05-12", desktop: 197, mobile: 240, tablet: 100 },
  { date: "2024-05-13", desktop: 197, mobile: 160, tablet: 90 },
  { date: "2024-05-14", desktop: 448, mobile: 490, tablet: 210 },
  { date: "2024-05-15", desktop: 473, mobile: 380, tablet: 220 },
  { date: "2024-05-16", desktop: 338, mobile: 400, tablet: 160 },
  { date: "2024-05-17", desktop: 499, mobile: 420, tablet: 230 },
  { date: "2024-05-18", desktop: 315, mobile: 350, tablet: 145 },
  { date: "2024-05-19", desktop: 235, mobile: 180, tablet: 105 },
  { date: "2024-05-20", desktop: 177, mobile: 230, tablet: 95 },
  { date: "2024-05-21", desktop: 82, mobile: 140, tablet: 50 },
  { date: "2024-05-22", desktop: 81, mobile: 120, tablet: 45 },
  { date: "2024-05-23", desktop: 252, mobile: 290, tablet: 125 },
  { date: "2024-05-24", desktop: 294, mobile: 220, tablet: 135 },
  { date: "2024-05-25", desktop: 201, mobile: 250, tablet: 105 },
  { date: "2024-05-26", desktop: 213, mobile: 170, tablet: 95 },
  { date: "2024-05-27", desktop: 420, mobile: 460, tablet: 195 },
  { date: "2024-05-28", desktop: 233, mobile: 190, tablet: 110 },
  { date: "2024-05-29", desktop: 78, mobile: 130, tablet: 45 },
  { date: "2024-05-30", desktop: 340, mobile: 280, tablet: 155 },
  { date: "2024-05-31", desktop: 178, mobile: 230, tablet: 95 },
  { date: "2024-06-01", desktop: 178, mobile: 200, tablet: 85 },
  { date: "2024-06-02", desktop: 470, mobile: 410, tablet: 215 },
  { date: "2024-06-03", desktop: 103, mobile: 160, tablet: 65 },
  { date: "2024-06-04", desktop: 439, mobile: 380, tablet: 200 },
  { date: "2024-06-05", desktop: 88, mobile: 140, tablet: 50 },
  { date: "2024-06-06", desktop: 294, mobile: 250, tablet: 135 },
  { date: "2024-06-07", desktop: 323, mobile: 370, tablet: 150 },
  { date: "2024-06-08", desktop: 385, mobile: 320, tablet: 175 },
  { date: "2024-06-09", desktop: 438, mobile: 480, tablet: 205 },
  { date: "2024-06-10", desktop: 155, mobile: 200, tablet: 85 },
  { date: "2024-06-11", desktop: 92, mobile: 150, tablet: 55 },
  { date: "2024-06-12", desktop: 492, mobile: 420, tablet: 225 },
  { date: "2024-06-13", desktop: 81, mobile: 130, tablet: 45 },
  { date: "2024-06-14", desktop: 426, mobile: 380, tablet: 195 },
  { date: "2024-06-15", desktop: 307, mobile: 350, tablet: 145 },
  { date: "2024-06-16", desktop: 371, mobile: 310, tablet: 170 },
  { date: "2024-06-17", desktop: 475, mobile: 520, tablet: 220 },
  { date: "2024-06-18", desktop: 107, mobile: 170, tablet: 65 },
  { date: "2024-06-19", desktop: 341, mobile: 290, tablet: 155 },
  { date: "2024-06-20", desktop: 408, mobile: 450, tablet: 185 },
  { date: "2024-06-21", desktop: 169, mobile: 210, tablet: 90 },
  { date: "2024-06-22", desktop: 317, mobile: 270, tablet: 145 },
  { date: "2024-06-23", desktop: 480, mobile: 530, tablet: 225 },
  { date: "2024-06-24", desktop: 132, mobile: 180, tablet: 75 },
  { date: "2024-06-25", desktop: 141, mobile: 190, tablet: 80 },
  { date: "2024-06-26", desktop: 434, mobile: 380, tablet: 200 },
  { date: "2024-06-27", desktop: 448, mobile: 490, tablet: 210 },
  { date: "2024-06-28", desktop: 149, mobile: 200, tablet: 85 },
  { date: "2024-06-29", desktop: 103, mobile: 160, tablet: 60 },
  { date: "2024-06-30", desktop: 446, mobile: 400, tablet: 205 },
]

const chartConfig = {
  calls: {
    label: "Calls",
  },
  desktop: {
    label: "Front Desk Agent",
    color: "var(--color-main-accent)",
  },
  mobile: {
    label: "Outbound Agent",
    color: "var(--color-hover-pink)",
  },
  tablet: {
    label: "Support Agent",
    color: "var(--color-grassy-green)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0 bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/10 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-white/90 font-semibold">Agent Call Activity</CardTitle>
          <CardDescription className="text-white/60">
            Showing calls handled by agent type over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex bg-white/5 border-white/20 text-white/80 hover:bg-white/10 focus:ring-main-accent/50"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 backdrop-saturate-150">
            <SelectItem value="90d" className="rounded-lg text-white/80 hover:bg-white/10 focus:bg-white/10">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg text-white/80 hover:bg-white/10 focus:bg-white/10">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg text-white/80 hover:bg-white/10 focus:bg-white/10">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tablet)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tablet)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                  className="!bg-black/90 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-lg backdrop-saturate-200 !text-white [&>*]:!text-white [&_*]:!text-white"
                />
              }
            />
            <Area
              dataKey="tablet"
              type="natural"
              fill="url(#fillTablet)"
              stroke="var(--color-tablet)"
              stackId="a"
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent className="text-white/70" />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
