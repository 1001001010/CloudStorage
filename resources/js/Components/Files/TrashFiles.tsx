import { PageProps, File as FileTypes } from '@/types'

import FileContext from './MainFilesComponents/FoldersAndFiles/FileContext'
import { Trash2 } from 'lucide-react'

export type FolderOrFile = any

export default function TrashFiles({
    files,
}: {
    files: FileTypes[]
    auth: PageProps['auth']
}) {
    return (
        <>
            <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    {files.length ? (
                        <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                            {files.map((item: any, index: number) => (
                                <div key={index}>
                                    {item.hasOwnProperty('name') ? (
                                        <FileContext file={item} trash={true} />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center">
                            <Trash2 className="mb-4 h-16 w-16 text-muted-foreground" />
                            <h1 className="text-xl font-semibold text-primary">
                                Корзина пуста
                            </h1>
                            <p className="mt-2 text-muted-foreground">
                                Здесь будут отображаться удаленные файлы
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
