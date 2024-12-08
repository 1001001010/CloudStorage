export interface User {
    id: number
    name: string
    email: string
}

export interface Session {
    id: string
    user_id: User
    ip_address: string
    user_agent: string
    payload: string
    last_activity: number
}

export interface Folder {
    id: number
    title: string
    parent: Folder | null
    parent_id: number | null
    user_id: number
    children?: Folder[]
    files?: File[]
}

export interface File {
    id: number
    name: string
    path: string
    extension_id: number
    extension: FileExtension
    mime_type_id: number | null
    file_hash: string | null
    folder_id: number | null
    user_id: number | null
    size: number
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface FileExtension {
    id: number
    extension: string
}

export interface MimeType {
    id: number
    mime_type: string
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User
    }
}
