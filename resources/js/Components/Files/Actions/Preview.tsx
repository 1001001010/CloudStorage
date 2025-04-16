import { File as FileType } from '@/types'
import { IconPhoto } from '@tabler/icons-react'
import {
    LucideFile,
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
    Videotape,
    Code2,
} from 'lucide-react'
import React from 'react'

type FileTypeKey =
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

export default function FilePreview({
    file,
    iconSize = 80,
}: {
    file: FileType
    iconSize?: number
}) {
    const iconStyle = {
        width: `${iconSize}px`,
        height: `${iconSize}px`,
    }

    const fileTypes: Record<
        FileTypeKey,
        { extensions: string[]; mimeTypes: string[]; icon: JSX.Element }
    > = {
        image: {
            extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'],
            mimeTypes: [
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/bmp',
            ],
            icon: <IconPhoto style={iconStyle} />,
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
            icon: <Videotape style={iconStyle} />,
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
            icon: <FolderArchive style={iconStyle} />,
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
            icon: <Database style={iconStyle} />,
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
            icon: <FileText style={iconStyle} />,
        },
        json: {
            extensions: ['json'],
            mimeTypes: ['application/json'],
            icon: <FileJson style={iconStyle} />,
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
                'text/x-script.python',
                'text/x-java-source',
                'text/x-c++src',
                'text/x-csrc',
                'text/x-c',
                'text/x-php',
                'text/html',
                'text/css',
            ],
            icon: <Code2 style={iconStyle} />,
        },
        audio: {
            extensions: ['mp3', 'wav', 'flac'],
            mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/flac'],
            icon: <Music style={iconStyle} />,
        },
        presentation: {
            extensions: ['ppt', 'key'],
            mimeTypes: [
                'application/vnd.ms-powerpoint',
                'application/vnd.apple.keynote',
            ],
            icon: <Presentation style={iconStyle} />,
        },
        spreadsheet: {
            extensions: ['xls', 'csv'],
            mimeTypes: ['application/vnd.ms-excel', 'text/csv'],
            icon: <Table style={iconStyle} />,
        },
        config: {
            extensions: ['ini', 'cfg'],
            mimeTypes: ['text/plain'],
            icon: <Settings style={iconStyle} />,
        },
        '3d': {
            extensions: ['obj', 'stl'],
            mimeTypes: ['text/plain', 'application/sla'],
            icon: <Box style={iconStyle} />,
        },
        vector: {
            extensions: ['svg'],
            mimeTypes: ['image/svg+xml'],
            icon: <Image style={iconStyle} />,
        },
        font: {
            extensions: ['ttf', 'otf'],
            mimeTypes: ['application/x-font-ttf', 'application/x-font-otf'],
            icon: <Type style={iconStyle} />,
        },
        virtual: {
            extensions: ['ova', 'vmdk'],
            mimeTypes: ['application/ovf', 'application/x-vmdk'],
            icon: <HardDrive style={iconStyle} />,
        },
    }

    const getFileIcon = () => {
        const extension = file.extension?.extension?.toLowerCase()
        const mimeType = file.mime_type?.mime_type?.toLowerCase()

        for (const type in fileTypes) {
            const { extensions, mimeTypes, icon } =
                fileTypes[type as FileTypeKey]
            if (
                extensions.includes(extension) &&
                mimeTypes.includes(mimeType)
            ) {
                return icon
            }
        }

        return <LucideFile style={iconStyle} />
    }

    return <>{getFileIcon()}</>
}
