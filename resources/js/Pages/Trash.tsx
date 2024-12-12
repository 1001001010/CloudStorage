import { Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import TrashFiles from '@/Components/Files/TrashFiles'

export default function Trash({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    files,
    msg,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    files: any
    msg: string
}>) {
    return (
        <>
            <Layout
                FoldersTree={FoldersTree}
                msg={msg}
                totalSize={totalSize}
                breadcrumbs={['Корзина']}>
                {auth.user ? <TrashFiles auth={auth} files={files} /> : null}
            </Layout>
        </>
    )
}
