import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import { Button } from '@/Components/ui/button'
import { Folder as FolderTypes, PageProps, File as FileTypes } from '@/types'
import { useForm } from '@inertiajs/react'
import { Folder } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import FileContext from './FileContext'
import RenameLoadFile from './MainFilesComponents/RenameLoadFile'
import BreadcrumbFile from './MainFilesComponents/BreadcrumbFile'

export type FolderOrFile = any

export default function MainFiles({
    auth,
    FoldersTree,
    FoldersFilesTree,
    accessLink,
}: {
    auth: PageProps['auth']
    FoldersTree: FolderTypes[]
    FoldersFilesTree: any[]
    accessLink?: string
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            folder_id: null as number | null,
            files: null as File[] | null,
            file_name: null as string | null,
        })

    const [fileExtension, setFileExtension] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentPath, setCurrentPath] = useState<FolderOrFile[][]>([
        FoldersFilesTree,
    ])
    const [toastMessages, setToastMessages] = useState<any[]>([])
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
        const combinedItems: FolderOrFile[] = []

        if (Array.isArray(children)) {
            combinedItems.push(...children)
        }

        if (files && !Array.isArray(files)) {
            combinedItems.push(...Object.values(files))
        } else if (Array.isArray(files)) {
            combinedItems.push(...files)
        }

        if (combinedItems.length === 0 && Array.isArray(files)) {
            combinedItems.push(...files)
        }

        setCurrentPath([...currentPath, combinedItems])
        setBreadcrumbPath([...breadcrumbPath, title])
        setCurrentFolderId(folderId)
    }

    function dragStartHandler(e: any) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(e: any) {
        e.preventDefault()
        setDrag(false)
    }

    const onDrophandler = (e: any) => {
        e.preventDefault()
        let files = [...e.dataTransfer.files]
        if (files.some((file) => file.name.length > 20)) {
            setIsDialogOpen(true)
        }
        setData({
            folder_id: currentFolderId !== 0 ? currentFolderId : null,
            files: files,
            file_name: null,
        })
        const fileName = files[0].name
        const fileExt = fileName.slice(fileName.lastIndexOf('.') + 1)
        setFileExtension(fileExt)
        setDrag(false)
    }

    useEffect(() => {
        if (data.files && data.files[0]['name'].length < 20) {
            post(route('file.upload'), {
                onSuccess: () => {
                    window.location.reload()
                },
            })
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
                        <BreadcrumbFile
                            breadcrumbPath={breadcrumbPath}
                            currentPath={currentPath}
                            setCurrentPath={setCurrentPath}
                            setBreadcrumbPath={setBreadcrumbPath}
                            setCurrentFolderId={setCurrentFolderId}
                        />
                        <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                            {currentPath[currentPath.length - 1] &&
                            currentPath[currentPath.length - 1].length > 0 ? (
                                currentPath[currentPath.length - 1].map(
                                    (item, index) => (
                                        <div key={index}>
                                            {item.hasOwnProperty('name') ? (
                                                <FileContext
                                                    file={item}
                                                    accessLink={accessLink}
                                                />
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

            <RenameLoadFile
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                post={post}
                setData={setData}
                processing={processing}
                fileExtension={fileExtension}
            />
        </>
    )
}
