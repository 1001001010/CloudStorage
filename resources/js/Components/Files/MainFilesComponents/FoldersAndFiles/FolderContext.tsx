'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import type { Folder as FolderType } from '@/types'
import { Folder } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { FolderRename, FolderDelete } from '@/Components/Folder/Actions/index'
import { formatDate } from '@/lib/utils'

export default function FolderContext({
    folder,
    handleFolderClick,
    viewMode = 'grid',
    itemSize = 100,
    select,
    setSelect,
}: {
    folder: FolderType
    handleFolderClick: any
    viewMode?: 'grid' | 'list'
    itemSize?: number
    select?: {
        type: 'file' | 'folder'
        id: number
    } | null
    setSelect?: React.Dispatch<
        React.SetStateAction<{
            type: 'file' | 'folder'
            id: number
        } | null>
    >
}) {
    const handleClick = () => {
        handleFolderClick(folder, folder.title, folder.id)
    }

    const iconSize = Math.max(40, Math.min(100, itemSize * 0.8))

    if (viewMode === 'grid') {
        return (
            <ContextMenu>
                <ContextMenuTrigger
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelect?.({ type: 'folder', id: folder.id })
                    }}
                    onContextMenu={(e) => {
                        e.stopPropagation()
                        setSelect?.({ type: 'folder', id: folder.id })
                    }}>
                    <Button
                        variant="ghost"
                        className={`flex h-full w-full flex-col items-center justify-center ${
                            select?.type === 'folder' &&
                            select?.id === folder.id
                                ? 'bg-muted'
                                : ''
                        }`}
                        onClick={handleClick}>
                        <div
                            className="flex flex-col items-center justify-center"
                            style={{
                                width: `${itemSize}px`,
                                height: `${itemSize + 40}px`,
                            }}>
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: `${iconSize}px`,
                                    height: `${iconSize}px`,
                                }}>
                                <Folder
                                    style={{
                                        width: iconSize,
                                        height: iconSize,
                                    }}
                                />
                            </div>
                            <p
                                className="mt-2 truncate text-center"
                                style={{
                                    fontSize: `${Math.max(10, itemSize * 0.12)}px`,
                                }}>
                                {folder.title}
                            </p>
                        </div>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <FolderDelete folder={folder} />
                    <FolderRename folder={folder} />
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onClick={(e) => {
                    e.stopPropagation()
                    setSelect?.({ type: 'folder', id: folder.id })
                }}
                onContextMenu={(e) => {
                    e.stopPropagation()
                    setSelect?.({ type: 'folder', id: folder.id })
                }}>
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className={`flex h-full w-full items-center justify-start gap-3 px-3 py-2 text-left ${
                            select?.type === 'folder' &&
                            select?.id === folder.id
                                ? 'bg-muted'
                                : ''
                        }`}
                        onClick={handleClick}>
                        <div className="flex-shrink-0">
                            <Folder
                                style={{
                                    width: `${iconSize}px`,
                                    height: `${iconSize}px`,
                                }}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                                {folder.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(folder.created_at)}
                            </p>
                        </div>
                    </Button>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <FolderDelete folder={folder} />
                <FolderRename folder={folder} />
            </ContextMenuContent>
        </ContextMenu>
    )
}
