import { File, Folder, PageProps } from '@/types'
import Layout from '@/Layouts/Layout'
import TrashFiles from '@/Components/Files/TrashFiles'
import EditorField from '@/Components/Editor/EditorField'

export default function Trash({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    file,
    msg,
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    file: File
    msg: string
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
                {auth.user ? <EditorField auth={auth} file={file} /> : null}
            </Layout>
        </>
    )
}
