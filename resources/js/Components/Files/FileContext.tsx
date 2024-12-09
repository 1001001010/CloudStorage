import { useState, useRef, useEffect } from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { Download, Edit, Trash2 } from 'lucide-react'
import FilePreview from './FilePreview'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { useForm } from '@inertiajs/react'
import FileDelete from './Actions/Delete'

export default function FileContext({ file }: { file: FileType }) {
    const { data, setData, patch, errors, processing, reset } = useForm({
        name: '',
    })

    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        patch(route('file.rename', { file: file.id }))
        setIsEditing(false)
    }

    const handleEditClick = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Button
                    variant="ghost"
                    className="flex h-full w-full flex-col items-center">
                    <FilePreview file={file} />
                    {isEditing ? (
                        <form
                            onSubmit={handleSubmit}
                            className="flex items-center">
                            <Input
                                type="text"
                                defaultValue={file.name}
                                ref={inputRef}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="rounded border border-gray-300 p-3"
                            />
                        </form>
                    ) : (
                        <p>
                            {file.name}.{file.extension.extension}
                        </p>
                    )}
                </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <a href={route('file.download', { file: file.id })}>
                    <ContextMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Скачать
                    </ContextMenuItem>
                </a>
                <ContextMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Переименовать
                </ContextMenuItem>
                <FileDelete file={file} />
            </ContextMenuContent>
        </ContextMenu>
    )
}
