export interface User {
    id: number
    name: string
    email: string
    is_admin: boolean
    created_at: string
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
    extension: FileExtension
    mime_type: MimeType
    file_hash: string | null
    folder: Folder
    user: User
    size: number
    created_at: string
    updated_at: string
    content: string | null
    deleted_at: string | null
    access_tokens: FileAccessToken[]
}

export interface FileAccessToken {
    id: number
    access_token: string
    user_limit: number
    users: FileUsersAccess[]
    users_with_access: FileUsersAccess[]
}

export interface FileUsersAccess {
    id: number
    file_access_token_id: FileAccessToken
    user: User
    created_at: string
}

export interface FileExtension {
    id: number
    extension: string
}

export interface MimeType {
    id: number
    mime_type: string
}

interface ToastAction {
    label: string
    onClick: () => void
}

interface ToastMessage {
    title: string
    access_link?: string
    description?: string
    action?: ToastAction
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User
    }
}
