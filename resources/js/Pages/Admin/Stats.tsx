'use client'
import { Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import * as React from 'react'
import { UserChart, FileChart, ExportButtons } from '@/Components/Admin/Stats/index'

export default function Stats({
    auth,
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
    chartData: { date: string, desktop: number }[] }
>) {
    return (
        <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize} breadcrumbs={['Панель администратора', 'Статистика']}>
            <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    <UserChart chartData={chartData} auth={auth} />
                    <div className="flex justify-between flex-row max-md:flex-col w-full pt-3 gap-3">
                        <FileChart/>
                        <ExportButtons />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
