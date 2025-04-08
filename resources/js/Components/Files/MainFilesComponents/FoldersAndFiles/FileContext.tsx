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
} from '@/Components/Files/Actions/File/index'
import { AutoFormatFileSize } from '@/formatFileSize'

export default function FileContext({
    file,
    trash,
    accessLink,
    shared,
    viewMode = 'grid',
    itemSize = 100,
}: {
    file: FileType
    trash?: boolean
    shared?: boolean
    accessLink?: string
    viewMode?: 'grid' | 'list'
    itemSize?: number
}) {
    const [isEditing, setIsEditing] = useState(false)

    const handleRenameCancel = () => {
        setIsEditing(false)
    }

    const handleRenameSuccess = () => {
        setIsEditing(false)
    }

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
                <ContextMenuTrigger>
                    <Button
                        variant="ghost"
                        className="flex h-full w-full flex-col items-center justify-center">
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
            <ContextMenuTrigger>
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className="flex h-full w-full items-center justify-start gap-3 px-3 py-2 text-left">
                        <div className="flex-shrink-0">
                            <FilePreview file={file} iconSize={iconSize} />
                        </div>
                        <div className="min-w-0 flex-1">
                            {isEditing ? (
                                <FileRename
                                    fileId={file.id}
                                    initialName={file.name}
                                    onCancel={handleRenameCancel}
                                    onRename={handleRenameSuccess}
                                />
                            ) : (
                                <>
                                    <p className="truncate font-medium">
                                        {`${file.name}.${file.extension.extension}`}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {AutoFormatFileSize(file.size)} •{' '}
                                        {new Date(
                                            file.updated_at
                                        ).toLocaleDateString()}
                                    </p>
                                </>
                            )}
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
                    <FileDownload file={file} />
                    <FileInfo file={file} role={'Receiver'} />
                    {isImageFile && <FilePhotoView file={file} />}
                    {isVideoFile && <FileVideoView file={file} />}
                </>
            )
        } else {
            return (
                <>
                    <FileDownload file={file} />
                    <FileShare file={file} accessLink={accessLink} />
                    {canEdit && <FileEdit file={file} />}
                    {isImageFile && <FilePhotoView file={file} />}
                    {isVideoFile && <FileVideoView file={file} />}
                    {file.access_tokens ? (
                        <FileInfo file={file} role={'Sender'} />
                    ) : null}
                    <ContextMenuItem
                        onClick={() => setIsEditing(true)}
                        disabled={false}>
                        <PenLine className="mr-2 h-4 w-4" />
                        Переименовать
                    </ContextMenuItem>
                    <FileDelete file={file} />
                </>
            )
        }
    }
}
