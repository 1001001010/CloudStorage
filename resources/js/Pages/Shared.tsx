import { File, Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import MainFiles from '@/Components/Files/MainFiles'
import FileContext from '@/Components/Files/MainFilesComponents/FoldersAndFiles/FileContext'

export default function Welcome({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    msg,
    files,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg?: ToastMessage
    files: File[]
}>) {
    return (
        <>
            <Layout
                FoldersTree={FoldersTree}
                msg={msg}
                totalSize={totalSize}
                breadcrumbs={['Общий доступ']}>
                {auth.user ? (
                    <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                        <div className="h-full w-full p-5">
                            {files.length ? (
                                <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                                    {files.map((item: any, index: number) => (
                                        <div key={index}>
                                            {item.hasOwnProperty('name') ? (
                                                <FileContext
                                                    file={item}
                                                    shared={true}
                                                />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <h1 className="text-center text-lg">
                                    Файлов не найдено
                                </h1>
                            )}
                        </div>
                    </div>
                ) : (
                    <AuthAlert auth={auth} />
                )}
            </Layout>
        </>
    )
}
