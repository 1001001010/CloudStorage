import { Folder as FolderTypes, PageProps, File as FileTypes } from '@/types'
import { useForm } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import RenameLoadFile from './MainFilesComponents/RenameLoadFile'
import FoldersAndFiles from './MainFilesComponents/FoldersAndFiles'
import BreadcrumbFile from './MainFilesComponents/BreadcrumbFile'
import { Search, Upload } from 'lucide-react'
import { Input } from '@/Components/ui/input'
import SearchFileInput from '@/Components/Files/MainFilesComponents/SearchFileInput'

export type FolderOrFile = any

export default function MainFiles({
    FoldersFilesTree,
    accessLink,
}: {
    auth: PageProps['auth']
    FoldersTree: FolderTypes[]
    FoldersFilesTree: any[]
    accessLink?: string
}) {
    const { data, setData, post, processing } = useForm({
        folder_id: null as number | null,
        files: null as File[] | null,
        file_name: null as string | null,
    })

    const [fileExtension, setFileExtension] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [currentPath, setCurrentPath] = useState<FolderOrFile[][]>([
        FoldersFilesTree,
    ])
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Файлы'])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)
    const [drag, setDrag] = useState(false)
    const [searchFileName, setSearchFileName] = useState('')

    // console.log(FoldersFilesTree)

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

    const dragLeaveHandler = (e: any) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDrag(false)
        }
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
                    // toast()
                },
            })
        }
    }, [data.files, data.folder_id])

    useEffect(() => {
        if (currentPath.length === 1) {
            setCurrentPath([FoldersFilesTree])
        }
    }, [FoldersFilesTree])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchFileName(e.target.value)
    }

    const filteredItems = currentPath[currentPath.length - 1]?.filter((item) =>
        (item.name?.toLowerCase().includes(searchFileName.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchFileName.toLowerCase()))
    );


    return (
        <>
            {drag ? (
                <div className="expend-h m-4 flex min-h-screen flex-wrap rounded-lg border-2 border-dashed shadow">
                    <div
                        className="h-full w-full p-5"
                        onDragStart={(e) => dragStartHandler(e)}
                        onDragLeave={(e) => dragLeaveHandler(e)}
                        onDragOver={(e) => dragStartHandler(e)}
                        onDrop={(e) => onDrophandler(e)}>
                        <div className="flex h-[33vh] flex-col items-center justify-center gap-4 sm:px-5">
                            <div className="rounded-full border border-dashed p-3">
                                <Upload
                                    className="size-7 text-muted-foreground"
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="flex flex-col gap-px">
                                <p className="text-center text-xl font-medium text-muted-foreground">
                                    Перетащите файлы, чтобы загрузить
                                </p>
                                <p className="text-m text-center text-muted-foreground/70">
                                    Максимальный размер одного файла - 2ГБ
                                </p>
                            </div>
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
                        <div className="min-w-max flex flex-start gap-5 items-center">
                            <SearchFileInput
                                searchFileName={searchFileName}
                                handleSearchChange={handleSearchChange}
                            />
                            <BreadcrumbFile
                                breadcrumbPath={breadcrumbPath}
                                currentPath={currentPath}
                                setCurrentPath={setCurrentPath}
                                setBreadcrumbPath={setBreadcrumbPath}
                                setCurrentFolderId={setCurrentFolderId}
                            />
                        </div>
                        <FoldersAndFiles
                            filteredItems={filteredItems}
                            currentPath={currentPath}
                            handleFolderClick={handleFolderClick}
                            accessLink={accessLink}
                        />
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
