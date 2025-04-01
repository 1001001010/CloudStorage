'use client'
import {
    FileStatsType,
    Folder,
    PageProps,
    StoragePercentageType,
    ToastMessage,
} from '@/types'
import * as React from 'react'
import {
    UserChart,
    FileChart,
    ExportButtons,
} from '@/Components/Admin/Stats/index'
import Layout from '@/Layouts/Layout'

export default function Stats({
    auth,
    FoldersTree,
    totalSize,
    msg,
    chartData,
    storage,
    fileStats,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg: ToastMessage
    chartData: { date: string; desktop: number }[]
    storage: StoragePercentageType
    fileStats: FileStatsType
}>) {
    return (
        <Layout
            FoldersTree={FoldersTree}
            msg={msg}
            totalSize={totalSize}
            breadcrumbs={['Панель администратора', 'Статистика']}>
            <div className="expend-h m-1 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    <UserChart chartData={chartData} auth={auth} />
                    <div className="flex w-full flex-row justify-between gap-3 pt-3 max-lg:flex-col">
                        <FileChart
                            auth={auth}
                            storage={storage}
                            fileStats={fileStats}
                        />
                        <ExportButtons />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
