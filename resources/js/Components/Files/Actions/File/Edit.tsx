import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Edit } from 'lucide-react'

export default function FileEdit({ file }: { file: FileType }) {
    return (
        <a href={route('file.edit', [file.id])}>
            <ContextMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
            </ContextMenuItem>
        </a>
    )
}
