'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import type { Folder as FolderType } from '@/types'
import { Folder } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import FolderDelete from '../../Actions/Folder/Delete'
import { FolderRename } from '@/Components/Files/Actions/Folder'

export default function FolderContext({
    folder,
    handleFolderClick,
    viewMode = 'grid',
    itemSize = 100,
}: {
    folder: FolderType
    handleFolderClick: any
    viewMode?: 'grid' | 'list'
    itemSize?: number
}) {
    const handleClick = () => {
        handleFolderClick(
            folder.children,
            folder.files,
            folder.title,
            folder.id
        )
    }

    // Calculate icon size based on itemSize (for grid view)
    const iconSize = Math.max(40, Math.min(100, itemSize * 0.8))

    // Render grid view (original view)
    if (viewMode === 'grid') {
        return (
            <ContextMenu>
                <ContextMenuTrigger>
                    <Button
                        variant="ghost"
                        className="flex h-full w-full flex-col items-center"
                        style={{
                            maxWidth: `${itemSize}%`,
                            padding: `${Math.max(4, itemSize * 0.05)}px`,
                        }}
                        onClick={handleClick}>
                        <Folder
                            size={iconSize}
                            className={`!h-${iconSize / 5} !w-${iconSize / 5}`}
                            style={{ width: iconSize, height: iconSize }}
                        />
                        <p className="mt-2 truncate text-center">
                            {folder.title}
                        </p>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <FolderDelete folder={folder} />
                    <FolderRename folder={folder} />
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    // Render list view
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className="flex h-full w-full items-center justify-start gap-3 px-3 py-2 text-left"
                        onClick={handleClick}>
                        <div className="flex-shrink-0">
                            <Folder className="h-10 w-10" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                                {folder.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {folder.children?.length || 0} папок •{' '}
                                {folder.files?.length || 0} файлов
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
