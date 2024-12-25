import { File as FileType } from '@/types'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import { Info } from 'lucide-react'

const formatFileSize = (bytes: number) => {
    const kb = 1024 // 1KB = 1024 байт
    const mb = 1024 * 1024 // 1MB = 1024 * 1024 байт
    const gb = 1024 * 1024 * 1024 // 1GB = 1024 * 1024 * 1024 байт

    if (bytes >= gb) {
        return `${(bytes / gb).toFixed(2)} ГБ`
    } else if (bytes >= mb) {
        return `${(bytes / mb).toFixed(2)} МБ`
    } else if (bytes >= kb) {
        return `${(bytes / kb).toFixed(2)} КБ`
    } else {
        return `${bytes} Б`
    }
}

export default function FileInfo({
    file,
    role,
}: {
    file: FileType
    role: 'Sender' | 'Receiver'
}) {
    return (
        <Dialog>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Info className="mr-2 h-4 w-4" />
                Информация
            </DialogTrigger>

            <DialogContent className="">
                Свойства {file.name}.{file.extension.extension}
                <div>
                    <p>
                        <span className="font-bold">Название: </span>
                        {file.name}
                    </p>
                    <p>
                        <span className="font-bold">Расширение: </span>.
                        {file.extension.extension}
                    </p>
                    <p>
                        <span className="font-bold">Вес: </span>
                        {formatFileSize(file.size)}
                    </p>
                </div>
                <div>
                    <p>
                        <span className="font-bold">Отправитель: </span>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
