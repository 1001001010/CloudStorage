import { Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'

export default function Welcome({
    auth,
    FoldersTree,
}: PageProps<{ FoldersTree: Folder[] }>) {
    return (
        <>
            <Layout FoldersTree={FoldersTree}>
                {auth.user ? (
                    <div className="m-4 flex min-h-screen flex-wrap rounded-lg border pb-3 shadow max-sm:m-1 max-sm:p-1 md:flex-nowrap">
                        <div className="min-h-full w-full p-4 text-gray-900 dark:text-gray-100 max-sm:p-1 md:w-2/3"></div>
                    </div>
                ) : (
                    <AuthAlert auth={auth} />
                )}
            </Layout>
        </>
    )
}
