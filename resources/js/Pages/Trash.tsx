import { Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import MainFiles from '@/Components/Files/MainFiles'
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
            <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize}>
                {auth.user ? <TrashFiles auth={auth} files={files} /> : null}
            </Layout>
        </>
    )
}
