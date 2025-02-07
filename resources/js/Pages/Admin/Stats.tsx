'use client'
import { Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import * as React from 'react'
import Chart from '@/Components/Admin/Stats/Chart'

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
    chartData: any
}>) {
    return (
        <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize} breadcrumbs={['Панель администратора', 'Статистика']}>
            <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    <Chart chartData={chartData} auth={auth} />
                </div>
            </div>
        </Layout>
    )
}
