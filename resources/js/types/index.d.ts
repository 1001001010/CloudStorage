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
    parent_id: Folder | null
    user_id: User
    children?: Folder[]
}

export interface File {
    id: number
    name: string
    folder_id: Folder | null
    user_id: User
    size: number
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User
    }
}
