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
import { Simulate } from 'react-dom/test-utils'
import submit = Simulate.submit

export default function FolderRename({ folder }: { folder: FolderType }) {
    const [isOpen, setIsOpen] = useState(false)

    const { patch, processing, setData } = useForm({
        name: '',
    })

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        patch(route('folder.rename', { folder: folder.id }), {
            onSuccess: () => {
                setIsOpen(false)
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
                        defaultValue={folder.title}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <DialogFooter>
                        <Button type="submit">Сохранить</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
