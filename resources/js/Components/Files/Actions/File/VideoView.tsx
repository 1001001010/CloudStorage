import { File as FileType } from '@/types'
import { VideotapeIcon } from 'lucide-react'
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
    const url = route('private.video', { id: file.id })

    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <VideotapeIcon className="mr-2 h-4 w-4" />
                Воспроизвести
            </DialogTrigger>
            <DialogContent className="min-w-fit">
                <DialogHeader className="h-min">
                    <DialogTitle>
                        Просмотр видео{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name}.{file.extension.extension}
                        </code>
                    </DialogTitle>
                </DialogHeader>
                <ReactPlayer url={url} controls={true} muted={true} />
            </DialogContent>
        </Dialog>
    )
}
