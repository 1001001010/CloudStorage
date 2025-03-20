'use client'
import { Button } from '@/Components/ui/button'
import { FileIcon as FilePdf, FileSpreadsheet, Download } from 'lucide-react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'

export default function ExportButtons() {
    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Статистика хранилища
                </CardTitle>
                <CardDescription>
                    Скачайте отчет в удобном формате
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Получите полную аналитику вашего облачного хранилища с
                        детальной информацией о файлах, использовании
                        пространства и активности пользователей:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <span className="font-medium">PDF-отчет</span> -
                            компактная сводка с ключевыми показателями,
                            распределением по типам файлов и графиками
                            активности
                        </li>
                        <li>
                            <span className="font-medium">Excel-таблица</span> -
                            расширенная статистика с возможностью сортировки,
                            фильтрации и создания собственных диаграмм
                        </li>
                    </ul>
                </div>
                <div className="mt-6 flex justify-between gap-4">
                    <a
                        href={route('reports.pdf')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full">
                        <Button variant="outline" className="w-full flex-1">
                            <FilePdf className="mr-2 h-4 w-4" />
                            Скачать PDF-отчет
                        </Button>
                    </a>
                    <a
                        href={route('statistics.export')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full">
                        <Button variant="outline" className="w-full flex-1">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Скачать Excel-таблицу
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    )
}
