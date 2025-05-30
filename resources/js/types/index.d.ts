export interface User {
    id: number
    name: string
    email: string
    quota: Quota
    is_admin: boolean
    created_at: string
    total_file_size?: number
    provider: 'email' | 'github'
    encryption_key: string
}

export interface Session {
    id: string
    user_id: User
    ip_address: string
    user_agent: string
    payload: string
    last_activity: number
}

export interface Quota {
    id: string
    size: number
}

export interface Folder {
    id: number
    title: string
    parent: Folder | null
    parent_id: number | null
    user_id: number
    children?: Folder[]
    files?: File[]
    files_count?: number
    children_count?: number
    created_at: string
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

// Обновленный интерфейс FileAccessToken
export interface FileAccessToken {
    id: number
    file_id: number
    access_token: string
    user_limit: number
    expires_at: string | null
    access_type: 'authenticated_only' | 'public'
    usage_count: number
    created_at: string
    updated_at: string
    users: FileUsersAccess[]
    users_with_access: FileUsersAccess[]
    public_accesses: FilePublicAccess[]
    file?: File
}

// Обновленный интерфейс FileUsersAccess
export interface FileUsersAccess {
    id: number
    file_access_token_id: number
    user_id: number
    user: User
    created_at: string
    updated_at: string
    deleted_at: string | null
}

// Новый интерфейс для публичных доступов
export interface FilePublicAccess {
    id: number
    file_access_token_id: number
    ip_address: string
    user_agent: string | null
    user_id: number | null
    created_at: string
    updated_at: string
    user: User | null
}

export interface FileExtension {
    id: number
    extension: string
}

export interface MimeType {
    id: number
    mime_type: string
}

export interface ChartData {
    date: string
    desktop: number
}

export interface BreadcrumbItem {
    title: string
    folderId: number
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
    access_type?: 'authenticated_only' | 'public'
}

export interface StoragePercentageType {
    total: number // Общий объем хранилища (в ГБ)
    used: number // Использованное пространство (в ГБ)
    free: number // Свободное место (в ГБ)
    percentage: number // Использование в процентах
}

export interface FilterControlsProps {
    filterType: FilterType
    setFilterType: (type: FilterType) => void
    sortDirection: SortDirection
    setSortDirection: (direction: SortDirection) => void
    onReset: () => void
}

interface FileStatsType {
    Документы?: { count: number }
    Фото?: { count: number }
    Видео?: { count: number }
    Архивы?: { count: number }
    Базы_данных?: { count: number }
    Код?: { count: number }
    Аудио?: { count: number }
    Презентации?: { count: number }
    Таблицы?: { count: number }
    Другое?: { count: number }
}

// Новые интерфейсы для статистики доступа
export interface AccessStatistics {
    type: 'authenticated' | 'public'
    total_accesses: number
    active_accesses?: number
    unique_ips?: number
    authenticated_users?: number
    users?: FileUsersAccess[]
    recent_accesses?: FilePublicAccess[]
}

export interface TokenStatistics {
    token: FileAccessToken
    file: File
    statistics: AccessStatistics
    access_link: string
}

// Интерфейс для формы создания токена доступа
export interface AccessTokenFormData {
    file_id: number
    user_limit: number
    expires_at: string | null
    access_type: 'authenticated_only' | 'public'
}

// Интерфейс для ответа при создании токена
export interface AccessTokenResponse {
    title: string
    description?: string
    access_link: string
    access_type: 'authenticated_only' | 'public'
}

// Интерфейс для страницы статистики
export interface FileStatisticsPageProps {
    token: FileAccessToken
    file: File
    statistics: AccessStatistics
}

// Интерфейс для страницы общих файлов
export interface SharedPageProps {
    files: File[]
    created_tokens: TokenStatistics[]
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User
    }
}

// Дополнительные типы для фильтрации и сортировки
export type FilterType =
    | 'all'
    | 'documents'
    | 'images'
    | 'videos'
    | 'archives'
    | 'other'
export type SortDirection = 'asc' | 'desc'
export type AccessType = 'authenticated_only' | 'public'

// Типы для компонентов
export interface FileShareProps {
    file: File
    accessLink?: string
    variant: 'context' | 'button'
}

export interface UserAccessListProps {
    token: FileAccessToken
}

export interface AccessFileLinkProps {
    file: File
    accessLink?: string
    openLink: boolean
    setIsOpenLink: (open: boolean) => void
}
