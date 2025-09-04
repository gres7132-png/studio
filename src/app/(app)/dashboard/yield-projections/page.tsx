"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Mock data has been removed. 
// In a real app, this data would be dynamically generated or fetched based on the user's portfolio.
const chartData: any[] = [];

const chartConfig = {
  earnings: {
    label: "Earnings ($)",
    color: "hsl(var(--primary))",
  },
}

export default function YieldProjectionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yield Projections</h1>
        <p className="text-muted-foreground">
          Visualize your potential earnings over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projected Monthly Earnings</CardTitle>
          <CardDescription>
            Based on your current investments and market trends.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="earnings" fill="var(--color-earnings)" radius={4} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="min-h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">
                        Make an investment to see your yield projections.
                    </p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
