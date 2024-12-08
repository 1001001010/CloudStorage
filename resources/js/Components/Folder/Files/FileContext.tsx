import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu' // Убедитесь, что этот компонент импортирован
import { File as FileType } from '@/types'
import { File as LucideFile, Download, Edit } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function FileContext({ file }: { file: FileType }) {
    const [isEditing, setIsEditing] = useState(false)
    const [newName, setNewName] = useState(file.name)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(event.target.value)
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log('New file name:', newName)
        setIsEditing(false)
    }

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger>
                    <Button
                        variant="ghost"
                        className="flex h-full w-full flex-col items-center">
                        <LucideFile size={80} className="!h-20 !w-20" />
                        {isEditing ? (
                            <form
                                onSubmit={handleSubmit}
                                className="flex items-center">
                                <Input
                                    type="text"
                                    value={newName.split('.')[0]}
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
                    <ContextMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Скачать
                    </ContextMenuItem>
                    <ContextMenuItem onClick={handleEditClick}>
                        <Edit className="mr-2 h-4 w-4" />
                        Переименовать
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </>
    )
}
