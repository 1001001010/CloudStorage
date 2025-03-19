import { ContextMenuItem } from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { ArchiveRestore } from 'lucide-react'
import { useForm } from '@inertiajs/react'

export default function FileRestore({ file }: { file: FileType }) {
    const { put, processing } = useForm()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        put(route('file.restore', { file: file.id }))
    }

    return (
        <ContextMenuItem onClick={handleSubmit} disabled={processing}>
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Восстановить
        </ContextMenuItem>
    )
}
