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

export default function FileRename({ file }: { file: FileType }) {
    const [isOpen, setIsOpen] = useState(false)

    const { setData, processing, patch, reset } = useForm({
        name: '',
    })

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        patch(route('file.rename', { file: file.id }), {
            onSuccess: () => {
                reset(), setIsOpen(false)
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
                        defaultValue={file.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <DialogFooter>
                        <Button
                            className={'mt-3'}
                            type="submit"
                            disabled={processing}>
                            Сохранить
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
