'use client'
import { Folder, PageProps, ToastMessage, User } from '@/types'
import Layout from '@/Layouts/Layout'
import { DataTable } from '@/Components/Admin/Users/data-table'
import { columns } from '@/Components/Admin/Users/columns'

export default function UsersList({
    FoldersTree,
    totalSize,
    msg,
    users,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg: ToastMessage
    users: User[]
}>) {
    return (
        <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize} breadcrumbs={['Панель администратора', 'Пользователи']}>
            <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    <DataTable columns={columns} data={users} />
                </div>
            </div>
        </Layout>
    )
}
