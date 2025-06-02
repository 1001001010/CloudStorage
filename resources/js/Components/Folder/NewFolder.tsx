'use client'

import type React from 'react'

import { useState } from 'react'
import type { Folder as FolderTypes, PageProps } from '@/types'
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
import { FolderPlus } from 'lucide-react'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { useFilesStore } from '@/store/use-file-store'
import { useForm } from '@inertiajs/react'

export default function NewFolder({
    auth,
    open,
    FoldersTree,
}: PageProps<{ open: boolean; FoldersTree: FolderTypes[] }>) {
    const [isOpen, setIsOpen] = useState(false)

    // Получаем текущую директорию из глобального хранилища
    const { currentFolderId, breadcrumbPath } = useFilesStore()

    // Получаем название текущей директории
    const getCurrentFolderName = () => {
        if (breadcrumbPath.length === 0) return 'Корневая директория'
        const currentFolder = breadcrumbPath.find(
            (item) => item.folderId === currentFolderId
        )
        return currentFolder ? currentFolder.title : 'Корневая директория'
    }

    // Форма для создания папки
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        folder: currentFolderId,
    })

    // Обработчик отправки формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post(route('folder.upload'), {
            onSuccess: () => {
                setIsOpen(false)
                reset()

                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('folder-created'))
                }
            },
        })
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open)
                    if (open) {
                        setData('folder', currentFolderId)
                    } else {
                        reset()
                    }
                }}>
                <DialogTrigger asChild>
                    <Button className="flex w-full" variant="outline">
                        <FolderPlus className="mr-2 h-4 w-4" />
                        {open === false ? null : <span>Создать папку</span>}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Создание новой папки</DialogTitle>
                        <DialogDescription>
                            Создание папки в директории{' '}
                            <span className="font-medium">
                                {getCurrentFolderName()}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="folder-name">Название папки</Label>
                            <Input
                                id="folder-name"
                                placeholder="Введите название папки"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                autoComplete="off"
                                autoFocus
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                disabled={processing}>
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !data.title.trim()}>
                                {processing ? 'Создание...' : 'Создать папку'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
