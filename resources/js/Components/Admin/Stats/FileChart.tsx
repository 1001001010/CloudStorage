"use client"

import * as React from "react"
import { HardDrive, TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart"
const chartData = [
    { browser: "документы", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "фото", visitors: 200, fill: "var(--color-safari)" },
    { browser: "видео", visitors: 287, fill: "var(--color-firefox)" },
    { browser: "архивы", visitors: 173, fill: "var(--color-edge)" },
    { browser: "другое", visitors: 190, fill: "var(--color-other)" },
]

const chartConfig = {
    visitors: {
        label: "Количество файлов",
    },
    chrome: {
        label: "Документы",
        color: "hsl(var(--chart-1))",
    },
    safari: {
        label: "Фото",
        color: "hsl(var(--chart-2))",
    },
    firefox: {
        label: "Видео",
        color: "hsl(var(--chart-3))",
    },
    edge: {
        label: "Архивы",
        color: "hsl(var(--chart-4))",
    },
    other: {
        label: "Другое",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export default function FileChart() {
    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Обзор файлового хранилища</CardTitle>
                <CardDescription>Распределение типов файлов</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="visitors"
                            nameKey="browser"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Всего файлов
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Использование хранилища: 75% <HardDrive className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">Показано распределение файлов по всему хранилищу</div>
            </CardFooter>
        </Card>
    )
}
