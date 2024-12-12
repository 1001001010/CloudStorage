import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Trash2 } from 'lucide-react'
import { useForm } from '@inertiajs/react'

export default function FileForceDelete({ file }: { file: FileType }) {
    const {
        data,
        setData,
        delete: destroy,
        errors,
        processing,
        reset,
    } = useForm()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        destroy(route('file.force.delete', { file: file.id }))
    }

    return (
        <ContextMenuItem onClick={handleSubmit}>
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить окончательно
        </ContextMenuItem>
    )
}
