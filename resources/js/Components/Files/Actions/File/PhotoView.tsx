import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog'
import { LucideMousePointerSquareDashed } from 'lucide-react'
import { File as FileType } from '@/types'

export default function FilePhotoView({ file }: { file: FileType }) {
    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground">
                <LucideMousePointerSquareDashed className="mr-2 h-4 w-4" />
                Открыть изображение
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Просмотр изображения
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name}.{file.extension.extension}
                        </code>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex h-full w-full items-center justify-center">
                    <img
                        src={`/storage/${file.path}`}
                        alt={file.name}
                        className="max-h-full max-w-full rounded-lg object-contain shadow-md"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
