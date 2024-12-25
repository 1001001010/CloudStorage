import { ContextMenuItem } from '@/Components/ui/context-menu'
import { Folder as FolderType } from '@/types'
import { Trash2 } from 'lucide-react'
import { useForm } from '@inertiajs/react'

export default function FolderDelete({ folder }: { folder: FolderType }) {
    const { delete: destroy, processing } = useForm()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        destroy(route('folder.delete', { file: folder.id }))
    }

    return (
        <ContextMenuItem onClick={handleSubmit} disabled={processing}>
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
        </ContextMenuItem>
    )
}
