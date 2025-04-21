import { File, Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import AuthAlert from './Auth/AuthAlert'
import FileContext from '@/Components/Files/MainFilesComponents/FoldersAndFiles/FileContext'
import { FileQuestion } from 'lucide-react'

export default function Shared({
    auth,
    FoldersTree,
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
                    <div className="expend-h m-1 flex min-h-screen flex-wrap rounded-lg border shadow">
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
                                <div className="flex h-64 flex-col items-center justify-center">
                                    <FileQuestion className="mb-4 h-16 w-16 text-muted-foreground" />
                                    <h1 className="text-xl font-semibold text-primary">
                                        Файлов не найдено
                                    </h1>
                                    <p className="mt-2 text-muted-foreground">
                                        У вас нет файлов с общим доступом
                                    </p>
                                </div>
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
