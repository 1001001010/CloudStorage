import { useState } from 'react'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import { File as FileType } from '@/types'
import { PenLine } from 'lucide-react'
import FilePreview from './FilePreview'
import { Button } from '@/Components/ui/button'
import FileDelete from './Actions/Delete'
import FileDownload from './Actions/Download'
import FileRestore from './Actions/Restore'
import FileForceDelete from './Actions/ForceDelete'
import FileEdit from './Actions/FileEdit'
import FileRename from './Actions/Rename'
import {
    imageExtensions,
    textAndCodeExtensions,
    videoExtensions,
} from '@/extensions'
import FilePhotoView from './Actions/PhotoView'
import FileVideoView from './Actions/VideoView'
import FileShare from './Actions/Share'

export default function FileContext({
    file,
    trash,
}: {
    file: FileType
    trash?: boolean
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
                            {file.name}.{file.extension.extension}
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
                ) : (
                    <>
                        <FileDownload file={file} />
                        <FileShare file={file} />
                        {canEdit && <FileEdit file={file} />}
                        {isImageFile && <FilePhotoView file={file} />}
                        {isVideoFile && <FileVideoView file={file} />}
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
