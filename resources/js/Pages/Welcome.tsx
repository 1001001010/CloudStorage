import { Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import MainFiles from '@/Components/Folder/Files/MainFiles'

export default function Welcome({
    auth,
    FoldersTree,
}: PageProps<{ FoldersTree: Folder[] }>) {
    return (
        <>
            <Layout FoldersTree={FoldersTree}>
                {auth.user ? (
                    <MainFiles auth={auth} FoldersTree={FoldersTree} />
                ) : (
                    <AuthAlert auth={auth} />
                )}
            </Layout>
        </>
    )
}
