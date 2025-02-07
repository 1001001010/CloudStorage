"use client"
import { Button } from "@/Components/ui/button"
import { FileIcon as FilePdf, FileSpreadsheet, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"

export default function ExportButtons() {
    const handleDownloadPDF = () => {
        console.log("Downloading PDF report")
    }

    const handleDownloadExcel = () => {
        console.log("Downloading Excel report")
    }

    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Экспорт данных
                </CardTitle>
                <CardDescription>Выберите формат для скачивания отчета</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between">
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Наши отчеты содержат подробную статистику и аналитику по использованию системы. Выберите наиболее подходящий
                        для вас формат:
                    </p>
                    <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                        <li>PDF - для презентаций и быстрого просмотра</li>
                        <li>Excel - для углубленного анализа и обработки данных</li>
                    </ul>
                </div>
                <div className="mt-6 flex justify-between gap-4">
                    <Button variant="outline" onClick={handleDownloadPDF} className="flex-1">
                        <FilePdf className="mr-2 h-4 w-4" />
                        PDF
                    </Button>
                    <Button variant="outline" onClick={handleDownloadExcel} className="flex-1">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

