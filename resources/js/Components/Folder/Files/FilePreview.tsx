import { File as FileType } from '@/types'
import {
    File as LucideFile,
    Video,
    FolderArchive,
    Database,
    FileText,
} from 'lucide-react'

export default function FilePreview({ file }: { file: FileType }) {
    const isFileType = (
        type: 'image' | 'video' | 'archive' | 'database' | 'document'
    ) => {
        const extension = file.extension.extension.toLowerCase()
        const mimeType = file.mime_type.mime_type.toLowerCase()

        const fileTypes = {
            image: {
                extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
                mimeTypes: [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                    'image/bmp',
                ],
            },
            video: {
                extensions: ['mp4', 'avi', 'mov', 'webm', 'mkv'],
                mimeTypes: [
                    'video/mp4',
                    'video/avi',
                    'video/mov',
                    'video/webm',
                    'video/x-matroska',
                ],
            },
            archive: {
                extensions: ['zip', 'rar', 'tar', 'gz', '7z'],
                mimeTypes: [
                    'application/zip',
                    'application/x-rar-compressed',
                    'application/x-tar',
                    'application/gzip',
                    'application/x-7z-compressed',
                ],
            },
            database: {
                extensions: ['sql', 'db', 'sqlite', 'mdb', 'accdb'],
                mimeTypes: [
                    'application/sql',
                    'application/x-sqlite3',
                    'application/vnd.ms-access',
                    'application/vnd.ms-access.database',
                ],
            },
            document: {
                extensions: ['docx', 'xlsx', 'pdf', 'pptx', 'txt'],
                mimeTypes: [
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/pdf',
                    'application/vnd.ms-powerpoint',
                    'text/plain',
                ],
            },
        }

        return (
            fileTypes[type].extensions.includes(extension) &&
            fileTypes[type].mimeTypes.includes(mimeType)
        )
    }

    return (
        <>
            {isFileType('image') ? (
                <img
                    src={`/storage/${file.path}`}
                    alt={file.name}
                    className="!h-20 !w-20 object-cover"
                />
            ) : isFileType('video') ? (
                <Video size={80} className="!h-20 !w-20" />
            ) : isFileType('archive') ? (
                <FolderArchive size={80} className="!h-20 !w-20" />
            ) : isFileType('database') ? (
                <Database size={80} className="!h-20 !w-20" />
            ) : isFileType('document') ? (
                <FileText size={80} className="!h-20 !w-20" />
            ) : (
                <LucideFile size={80} className="!h-20 !w-20" />
            )}
        </>
    )
}
