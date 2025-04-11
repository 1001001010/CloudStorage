import { create } from 'zustand'

type BreadcrumbItem = {
    title: string
    folderId: number
}

interface FilesStore {
    currentPath: any[]
    breadcrumbPath: BreadcrumbItem[]
    currentFolderId: number

    setCurrentPath: (path: any[]) => void
    setBreadcrumbPath: (path: BreadcrumbItem[]) => void
    setCurrentFolderId: (id: number) => void
}

export const useFilesStore = create<FilesStore>((set) => ({
    currentPath: [],
    breadcrumbPath: [{ title: 'Файлы', folderId: 0 }],
    currentFolderId: 0,

    setCurrentPath: (path) => set({ currentPath: path }),
    setBreadcrumbPath: (path) => set({ breadcrumbPath: path }),
    setCurrentFolderId: (id) => set({ currentFolderId: id }),
}))
