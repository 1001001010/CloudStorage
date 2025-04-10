import { PageProps, File as FileTypes } from '@/types'
import FileContext from '@/Components/Files/MainFilesComponents/FoldersAndFiles/FileContext'
import { Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { AutoFormatFileSize } from '@/lib/utils'
import { useSettingsStore } from '@/store/settings-store'
import { useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'

export type FolderOrFile = any

export default function TrashFiles({
    files,
    trashSize,
}: {
    files: FileTypes[]
    auth: PageProps['auth']
    trashSize: number
}) {
    const { viewMode, itemSize } = useSettingsStore()

    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm()

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        destroy(route('trash.destroy'))
    }

    const gridClasses =
        'grid min-h-[150px] grids items-center justify-center gap-5'
    const listClasses = 'flex flex-col min-h-[150px] gap-2'
    return (
        <>
            <div className="expend-h m-1 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-5">
                    {files.length ? (
                        <>
                            <div className="flex items-center justify-start pb-4">
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={submit}>
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Очистить корзину (
                                    {AutoFormatFileSize(trashSize)})
                                </Button>
                            </div>
                            <div
                                className={
                                    viewMode === 'grid'
                                        ? gridClasses
                                        : listClasses
                                }>
                                {files.map((item: any, index: number) => (
                                    <div key={index}>
                                        {item.hasOwnProperty('name') ? (
                                            <FileContext
                                                file={item}
                                                trash={true}
                                                viewMode={viewMode}
                                                itemSize={itemSize}
                                            />
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </>
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
