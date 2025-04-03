import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog'
import { Skeleton } from '@/Components/ui/skeleton'
import { LucideMousePointerSquareDashed } from 'lucide-react'
import { File as FileType } from '@/types'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

export default function FilePhotoView({ file }: { file: FileType }) {
    const [fileUrl, setFileUrl] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
            .get(`/api/file-url/${file.id}`)
            .then((response) => {
                setFileUrl(response.data.fileUrl)
            })
            .catch(() => {
                toast('Ошибка загрузки файла')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [file.id])

    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground">
                <LucideMousePointerSquareDashed className="mr-2 h-4 w-4" />
                Открыть изображение
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start">
                        <span>Просмотр изображения </span>
                        <code className="relative max-w-xs truncate rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            <span>{file.name}</span>.{file.extension.extension}
                        </code>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex h-full w-full items-center justify-center">
                    {loading ? (
                        <Skeleton className="h-[400px] w-[600px] rounded-lg" />
                    ) : (
                        <img
                            src={fileUrl}
                            alt={file.name}
                            className="max-h-[500px] max-w-full rounded-lg object-contain shadow-md"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
