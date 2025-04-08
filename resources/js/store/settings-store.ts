import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FilterType = 'name' | 'created_at' | 'updated_at'
export type SortDirection = 'asc' | 'desc'
export type Theme = 'light' | 'dark'

interface SettingsState {
    viewMode: 'grid' | 'list'
    itemSize: number
    filterType: FilterType
    sortDirection: SortDirection
    theme: Theme
    setViewMode: (mode: 'grid' | 'list') => void
    setItemSize: (size: number) => void
    setFilterType: (filter: FilterType) => void
    setSortDirection: (direction: SortDirection) => void
    setTheme: (theme: Theme) => void
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            viewMode: 'grid',
            itemSize: 100,
            filterType: 'name',
            sortDirection: 'asc',
            theme: 'light',
            setViewMode: (mode) => set({ viewMode: mode }),
            setItemSize: (size) => set({ itemSize: size }),
            setFilterType: (filter) => set({ filterType: filter }),
            setSortDirection: (direction) => set({ sortDirection: direction }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'settings-store',
        }
    )
)
