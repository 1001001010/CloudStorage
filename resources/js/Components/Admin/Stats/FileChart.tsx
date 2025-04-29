'use client'

import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/Components/ui/chart'
import { FileStatsType, PageProps, StoragePercentageType } from '@/types'

const chartConfig = {
    visitors: {
        label: 'Количество файлов',
    },
    chrome: {
        label: 'Документы',
        color: 'hsl(var(--chart-1))',
    },
    safari: {
        label: 'Фото',
        color: 'hsl(var(--chart-2))',
    },
    firefox: {
        label: 'Видео',
        color: 'hsl(var(--chart-3))',
    },
    edge: {
        label: 'Архивы',
        color: 'hsl(var(--chart-4))',
    },
    database: {
        label: 'Базы данных',
        color: 'hsl(var(--chart-5))',
    },
    code: {
        label: 'Код',
        color: 'hsl(var(--chart-6))',
    },
    audio: {
        label: 'Аудио',
        color: 'hsl(var(--chart-7))',
    },
    presentation: {
        label: 'Презентации',
        color: 'hsl(var(--chart-8))',
    },
    tables: {
        label: 'Таблицы',
        color: 'hsl(var(--chart-9))',
    },
    other: {
        label: 'Другое',
        color: 'hsl(var(--chart-10))',
    },
    customColor1: {
        label: 'Тип 1',
        color: 'hsl(200, 100%, 50%)',
    },
    customColor2: {
        label: 'Тип 2',
        color: 'hsl(300, 100%, 50%)',
    },
    customColor3: {
        label: 'Тип 3',
        color: 'hsl(100, 100%, 50%)',
    },
    customColor4: {
        label: 'Тип 4',
        color: 'hsl(150, 100%, 50%)',
    },
} satisfies ChartConfig

export default function FileChart({
    storage,
    fileStats,
}: PageProps<{
    storage: StoragePercentageType
    fileStats: FileStatsType
}>) {
    const chartData = [
        {
            browser: 'Документы',
            visitors: fileStats['Документы']?.count || 0,
            fill: 'hsl(var(--chart-1))',
        },
        {
            browser: 'Фото',
            visitors: fileStats['Фото']?.count || 0,
            fill: 'hsl(var(--chart-2))',
        },
        {
            browser: 'Видео',
            visitors: fileStats['Видео']?.count || 0,
            fill: 'hsl(var(--chart-3))',
        },
        {
            browser: 'Архивы',
            visitors: fileStats['Архивы']?.count || 0,
            fill: 'hsl(var(--chart-4))',
        },
        {
            browser: 'Базы данных',
            visitors: fileStats['Базы_данных']?.count || 0,
            fill: 'hsl(var(--chart-5))',
        },
        {
            browser: 'Код',
            visitors: fileStats['Код']?.count || 0,
            fill: 'hsl(var(--chart-6))',
        },
        {
            browser: 'Аудио',
            visitors: fileStats['Аудио']?.count || 0,
            fill: 'hsl(var(--chart-7))',
        },
        {
            browser: 'Презентации',
            visitors: fileStats['Презентации']?.count || 0,
            fill: 'hsl(var(--chart-8))',
        },
        {
            browser: 'Таблицы',
            visitors: fileStats['Таблицы']?.count || 0,
            fill: 'hsl(var(--chart-9))',
        },
        {
            browser: 'Другое',
            visitors: fileStats['Другое']?.count || 0,
            fill: 'hsl(var(--chart-10))',
        },
    ]

    const totalVisitors = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
    }, [])

    return (
        <Card className="flex h-max w-full flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Обзор файлового хранилища</CardTitle>
                <CardDescription>Распределение типов файлов</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]">
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
                            strokeWidth={5}>
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold">
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground">
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
                    Использование хранилища: {storage.percentage}% (занято{' '}
                    {storage.used} ГБ из {storage.total} ГБ)
                </div>
                <div className="leading-none text-muted-foreground">
                    Показано распределение файлов по всему хранилищу
                </div>
            </CardFooter>
        </Card>
    )
}
