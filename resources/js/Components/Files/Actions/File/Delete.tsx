import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Trash2 } from 'lucide-react'
import { useForm } from '@inertiajs/react'

export default function FileDelete({ file }: { file: FileType }) {
    const { delete: destroy, processing } = useForm()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        destroy(route('file.delete', { file: file.id }))
    }

    return (
        <ContextMenuItem onClick={handleSubmit} disabled={processing}>
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
        </ContextMenuItem>
    )
}
