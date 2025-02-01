import { Input } from '@/Components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

export type FolderOrFile = any

export default function SearchFileInput({
    searchFileName,
    handleSearchChange,
}: {
    searchFileName: string
    handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <>
            <Input
                className="w-full max-w-xs"
                placeholder="Поиск"
                value={searchFileName}
                onChange={handleSearchChange}
            />
        </>
    )
}
