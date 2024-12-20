import { Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import MainFiles from '@/Components/Files/MainFiles'

export default function Welcome({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    msg,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg: ToastMessage
}>) {
    return (
        <>
            <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize}>
                {auth.user ? (
                    <MainFiles
                        auth={auth}
                        FoldersTree={FoldersTree}
                        FoldersFilesTree={FoldersAndFiles}
                        accessLink={msg?.access_link}
                    />
                ) : (
                    <AuthAlert auth={auth} />
                )}
            </Layout>
        </>
    )
}
