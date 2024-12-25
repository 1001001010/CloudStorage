import { File as FileType } from '@/types'
import { VideotapeIcon } from 'lucide-react'
import { useForm } from '@inertiajs/react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import ReactPlayer from 'react-player'

export default function FileVideoView({ file }: { file: FileType }) {
    const url = `http://localhost:5173/storage/app/public/` + file.path
    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <VideotapeIcon className="mr-2 h-4 w-4" />
                Воспроизвести
            </DialogTrigger>
            <DialogContent className="min-w-fit">
                <DialogHeader className="h-min">
                    <DialogTitle>Просмотр видео</DialogTitle>
                    <DialogDescription>
                        {file.name} {file.extension.extension}
                    </DialogDescription>
                </DialogHeader>
                <ReactPlayer url={url} controls={true} muted={true} />
            </DialogContent>
        </Dialog>
    )
}
