'use client'

import { DialogTrigger } from '@/Components/ui/dialog'

import type React from 'react'
import { useState, useEffect } from 'react'
import { router } from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { ContextMenuItem } from '@/Components/ui/context-menu'
import {
    FolderOpen,
    Folder,
    ChevronRight,
    ChevronDown,
    MoveRight,
} from 'lucide-react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import type { File as FileType } from '@/types'
import { useFilesStore } from '@/store/use-file-store'

interface FolderNode {
    id: number
    title: string
    parent_id: number | null
    is_current: boolean
    children: FolderNode[]
}

interface MoveFolderItemProps {
    folder: FolderNode
    level: number
    selectedFolderId: number | null
    onSelect: (folderId: number | null) => void
    expandedFolders: Set<number>
    onToggleExpand: (folderId: number) => void
}

const MoveFolderItem: React.FC<MoveFolderItemProps> = ({
    folder,
    level,
    selectedFolderId,
    onSelect,
    expandedFolders,
    onToggleExpand,
}) => {
    const isExpanded = expandedFolders.has(folder.id)
    const hasChildren = folder.children.length > 0
    const isSelected = selectedFolderId === folder.id
    const isCurrent = folder.is_current

    return (
        <div>
            <div
                className={`flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-muted ${
                    isSelected ? 'border border-primary/20 bg-primary/10' : ''
                } ${isCurrent ? 'cursor-not-allowed opacity-50' : ''}`}
                style={{ paddingLeft: `${level * 20 + 8}px` }}
                onClick={() => !isCurrent && onSelect(folder.id)}>
                {hasChildren ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleExpand(folder.id)
                        }}>
                        {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </Button>
                ) : (
                    <div className="w-4" />
                )}

                {isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                    <Folder className="h-4 w-4 text-blue-500" />
                )}

                <span
                    className={`text-sm ${isCurrent ? 'text-muted-foreground' : ''}`}>
                    {folder.title}
                    {isCurrent && ' (текущая папка)'}
                </span>
            </div>

            {isExpanded && hasChildren && (
                <div>
                    {folder.children.map((child) => (
                        <MoveFolderItem
                            key={child.id}
                            folder={child}
                            level={level + 1}
                            selectedFolderId={selectedFolderId}
                            onSelect={onSelect}
                            expandedFolders={expandedFolders}
                            onToggleExpand={onToggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

interface MoveProps {
    file: FileType
    variant?: 'context' | 'button'
}

export default function Move({ file, variant = 'button' }: MoveProps) {
    const { currentFolderId, setCurrentPath } = useFilesStore()
    const [open, setOpen] = useState(false)
    const [folders, setFolders] = useState<FolderNode[]>([])
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
        null
    )
    const [loading, setLoading] = useState(false)
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(
        new Set()
    )

    const fetchFolders = async () => {
        try {
            // Используем ID папки, в которой находится файл
            const fileFolderId = file.folder ? file.folder.id : 0
            const response = await fetch(
                `/api/folders/tree?current_folder_id=${fileFolderId}`
            )
            const data = await response.json()
            setFolders(data.folders)
        } catch (error) {
            console.error('Ошибка при загрузке папок:', error)
        }
    }

    useEffect(() => {
        if (open) {
            fetchFolders()
        }
    }, [open])

    const updateFolderContents = async () => {
        try {
            // Определяем правильный URL для текущей папки
            const url =
                currentFolderId === null || currentFolderId === 0
                    ? '/api/folder/0/contents'
                    : `/api/folder/${currentFolderId}/contents`

            const response = await fetch(url)
            const updatedData = await response.json()
            setCurrentPath([updatedData])
        } catch (error) {
            console.error('Ошибка при обновлении содержимого папки:', error)
        }
    }

    const handleMove = () => {
        setLoading(true)
        router.patch(
            `/file/${file.id}/move`,
            { folder_id: selectedFolderId },
            {
                onSuccess: async () => {
                    setOpen(false)
                    setSelectedFolderId(null)

                    // Обновляем содержимое текущей папки
                    await updateFolderContents()

                    // Также отправляем событие для других компонентов
                    window.dispatchEvent(new CustomEvent('files-updated'))
                },
                onError: (errors) => {
                    console.error('Ошибка при перемещении файла:', errors)
                },
                onFinish: () => setLoading(false),
            }
        )
    }

    const toggleExpand = (folderId: number) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
        } else {
            newExpanded.add(folderId)
        }
        setExpandedFolders(newExpanded)
    }

    // Определяем, находится ли файл в корневой папке
    const isFileInRootFolder =
        !file.folder || file.folder.id === 0 || file.folder.id === null
    const currentFileFolderId = file.folder ? file.folder.id : null

    // Функция для проверки, является ли папка текущей для файла
    const isCurrentFolder = (folderId: number | null) => {
        if (isFileInRootFolder) {
            return folderId === null || folderId === 0
        }
        return folderId === currentFileFolderId
    }

    const trigger =
        variant === 'context' ? (
            <ContextMenuItem onSelect={(e) => e.preventDefault()}>
                <MoveRight className="mr-2 h-4 w-4" />
                Переместить
            </ContextMenuItem>
        ) : (
            <Button variant="outline" size="sm">
                <MoveRight className="mr-2 h-4 w-4" />
                Переместить
            </Button>
        )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Переместить файл</DialogTitle>
                    <DialogDescription>
                        Выберите папку для перемещения файла "{file.name}.
                        {file.extension.extension}"
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Корневая папка */}
                    <div
                        className={`flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-muted ${
                            selectedFolderId === null
                                ? 'border border-primary/20 bg-primary/10'
                                : ''
                        }`}
                        onClick={() => {
                            setSelectedFolderId(null)
                        }}>
                        <div className="w-4" />
                        <FolderOpen className="h-4 w-4 text-blue-500" />
                        <span className={`text-sm`}>Корневая папка</span>
                    </div>

                    {/* Список папок */}
                    <ScrollArea className="h-64">
                        <div className="space-y-1">
                            {folders.map((folder) => (
                                <MoveFolderItem
                                    key={folder.id}
                                    folder={folder}
                                    level={0}
                                    selectedFolderId={selectedFolderId}
                                    onSelect={setSelectedFolderId}
                                    expandedFolders={expandedFolders}
                                    onToggleExpand={toggleExpand}
                                />
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Отмена
                    </Button>
                    <Button onClick={handleMove} disabled={loading}>
                        {loading ? 'Перемещение...' : 'Переместить'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
