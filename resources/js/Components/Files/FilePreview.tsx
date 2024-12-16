import { File as FileType } from '@/types'
import {
    File as LucideFile,
    Video,
    FolderArchive,
    Database,
    FileText,
    Code,
    FileJson,
    Music,
    Presentation,
    Table,
    Settings,
    Box,
    Image,
    Type,
    HardDrive,
} from 'lucide-react'

export default function FilePreview({ file }: { file: FileType }) {
    const isFileType = (
        type:
            | 'image'
            | 'video'
            | 'archive'
            | 'database'
            | 'document'
            | 'json'
            | 'code'
            | 'audio'
            | 'presentation'
            | 'spreadsheet'
            | 'config'
            | '3d'
            | 'vector'
            | 'font'
            | 'virtual'
    ) => {
        const extension = file.extension?.extension?.toLowerCase()
        const mimeType = file.mime_type?.mime_type?.toLowerCase()
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
                    'text/plain',
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
            json: {
                extensions: ['json'],
                mimeTypes: ['application/json'],
            },
            code: {
                extensions: [
                    'js',
                    'jsx',
                    'ts',
                    'tsx',
                    'py',
                    'java',
                    'cpp',
                    'c',
                    'h',
                    'php',
                    'html',
                    'css',
                ],
                mimeTypes: [
                    'text/javascript',
                    'text/typescript',
                    'text/x-python',
                    'text/x-java-source',
                    'text/x-c++src',
                    'text/x-csrc',
                    'text/x-c',
                    'text/x-php',
                    'text/html',
                    'text/css',
                ],
            },
            audio: {
                extensions: ['mp3', 'wav', 'flac'],
                mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/flac'],
            },
            presentation: {
                extensions: ['ppt', 'key'],
                mimeTypes: [
                    'application/vnd.ms-powerpoint',
                    'application/vnd.apple.keynote',
                ],
            },
            spreadsheet: {
                extensions: ['xls', 'csv'],
                mimeTypes: ['application/vnd.ms-excel', 'text/csv'],
            },
            config: {
                extensions: ['ini', 'cfg'],
                mimeTypes: ['text/plain'],
            },
            '3d': {
                extensions: ['obj', 'stl'],
                mimeTypes: ['text/plain', 'application/sla'],
            },
            vector: {
                extensions: ['svg'],
                mimeTypes: ['image/svg+xml'],
            },
            font: {
                extensions: ['ttf', 'otf'],
                mimeTypes: ['application/x-font-ttf', 'application/x-font-otf'],
            },
            virtual: {
                extensions: ['ova', 'vmdk'],
                mimeTypes: ['application/ovf', 'application/x-vmdk'],
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
            ) : isFileType('json') ? (
                <FileJson size={80} className="!h-20 !w-20" />
            ) : isFileType('code') ? (
                <Code size={80} className="!h-20 !w-20" />
            ) : isFileType('audio') ? (
                <Music size={80} className="!h-20 !w-20" />
            ) : isFileType('presentation') ? (
                <Presentation size={80} className="!h-20 !w-20" />
            ) : isFileType('spreadsheet') ? (
                <Table size={80} className="!h-20 !w-20" />
            ) : isFileType('config') ? (
                <Settings size={80} className="!h-20 !w-20" />
            ) : isFileType('3d') ? (
                <Box size={80} className="!h-20 !w-20" />
            ) : isFileType('vector') ? (
                <Image size={80} className="!h-20 !w-20" />
            ) : isFileType('font') ? (
                <Type size={80} className="!h-20 !w-20" />
            ) : isFileType('virtual') ? (
                <HardDrive size={80} className="!h-20 !w-20" />
            ) : (
                <LucideFile size={80} className="!h-20 !w-20" />
            )}
        </>
    )
}
