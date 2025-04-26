import { useState } from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { PenLine } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import {
    imageExtensions,
    textAndCodeExtensions,
    videoExtensions,
} from '@/extensions'

import {
    FilePhotoView,
    FileVideoView,
    FileShare,
    FilePreview,
    FileDelete,
    FileDownload,
    FileRestore,
    FileForceDelete,
    FileEdit,
    FileRename,
    FileInfo,
} from '@/Components/Files/Actions/index'
import { AutoFormatFileSize, formatDate } from '@/lib/utils'

export default function FileContext({
    file,
    trash,
    accessLink,
    shared,
    viewMode = 'grid',
    itemSize = 100,
    select,
    setSelect,
}: {
    file: FileType
    trash?: boolean
    shared?: boolean
    accessLink?: string
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
    const isTextOrCodeFile = textAndCodeExtensions.includes(
        file.extension.extension
    )
    const isTextOrCodeMimeType = file.mime_type.mime_type.startsWith('text/')
    const canEdit = isTextOrCodeFile || isTextOrCodeMimeType

    const isImageFile =
        imageExtensions.includes(file.extension.extension) ||
        file.mime_type.mime_type.startsWith('image/')

    const isVideoFile =
        videoExtensions.includes(file.extension.extension) ||
        file.mime_type.mime_type.startsWith('video/')

    const truncateFileName = (
        name: string,
        extension: string,
        maxLength: number = 20
    ) => {
        if (name.length + extension.length + 1 > maxLength) {
            const truncatedName =
                name.slice(0, maxLength - extension.length - 5) + '...'
            return `${truncatedName}.${extension}`
        }
        return `${name}.${extension}`
    }

    const iconSize = Math.max(40, Math.min(100, itemSize * 0.8))

    if (viewMode === 'grid') {
        return (
            <ContextMenu>
                <ContextMenuTrigger
                    onClick={(e) => {
                        e.stopPropagation()
                        setSelect?.({ type: 'file', id: file.id })
                    }}
                    onContextMenu={(e) => {
                        e.stopPropagation()
                        setSelect?.({ type: 'file', id: file.id })
                    }}>
                    <Button
                        variant="ghost"
                        className={`flex h-full w-full flex-col items-center justify-center ${
                            select?.type === 'file' && select?.id === file.id
                                ? 'bg-muted'
                                : ''
                        }`}>
                        <div
                            className="flex flex-col items-center justify-center"
                            style={{
                                width: `${itemSize}px`,
                                height: `${itemSize + 40}px`,
                            }}>
                            <div className="flex items-center justify-center">
                                <FilePreview file={file} iconSize={iconSize} />
                            </div>
                            <p
                                className="mt-2 truncate text-center"
                                style={{
                                    fontSize: `${Math.max(10, itemSize * 0.12)}px`,
                                }}>
                                {truncateFileName(
                                    file.name,
                                    file.extension.extension
                                )}
                            </p>
                        </div>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    {renderContextMenuItems()}
                </ContextMenuContent>
            </ContextMenu>
        )
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger
                onClick={(e) => {
                    e.stopPropagation()
                    setSelect?.({ type: 'file', id: file.id })
                }}
                onContextMenu={(e) => {
                    e.stopPropagation()
                    setSelect?.({ type: 'file', id: file.id })
                }}>
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className={`flex h-full w-full items-center justify-start gap-3 px-3 py-2 text-left ${
                            select?.type === 'file' && select?.id === file.id
                                ? 'bg-muted'
                                : ''
                        }`}>
                        <div className="flex-shrink-0">
                            <FilePreview file={file} iconSize={iconSize} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                                {`${file.name}.${file.extension.extension}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {formatDate(file.created_at)} •{' '}
                                {AutoFormatFileSize(file.size)}
                            </p>
                        </div>
                    </Button>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>{renderContextMenuItems()}</ContextMenuContent>
        </ContextMenu>
    )

    function renderContextMenuItems() {
        if (trash) {
            return (
                <>
                    <FileRestore file={file} />
                    <FileForceDelete file={file} />
                </>
            )
        } else if (shared) {
            return (
                <>
                    <FileDownload file={file} variant="context" />
                    <FileInfo file={file} role={'Receiver'} variant="context" />
                    {isImageFile && (
                        <FilePhotoView file={file} accessLink={accessLink} />
                    )}
                    {isVideoFile && <FileVideoView file={file} />}
                </>
            )
        } else {
            return (
                <>
                    <FileDownload file={file} variant="context" />
                    <FileShare
                        file={file}
                        accessLink={accessLink}
                        variant="context"
                    />
                    {canEdit && <FileEdit file={file} />}
                    {isImageFile && (
                        <FilePhotoView file={file} accessLink={accessLink} />
                    )}
                    {isVideoFile && <FileVideoView file={file} />}
                    {file.access_tokens ? (
                        <FileInfo
                            file={file}
                            role={'Sender'}
                            variant="context"
                        />
                    ) : null}
                    <FileRename file={file} variant="context" />
                    <FileDelete file={file} variant="context" />
                </>
            )
        }
    }
}
