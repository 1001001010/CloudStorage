import { useEffect, useState } from 'react'
import { Folder as FolderTypes, PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Folder, FolderPlus } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'
import ForderNameForm from './ForderNameForm'

export default function NewFolder({
    auth,
    open,
    FoldersTree,
}: PageProps<{ open: boolean; FoldersTree: FolderTypes[] }>) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentPath, setCurrentPath] = useState<FolderTypes[][]>([])
    const [breadcrumbPath, setBreadcrumbPath] = useState<
        { title: string; folderId: number }[]
    >([{ title: 'Файлы', folderId: 0 }])
    const [currentFolderId, setCurrentFolderId] = useState<number>(0)

    const handleFolderClick = async (title: string, folderId: number) => {
        try {
            const response = await fetch(`/api/folder/${folderId}/children`)
            const folders = await response.json()

            setCurrentPath([...currentPath, folders])
            setBreadcrumbPath([...breadcrumbPath, { title, folderId }])
            setCurrentFolderId(folderId)
        } catch (err) {
            console.error('Ошибка при получении дочерних папок:', err)
        }
    }

    const handleBreadcrumbClick = async (index: number) => {
        const folderId = breadcrumbPath[index].folderId

        try {
            const response = await fetch(`/api/folder/${folderId}/children`)
            const folders = await response.json()

            setCurrentPath(currentPath.slice(0, index + 1))
            setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
            setCurrentFolderId(folderId)
        } catch (err) {
            console.error('Ошибка при переходе по хлебным крошкам:', err)
        }
    }

    useEffect(() => {
        const fetchRootFolders = async () => {
            try {
                const response = await fetch('/api/folder/0/children')
                const folders = await response.json()
                setCurrentPath([folders])
            } catch (err) {
                console.error('Ошибка при загрузке корневых папок:', err)
            }
        }

        fetchRootFolders()
    }, [])

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="flex w-full" variant="outline">
                        <FolderPlus></FolderPlus>
                        {open == false ? null : <p>Создать папку</p>}
                    </Button>
                </DialogTrigger>
                <DialogContent className="min-h-[350px] w-11/12 max-w-5xl">
                    <DialogHeader>
                        <DialogTitle>Создание папки</DialogTitle>
                        <DialogDescription>
                            Выберите, где создать папку
                        </DialogDescription>
                        <DialogDescription className="py-4 pr-4">
                            <div>
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        {breadcrumbPath.map((item, index) => (
                                            <BreadcrumbItem key={index}>
                                                <BreadcrumbLink
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        handleBreadcrumbClick(
                                                            index
                                                        )
                                                    }>
                                                    {item.title}
                                                </BreadcrumbLink>
                                                {index <
                                                    breadcrumbPath.length -
                                                        1 && (
                                                    <BreadcrumbSeparator />
                                                )}
                                            </BreadcrumbItem>
                                        ))}
                                    </BreadcrumbList>
                                </Breadcrumb>
                                <div className="grid min-h-[200px] grid-cols-5 items-center justify-center gap-5">
                                    {currentPath[currentPath.length - 1] &&
                                    currentPath[currentPath.length - 1].length >
                                        0 ? (
                                        currentPath[currentPath.length - 1].map(
                                            (item, index) => (
                                                <Button
                                                    key={index}
                                                    variant="ghost"
                                                    className="m-2 flex h-full w-full flex-col items-center"
                                                    onClick={() =>
                                                        handleFolderClick(
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
                                            <h1 className="text-lg">
                                                Папка пуста
                                            </h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="h-min">
                        <ForderNameForm
                            auth={auth}
                            folderId={currentFolderId}
                            onSuccessCreate={async () => {
                                try {
                                    const response = await fetch(
                                        `/api/folder/${currentFolderId}/children`
                                    )
                                    const updatedFolders = await response.json()
                                    setCurrentPath([
                                        ...currentPath.slice(0, -1),
                                        updatedFolders,
                                    ])
                                } catch (err) {
                                    console.error(
                                        'Ошибка при обновлении после создания папки:',
                                        err
                                    )
                                }
                            }}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
