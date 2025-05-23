import React, { useRef, useEffect, useState } from 'react'
import { File as FileType } from '@/types'
import { Input } from '@/Components/ui/input'
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
import { PencilIcon } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { useFilesStore } from '@/store/use-file-store'
import { FolderFileSchema } from '@/lib/utils'

export default function FileRename({
    file,
    variant,
}: {
    file: FileType
    variant: 'context' | 'button'
}) {
    const { currentFolderId, setCurrentPath } = useFilesStore()
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { data, setData, processing, patch, reset } = useForm({
        name: '',
    })

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        const result = FolderFileSchema.safeParse({ name: data.name })
        if (!result.success) {
            setError(result.error.errors[0].message)
            return
        }

        patch(route('file.rename', { file: file.id }), {
            onSuccess: async () => {
                reset(), setIsOpen(false)
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

    const Content = (
        <>
            <PencilIcon className="mr-2 h-4 w-4" />
            Переименовать
        </>
    )
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {variant === 'button' ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(true)}>
                    {Content}
                </Button>
            ) : (
                <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    {Content}
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Переименование файла{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {file.name}.{file.extension.extension}
                        </code>
                    </DialogTitle>
                    <DialogDescription>
                        Укажите название файла
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Название папки"
                        name="name"
                        min={1}
                        max={50}
                        defaultValue={file.name}
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
