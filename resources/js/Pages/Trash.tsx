import { Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import TrashFiles from '@/Components/Files/TrashFiles'

export default function Trash({
    auth,
    FoldersTree,
    totalSize,
    trashSize,
    files,
    msg,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    trashSize: number
    files: any
    msg: ToastMessage
}>) {
    return (
        <>
            <Layout
                FoldersTree={FoldersTree}
                msg={msg}
                totalSize={totalSize}
                breadcrumbs={['Корзина']}>
                {auth.user ? (
                    <TrashFiles
                        auth={auth}
                        files={files}
                        trashSize={trashSize}
                    />
                ) : null}
            </Layout>
        </>
    )
}
