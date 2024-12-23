import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import { Button } from '@/Components/ui/button'
import {
    Folder as FolderTypes,
    PageProps,
    File as FileTypes,
    File,
} from '@/types'
import { useForm } from '@inertiajs/react'
import { File as FileType, Folder } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import FileContext from './MainFilesComponents/FoldersAndFiles/FileContext'

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
                        <h1 className="text-center text-lg">Корзина пуста</h1>
                    )}
                </div>
            </div>
        </>
    )
}
