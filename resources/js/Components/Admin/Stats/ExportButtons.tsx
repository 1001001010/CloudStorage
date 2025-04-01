'use client'
import { Button } from '@/Components/ui/button'
import {
    FileIcon as FilePdf,
    FileSpreadsheet,
    Download,
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

export default function ExportButtons() {
    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Содержание отчетов
                </CardTitle>
                <CardDescription>
                    Подробная информация о доступных отчетах
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <Tabs defaultValue="pdf" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                            value="pdf"
                            className="flex items-center gap-2">
                            <FilePdf className="h-4 w-4" />
                            PDF-отчет
                        </TabsTrigger>
                        <TabsTrigger
                            value="excel"
                            className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel-таблица
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pdf" className="mt-4 space-y-4">
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-2 text-sm font-medium">
                                Общая информация
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                PDF-отчет представляет собой компактный документ
                                с ключевыми показателями использования
                                хранилища, оптимизированный для просмотра и
                                презентаций.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-blue-500" />
                                    <h3 className="text-sm font-medium">
                                        Статистика хранилища
                                    </h3>
                                </div>
                                <ul className="ml-6 list-disc text-xs text-muted-foreground">
                                    <li>Общее количество файлов</li>
                                    <li>Суммарный объем данных</li>
                                    <li>Средний размер файла</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <PieChart className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-medium">
                                        Распределение по типам
                                    </h3>
                                </div>
                                <ul className="ml-6 list-disc text-xs text-muted-foreground">
                                    <li>Топ-5 расширений файлов</li>
                                    <li>Процентное соотношение</li>
                                    <li>Объем по каждому типу</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <LineChart className="h-4 w-4 text-green-500" />
                                    <h3 className="text-sm font-medium">
                                        Активность
                                    </h3>
                                </div>
                                <ul className="ml-6 list-disc text-xs text-muted-foreground">
                                    <li>График загрузок по дням</li>
                                    <li>Пиковые периоды активности</li>
                                    <li>Тренды использования</li>
                                </ul>
                            </div>

                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <h3 className="text-sm font-medium">
                                        Недавние загрузки
                                    </h3>
                                </div>
                                <ul className="ml-6 list-disc text-xs text-muted-foreground">
                                    <li>Список последних файлов</li>
                                    <li>Даты и время загрузки</li>
                                    <li>Информация о размерах</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-2 text-xs">
                            <span>Формат документа: PDF</span>
                            <Badge variant="outline" className="text-xs">
                                Оптимизирован для печати
                            </Badge>
                        </div>

                        {/* Кнопки скачивания для PDF */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <a
                                href={route('reports.pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
                                    <FilePdf className="mr-2 h-4 w-4" />
                                    Стандартный отчет
                                </Button>
                            </a>
                            <a
                                href={route('reports.pdf', { period: 'month' })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button
                                    variant="outline"
                                    className="w-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700">
                                    <Clock className="mr-2 h-4 w-4" />
                                    За текущий месяц
                                </Button>
                            </a>
                        </div>
                    </TabsContent>

                    <TabsContent value="excel" className="mt-4 space-y-4">
                        <div className="rounded-lg border p-4">
                            <h3 className="mb-2 text-sm font-medium">
                                Расширенная аналитика
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Excel-таблица содержит детальные данные с
                                возможностью дополнительной обработки,
                                сортировки, фильтрации и создания собственных
                                визуализаций.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <Table className="h-4 w-4 text-blue-500" />
                                    <h3 className="text-sm font-medium">
                                        Листы данных
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
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

                            <div className="rounded-lg border p-3">
                                <div className="mb-2 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-medium">
                                        Пользовательская аналитика
                                    </h3>
                                </div>
                                <ul className="ml-6 list-disc text-xs text-muted-foreground">
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

                        <div className="mt-2 flex items-center justify-between rounded-lg bg-muted p-2 text-xs">
                            <span>Формат документа: XLSX</span>
                            <Badge variant="outline" className="text-xs">
                                Интерактивные данные
                            </Badge>
                        </div>

                        {/* Кнопки скачивания для Excel */}
                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <a
                                href={route('statistics.export')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                    Полный отчет
                                </Button>
                            </a>
                            <a
                                href={route('statistics.export', {
                                    period: 'month',
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full">
                                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                                    <Clock className="mr-2 h-4 w-4" />
                                    За текущий месяц
                                </Button>
                            </a>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
                <p>
                    Отчеты автоматически формируются на основе текущих данных
                    хранилища. Для получения отчета за конкретный период
                    используйте соответствующие параметры.
                </p>
            </CardFooter>
        </Card>
    )
}
