import { PageProps } from '@/types'
import { Link } from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Folder, FolderPlus, GalleryVerticalEnd } from 'lucide-react'

const data = {
    navMain: [
        {
            title: 'Название 1',
        },
        {
            title: 'Название 2',
        },
        {
            title: 'Название 3',
        },
        {
            title: 'Название 4',
        },
        {
            title: 'Название 5',
        },
        {
            title: 'Название 6',
        },
        {
            title: 'Название 7',
        },
    ],
}

export default function NewFolder({ open }: PageProps<{ open: boolean }>) {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex w-full" variant="outline">
                        <FolderPlus></FolderPlus>
                        {open == false ? null : <p>Создать папку</p>}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Создание папки</DialogTitle>
                        <DialogDescription>
                            <div className="grid grid-cols-4 gap-2">
                                {data.navMain.map((item, index) => (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        className="m-2 flex h-full w-full flex-col">
                                        <Folder></Folder>
                                        {item.title}
                                    </Button>
                                ))}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}
