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
import { File, Folder } from 'lucide-react'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import FileContext from './FileContext'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'

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

    const onDrophandler = (e: any) => {
        e.preventDefault()
        let files = [...e.dataTransfer.files]
        if (files[0]['name'].length > 20) {
            setIsDialogOpen(true)
        }
        if (currentFolderId !== 0) {
            setData({
                folder_id: currentFolderId,
                files: files,
                file_name: null,
            })
        } else {
            setData({
                folder_id: null,
                files: files,
                file_name: null,
            })
        }
        const fileName = files[0].name
        const fileExt = fileName.slice(fileName.lastIndexOf('.') + 1)
        setFileExtension(fileExt)
        setDrag(false)
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('file.upload'))
        setIsDialogOpen(false)
    }

    useEffect(() => {
        if (data.files && data.files[0]['name'].length < 20) {
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Имя файла слишком длинное</DialogTitle>
                            <DialogDescription>
                                Введите новое имя файла, что сохранить его
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Input
                                    id="name"
                                    placeholder="Название файла"
                                    maxLength={20}
                                    onChange={(e) =>
                                        setData('file_name', e.target.value)
                                    }
                                />
                                <Label htmlFor="name" className="text-right">
                                    .{fileExtension}
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={processing}>Сохранить</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
