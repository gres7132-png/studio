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

const chartData = [
  { month: "January", earnings: 186 },
  { month: "February", earnings: 305 },
  { month: "March", earnings: 237 },
  { month: "April", earnings: 273 },
  { month: "May", earnings: 209 },
  { month: "June", earnings: 214 },
  { month: "July", earnings: 250 },
  { month: "August", earnings: 278 },
  { month: "September", earnings: 300 },
  { month: "October", earnings: 320 },
  { month: "November", earnings: 350 },
  { month: "December", earnings: 380 },
]

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
        </CardContent>
      </Card>
    </div>
  )
}
