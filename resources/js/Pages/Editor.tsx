import { File, Folder, PageProps, ToastMessage } from '@/types'
import Layout from '@/Layouts/Layout'
import TrashFiles from '@/Components/Files/TrashFiles'
import EditorField from '@/Components/Editor/EditorField'

export default function Editor({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    file,
    msg,
    language,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    file: File
    msg: ToastMessage
    language: string
}>) {
    return (
        <>
            <Layout
                FoldersTree={FoldersTree}
                msg={msg}
                totalSize={totalSize}
                breadcrumbs={[
                    'Редактирование',
                    `${file.name + '.' + file.extension.extension}`,
                ]}>
                {auth.user ? (
                    <EditorField auth={auth} file={file} language={language} />
                ) : null}
            </Layout>
        </>
    )
}
