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

export default function FileContext({
    file,
    trash,
    accessLink,
    shared,
}: {
    file: FileType
    trash?: boolean
    shared?: boolean
    accessLink?: string
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

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Button
                    variant="ghost"
                    className="flex h-full w-full flex-col items-center">
                    <FilePreview file={file} />
                    {isEditing ? (
                        <FileRename
                            fileId={file.id}
                            initialName={file.name}
                            onCancel={handleRenameCancel}
                            onRename={handleRenameSuccess}
                        />
                    ) : (
                        <p>
                            {truncateFileName(
                                file.name,
                                file.extension.extension
                            )}
                        </p>
                    )}
                </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                {trash ? (
                    <>
                        <FileRestore file={file} />
                        <FileForceDelete file={file} />
                    </>
                ) : shared ? (
                    <>
                        <FileDownload file={file} />
                        <FileInfo file={file} role={'Receiver'} />
                        {isImageFile && <FilePhotoView file={file} />}
                        {isVideoFile && <FileVideoView file={file} />}
                    </>
                ) : (
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
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}
