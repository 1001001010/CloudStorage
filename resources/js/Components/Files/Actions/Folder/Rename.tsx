import { Folder as FolderType } from '@/types'
import { PencilIcon } from 'lucide-react'
import { useForm } from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import React, { useState } from 'react'
import { useFilesStore } from '@/store/use-file-store'
import { FolderFileSchema } from '@/lib/utils'

export default function FolderRename({ folder }: { folder: FolderType }) {
    const { currentFolderId, setCurrentPath } = useFilesStore()
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { data, patch, processing, setData, reset } = useForm({
        name: '',
    })

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        const result = FolderFileSchema.safeParse({ name: data.name })
        if (!result.success) {
            setError(result.error.errors[0].message)
            return
        }

        patch(route('folder.rename', { folder: folder.id }), {
            onSuccess: async () => {
                reset()
                setIsOpen(false)
                try {
                    const response = await fetch(
                        `/api/folder/${currentFolderId}/contents`
                    )
                    const updatedData = await response.json()
                    setCurrentPath([updatedData])
                } catch (error) {
                    console.error(
                        'Ошибка при обновлении содержимого папки после удаления:',
                        error
                    )
                }
            },
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <PencilIcon className="mr-2 h-4 w-4" />
                Переименовать
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Переименование папки{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {folder.title}
                        </code>
                    </DialogTitle>
                    <DialogDescription>
                        Укажите название папки
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Название папки"
                        name="name"
                        min={1}
                        max={50}
                        defaultValue={folder.title}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {error && (
                        <p className="mt-3 text-center text-sm font-medium text-red-500">
                            {error}
                        </p>
                    )}
                    <DialogFooter>
                        <Button
                            className={'mt-3'}
                            type="submit"
                            disabled={processing}>
                            {processing ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
