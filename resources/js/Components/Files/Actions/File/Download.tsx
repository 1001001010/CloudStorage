import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Download } from 'lucide-react'

export default function FileDownload({ file }: { file: FileType }) {
    return (
        <a href={route('file.download', { file: file.id })}>
            <ContextMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Скачать
            </ContextMenuItem>
        </a>
    )
}
