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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@inertiajs/react'

export default function FileContext({ file }: { file: FileType }) {
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [newName, setNewName] = useState(file.name)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log('New file name:', newName)
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
                                value={newName}
                                ref={inputRef}
                                onChange={handleNameChange}
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
                <a
                    href={route('file.download', { file: file.id })}
                    // target="_blank"
                    // rel="noopener noreferrer"
                >
                    <ContextMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Скачать
                    </ContextMenuItem>
                </a>
                <ContextMenuItem onClick={handleEditClick}>
                    <Edit className="mr-2 h-4 w-4" />
                    Переименовать
                </ContextMenuItem>
                <ContextMenuItem onClick={handleEditClick}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
