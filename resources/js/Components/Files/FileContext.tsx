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
import Rename from './Actions/Rename'
import PhotoView from './Actions/PhotoView'
import { imageExtensions, textAndCodeExtensions } from '@/extensions'

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

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Button
                    variant="ghost"
                    className="flex h-full w-full flex-col items-center">
                    <FilePreview file={file} />
                    {isEditing ? (
                        <Rename
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
                        {canEdit && <FileEdit file={file} />}
                        {isImageFile && <PhotoView file={file} />}
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
