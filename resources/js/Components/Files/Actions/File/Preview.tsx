import { File as FileType } from '@/types'
import { IconPhoto } from '@tabler/icons-react'
import {
    File as LucideFile,
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

export default function FilePreview({ file }: { file: FileType }) {
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
            icon: <IconPhoto size={80} className="!h-20 !w-20" />,
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
            icon: <Videotape size={80} className="!h-20 !w-20" />,
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
            icon: <FolderArchive size={80} className="!h-20 !w-20" />,
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
            icon: <Database size={80} className="!h-20 !w-20" />,
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
            icon: <FileText size={80} className="!h-20 !w-20" />,
        },
        json: {
            extensions: ['json'],
            mimeTypes: ['application/json'],
            icon: <FileJson size={80} className="!h-20 !w-20" />,
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
            icon: <Code2 size={80} className="!h-20 !w-20" />,
        },
        audio: {
            extensions: ['mp3', 'wav', 'flac'],
            mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/flac'],
            icon: <Music size={80} className="!h-20 !w-20" />,
        },
        presentation: {
            extensions: ['ppt', 'key'],
            mimeTypes: [
                'application/vnd.ms-powerpoint',
                'application/vnd.apple.keynote',
            ],
            icon: <Presentation size={80} className="!h-20 !w-20" />,
        },
        spreadsheet: {
            extensions: ['xls', 'csv'],
            mimeTypes: ['application/vnd.ms-excel', 'text/csv'],
            icon: <Table size={80} className="!h-20 !w-20" />,
        },
        config: {
            extensions: ['ini', 'cfg'],
            mimeTypes: ['text/plain'],
            icon: <Settings size={80} className="!h-20 !w-20" />,
        },
        '3d': {
            extensions: ['obj', 'stl'],
            mimeTypes: ['text/plain', 'application/sla'],
            icon: <Box size={80} className="!h-20 !w-20" />,
        },
        vector: {
            extensions: ['svg'],
            mimeTypes: ['image/svg+xml'],
            icon: <Image size={80} className="!h-20 !w-20" />,
        },
        font: {
            extensions: ['ttf', 'otf'],
            mimeTypes: ['application/x-font-ttf', 'application/x-font-otf'],
            icon: <Type size={80} className="!h-20 !w-20" />,
        },
        virtual: {
            extensions: ['ova', 'vmdk'],
            mimeTypes: ['application/ovf', 'application/x-vmdk'],
            icon: <HardDrive size={80} className="!h-20 !w-20" />,
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

        return <LucideFile size={80} className="!h-20 !w-20" />
    }

    return <>{getFileIcon()}</>
}
