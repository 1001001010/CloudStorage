'use client'
import { Button } from '@/Components/ui/button'
import {
    FileIcon as FilePdf,
    FileSpreadsheet,
    Table,
    Clock,
    LineChart,
    PieChart,
    HardDrive,
    BarChart3,
    Users,
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { useIsMobile } from '@/hooks/use-mobile'

const route = (path: string, params?: Record<string, string>) => {
    let url = path
    if (params) {
        const queryParams = new URLSearchParams(params)
        url += '?' + queryParams.toString()
    }
    return url
}

export default function ExportButtons() {
    const isMobile = useIsMobile()

    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                    Содержание отчетов
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Подробная информация о доступных отчетах
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-3 sm:px-6">
                <Tabs defaultValue="pdf" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="pdf"
                            className="flex items-center gap-2">
                            <FilePdf className="h-3 w-3 sm:h-4 sm:w-4" />
                            {isMobile ? 'PDF' : 'PDF-отчет'}
                        </TabsTrigger>
                        <TabsTrigger
                            value="excel"
                            className="flex items-center gap-2">
                            <FileSpreadsheet className="h-3 w-3 sm:h-4 sm:w-4" />
                            {isMobile ? 'Excel' : 'Excel-таблица'}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="pdf"
                        className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                        <div className="rounded-lg border p-3 sm:p-4">
                            <h3 className="mb-1 text-xs font-medium sm:mb-2 sm:text-sm">
                                Общая информация
                            </h3>
                            <p className="text-[10px] text-muted-foreground sm:text-xs">
                                PDF-отчет представляет собой компактный документ
                                с ключевыми показателями использования
                                хранилища, оптимизированный для просмотра и
                                презентаций.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <HardDrive className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Статистика хранилища
                                    </h3>
                                </div>
                                <ul className="ml-4 list-disc text-[10px] text-muted-foreground sm:ml-6 sm:text-xs">
                                    <li>Общее количество файлов</li>
                                    <li>Суммарный объем данных</li>
                                    <li>Средний размер файла</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <PieChart className="h-3 w-3 text-indigo-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Распределение по типам
                                    </h3>
                                </div>
                                <ul className="ml-4 list-disc text-[10px] text-muted-foreground sm:ml-6 sm:text-xs">
                                    <li>Топ-5 расширений файлов</li>
                                    <li>Процентное соотношение</li>
                                    <li>Объем по каждому типу</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <LineChart className="h-3 w-3 text-green-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Активность
                                    </h3>
                                </div>
                                <ul className="ml-4 list-disc text-[10px] text-muted-foreground sm:ml-6 sm:text-xs">
                                    <li>График загрузок по дням</li>
                                    <li>Пиковые периоды активности</li>
                                    <li>Тренды использования</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <Clock className="h-3 w-3 text-amber-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Недавние загрузки
                                    </h3>
                                </div>
                                <ul className="ml-4 list-disc text-[10px] text-muted-foreground sm:ml-6 sm:text-xs">
                                    <li>Список последних файлов</li>
                                    <li>Даты и время загрузки</li>
                                    <li>Информация о размерах</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-3 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                            <a
                                href="reports/pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 hover:text-red-700 sm:px-3 sm:py-2 sm:text-sm">
                                    <FilePdf className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    Скачать отчет
                                </Button>
                            </a>
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="excel"
                        className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                        <div className="rounded-lg border p-3 sm:p-4">
                            <h3 className="mb-1 text-xs font-medium sm:mb-2 sm:text-sm">
                                Расширенная аналитика
                            </h3>
                            <p className="text-[10px] text-muted-foreground sm:text-xs">
                                Excel-таблица содержит детальные данные с
                                возможностью дополнительной обработки,
                                сортировки, фильтрации и создания собственных
                                визуализаций.
                            </p>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <Table className="h-3 w-3 text-blue-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Листы данных
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-[10px] text-muted-foreground sm:grid-cols-2 sm:text-xs">
                                    <div className="rounded bg-muted/50 p-2">
                                        <span className="font-medium">
                                            Общая статистика
                                        </span>
                                        <p className="mt-1">
                                            Ключевые метрики и показатели
                                            использования хранилища
                                        </p>
                                    </div>
                                    <div className="rounded bg-muted/50 p-2">
                                        <span className="font-medium">
                                            Типы файлов
                                        </span>
                                        <p className="mt-1">
                                            Детальная статистика по расширениям
                                            и MIME-типам
                                        </p>
                                    </div>
                                    <div className="rounded bg-muted/50 p-2">
                                        <span className="font-medium">
                                            Размеры файлов
                                        </span>
                                        <p className="mt-1">
                                            Распределение файлов по размерам с
                                            группировкой
                                        </p>
                                    </div>
                                    <div className="rounded bg-muted/50 p-2">
                                        <span className="font-medium">
                                            Активность
                                        </span>
                                        <p className="mt-1">
                                            Данные о загрузках с разбивкой по
                                            дням и пользователям
                                        </p>
                                    </div>
                                    <div className="rounded bg-muted/50 p-2">
                                        <span className="font-medium">
                                            Использование
                                        </span>
                                        <p className="mt-1">
                                            Статистика использования хранилища
                                            по пользователям
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg border p-2 sm:p-3">
                                <div className="mb-1 flex items-center gap-1 sm:mb-2 sm:gap-2">
                                    <Users className="h-3 w-3 text-indigo-500 sm:h-4 sm:w-4" />
                                    <h3 className="text-xs font-medium sm:text-sm">
                                        Пользовательская аналитика
                                    </h3>
                                </div>
                                <ul className="ml-4 list-disc text-[10px] text-muted-foreground sm:ml-6 sm:text-xs">
                                    <li>
                                        Топ пользователей по количеству файлов
                                    </li>
                                    <li>Топ пользователей по объему данных</li>
                                    <li>
                                        Активность пользователей по периодам
                                    </li>
                                    <li>Средние показатели использования</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-2 text-[10px] sm:text-xs">
                            <span>Формат документа: XLSX</span>
                            <Badge
                                variant="outline"
                                className="text-[10px] sm:text-xs">
                                Интерактивные данные
                            </Badge>
                        </div>

                        <div className="mt-3 gap-2 sm:mt-4 sm:grid-cols-2 sm:gap-3">
                            <a
                                href="statistics/export"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button className="w-full bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700 sm:px-3 sm:py-2 sm:text-sm">
                                    <FileSpreadsheet className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                                    Полный отчет
                                </Button>
                            </a>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="border-t px-3 pt-3 text-[10px] text-muted-foreground sm:px-6 sm:pt-4 sm:text-xs">
                <p>
                    Отчеты автоматически формируются на основе текущих данных
                    хранилища. Для получения отчета за конкретный период
                    используйте соответствующие параметры.
                </p>
            </CardFooter>
        </Card>
    )
}
