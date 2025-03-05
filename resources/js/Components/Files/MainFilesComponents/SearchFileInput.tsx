import { Input } from '@/Components/ui/input'
import { Search } from 'lucide-react'
import type React from 'react'

export type FolderOrFile = any

export default function SearchFileInput({
    searchFileName,
    handleSearchChange,
}: {
    searchFileName: string
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                className="w-full pl-9"
                placeholder="Поиск по всем файлам"
                value={searchFileName}
                onChange={handleSearchChange}
            />
        </div>
    )
}
