import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
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
    forders,
}: PageProps<{ open: boolean; forders: FolderTypes[] }>) {
    const [currentPath, setCurrentPath] = useState<FolderTypes[][]>([forders])
    const [breadcrumbPath, setBreadcrumbPath] = useState<string[]>(['Файлы'])

    const handleFolderClick = (
        children: FolderTypes[] | undefined,
        title: string
    ) => {
        if (children) {
            setCurrentPath([...currentPath, children])
            setBreadcrumbPath([...breadcrumbPath, title])
        } else {
            // Если нет дочерних элементов, отображаем сообщение "Папка пуста"
            setCurrentPath([...currentPath, []])
            setBreadcrumbPath([...breadcrumbPath, title])
        }
    }

    const handleBreadcrumbClick = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1))
        setBreadcrumbPath(breadcrumbPath.slice(0, index + 1))
    }

    return (
        <>
            <Dialog>
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
                            <Breadcrumb>
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
                                            {index <
                                                breadcrumbPath.length - 1 && (
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
                                                        item.children,
                                                        item.title
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
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="h-min">
                        <ForderNameForm auth={auth} />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
