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
import { Folder } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function MainFiles({
    auth,
    FoldersTree,
}: {
    auth: PageProps['auth']
    FoldersTree: FolderTypes[]
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            files: null as File[] | null,
            folder_id: 0,
        })

    const [currentPath, setCurrentPath] = useState<FolderTypes[][]>([
        FoldersTree,
    ])
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Файлы'])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)

    const handleFolderClick = (
        children: FolderTypes[] | undefined,
        title: string,
        folderId: number
    ) => {
        if (children) {
            setCurrentPath([...currentPath, children])
            setBreadcrumbPath([...breadcrumbPath, title])
            setCurrentFolderId(folderId)
        } else {
            setCurrentPath([...currentPath, []])
            setBreadcrumbPath([...breadcrumbPath, title])
            setCurrentFolderId(folderId)
        }
    }

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1))
        setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
        setCurrentFolderId(index === 0 ? 0 : currentPath[index][0].id)
    }

    const [drag, setDrag] = useState(false)

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
        // const files = [...e.dataTransfer.files]
        // console.log(files)
        console.log(currentFolderId)
        setData('files', files)
        setData('folder_id', currentFolderId)
        post(route('file.upload'), {
            onSuccess: () => {
                toast('Данные успешно обновлены')
            },
            onError: () => {
                toast('Ошибка обновления данных')
            },
        })
        setDrag(false)
    }
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
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            className="flex h-full w-full flex-col items-center"
                                            onClick={() =>
                                                handleFolderClick(
                                                    item.children,
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
                                    )
                                )
                            ) : (
                                <div className="col-span-5 text-center">
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
