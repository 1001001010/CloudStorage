import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Folder as FolderTypes, PageProps, File as FileTypes } from '@/types'
import { useForm } from '@inertiajs/react'
import { File, Folder } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import FileContext from './FileContext'

export type FolderOrFile = any

export default function MainFiles({
    auth,
    FoldersTree,
    FoldersFilesTree,
}: {
    auth: PageProps['auth']
    FoldersTree: FolderTypes[]
    FoldersFilesTree: any[]
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            folder_id: 0,
            files: null as File[] | null,
        })

    const [currentPath, setCurrentPath] = useState<FolderOrFile[][]>([
        FoldersFilesTree,
    ])
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Файлы'])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)
    const [drag, setDrag] = useState(false)

    const filesRef = useRef<File[] | null>(null)

    const handleFolderClick = (
        children: FolderTypes[] | undefined,
        files: FileTypes[] | undefined,
        title: string,
        folderId: number
    ) => {
        // console.log('Children: ', children)
        // console.log('Files: ', files)

        const combinedItems: FolderOrFile[] = []

        if (Array.isArray(children)) {
            combinedItems.push(...children)
        }

        if (files && !Array.isArray(files)) {
            combinedItems.push(...Object.values(files))
        } else if (Array.isArray(files)) {
            combinedItems.push(...files)
        }

        // console.log('Combined items: ', combinedItems)

        if (combinedItems.length === 0 && Array.isArray(files)) {
            combinedItems.push(...files)
        }

        setCurrentPath([...currentPath, combinedItems])
        setBreadcrumbPath([...breadcrumbPath, title])
        setCurrentFolderId(folderId)
    }

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1))
        setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
        setCurrentFolderId(index === 0 ? 0 : currentPath[index][0].id)
    }

    function dragStartHandler(e: any) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(e: any) {
        e.preventDefault()
        setDrag(false)
    }

    function onDrophandler(e: any) {
        e.preventDefault()
        let files = [...e.dataTransfer.files]
        setData('files', files)
        if (currentFolderId !== 0) {
            setData('folder_id', currentFolderId)
        }
        filesRef.current = files
        setDrag(false)
    }

    useEffect(() => {
        if (filesRef.current && filesRef.current.length > 0) {
            const files = filesRef.current
            setData('files', files)

            post(route('file.upload'))
        }
    }, [data.files, data.folder_id])

    return (
        <>
            {drag ? (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border-2 border-dashed shadow">
                    <div
                        className="h-full w-full"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                        onDrop={(e) => onDrophandler(e)}>
                        <div className="flex w-full flex-col gap-2 pt-5 text-center">
                            <p className="text-xl">Перетащите файлы</p>
                            <p className="text-lg text-white/80">
                                максимальный размер файла - 2ГБ
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border shadow">
                    <div
                        className="h-full w-full p-5"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}>
                        <Breadcrumb className="pb-2">
                            <BreadcrumbList>
                                {breadcrumbPath.map((title, index) => (
                                    <BreadcrumbItem key={index}>
                                        <BreadcrumbLink
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handleBreadcrumbClick(index)
                                            }>
                                            {title}
                                        </BreadcrumbLink>
                                        {index < breadcrumbPath.length - 1 && (
                                            <BreadcrumbSeparator />
                                        )}
                                    </BreadcrumbItem>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                            {currentPath[currentPath.length - 1] &&
                            currentPath[currentPath.length - 1].length > 0 ? (
                                currentPath[currentPath.length - 1].map(
                                    (item, index) => (
                                        <div key={index}>
                                            {item.hasOwnProperty('name') ? (
                                                <FileContext file={item} />
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    className="flex h-full w-full flex-col items-center"
                                                    onClick={() =>
                                                        handleFolderClick(
                                                            item.children,
                                                            item.files,
                                                            item.title,
                                                            item.id
                                                        )
                                                    }>
                                                    <Folder
                                                        size={80}
                                                        className="!h-20 !w-20"
                                                    />
                                                    {item.title}
                                                </Button>
                                            )}
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="col-span-7 text-center">
                                    <h1 className="text-lg">Папка пуста</h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
