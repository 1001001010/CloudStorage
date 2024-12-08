import { Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import MainFiles from '@/Components/Folder/Files/MainFiles'

export default function Welcome({
    auth,
    FoldersTree,
    FoldersAndFiles,
    msg,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    msg: string
}>) {
    return (
        <>
            <Layout FoldersTree={FoldersTree} msg={msg}>
                {auth.user ? (
                    <MainFiles
                        auth={auth}
                        FoldersTree={FoldersTree}
                        FoldersFilesTree={FoldersAndFiles}
                    />
                ) : (
                    <AuthAlert auth={auth} />
                )}
            </Layout>
        </>
    )
}
