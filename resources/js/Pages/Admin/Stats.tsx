'use client'
import { Folder, PageProps, ToastMessage, User } from '@/types'
import Layout from '@/Layouts/Layout'
;('use client')
import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/Components/ui/chart'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select'

const chartConfig = {
    visitors: {
        label: 'Visitors',
    },
    desktop: {
        label: 'Регистраций',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig

export default function Stats({
    FoldersTree,
    totalSize,
    msg,
    chartData,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg: ToastMessage
    chartData: any
}>) {
    const [timeRange, setTimeRange] = React.useState('90d')
    const filteredData = chartData.filter((item: any) => {
        const date = new Date(item.date)
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === '30d') {
            daysToSubtract = 30
        } else if (timeRange === '7d') {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize}>
            <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    <Card>
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1 text-center sm:text-left">
                                <CardTitle>Регистрация пользователей</CardTitle>
                                <CardDescription>
                                    Данные за выбранный период
                                </CardDescription>
                            </div>
                            <Select
                                value={timeRange}
                                onValueChange={setTimeRange}>
                                <SelectTrigger
                                    className="w-[160px] rounded-lg sm:ml-auto"
                                    aria-label="Select a value">
                                    <SelectValue placeholder="Last 3 months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem
                                        value="90d"
                                        className="rounded-lg">
                                        3 месяца
                                    </SelectItem>
                                    <SelectItem
                                        value="30d"
                                        className="rounded-lg">
                                        30 дней
                                    </SelectItem>
                                    <SelectItem
                                        value="7d"
                                        className="rounded-lg">
                                        7 дней
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full">
                                <AreaChart data={filteredData}>
                                    <defs>
                                        <linearGradient
                                            id="fillDesktop"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1">
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
                                        {/* <linearGradient
                                            id="fillMobile"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1">
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
                                        </linearGradient> */}
                                    </defs>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString(
                                                'en-US',
                                                {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }
                                            )
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={(value) => {
                                                    return new Date(
                                                        value
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        }
                                                    )
                                                }}
                                                indicator="dot"
                                            />
                                        }
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
                                    <ChartLegend
                                        content={<ChartLegendContent />}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
