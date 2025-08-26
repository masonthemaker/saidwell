"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useAgentAnalytics } from "@/hooks/use-agent-analytics"

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

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("30d")
  const { chartData, getChartData, isLoadingChart } = useAgentAnalytics()

  // Load chart data on mount and when timeRange changes
  React.useEffect(() => {
    getChartData(5) // Limit to 5 agents
  }, [getChartData])

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (!chartData.length) return []
    
    return chartData.filter((item) => {
      const date = new Date(item.date)
      const today = new Date()
      let daysToSubtract = 90
      if (timeRange === "30d") {
        daysToSubtract = 30
      } else if (timeRange === "7d") {
        daysToSubtract = 7
      }
      const startDate = new Date(today)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return date >= startDate
    })
  }, [chartData, timeRange])

  // Dynamically generate chart config based on agents in data
  const chartConfig = React.useMemo(() => {
    if (!filteredData.length) return { calls: { label: "Calls" } }
    
    const agentNames = new Set<string>()
    filteredData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') agentNames.add(key)
      })
    })

    const colors = [
      "var(--color-main-accent)",
      "var(--color-hover-pink)", 
      "var(--color-grassy-green)",
      "var(--color-chart-purple)",
      "var(--color-chart-amber)"
    ]

    const config: ChartConfig = {
      calls: { label: "Calls" }
    }

    Array.from(agentNames).forEach((agentName, index) => {
      config[agentName] = {
        label: agentName,
        color: colors[index % colors.length]
      }
    })

    return config
  }, [filteredData])

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
        {isLoadingChart ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <p className="text-white/60">Loading chart data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <p className="text-white/60">No data available for the selected time range</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                {Object.entries(chartConfig).map(([key, config]) => {
                  if (key === 'calls') return null
                  const agentKey = key.replace(/\s/g, '')
                  return (
                    <linearGradient key={key} id={`fill${agentKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={config.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={config.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  )
                })}
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
              {Object.entries(chartConfig)
                .filter(([key]) => key !== 'calls')
                .reverse() // Reverse order for proper stacking
                .map(([agentName, config]) => {
                  const agentKey = agentName.replace(/\s/g, '')
                  return (
                    <Area
                      key={agentName}
                      dataKey={agentName}
                      type="natural"
                      fill={`url(#fill${agentKey})`}
                      stroke={config.color}
                      stackId="a"
                    />
                  )
                })}
              <ChartLegend content={<ChartLegendContent className="text-white/70" />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
