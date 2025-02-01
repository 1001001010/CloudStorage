import FileContext from './FileContext'
import FolderContext from './FolderContext'
import { Input } from '@/Components/ui/input'
import { useState } from 'react'

export type FolderOrFile = any

export default function FoldersAndFiles({
    currentPath,
    handleFolderClick,
    accessLink,
    filteredItems,
}: {
    currentPath: FolderOrFile[][]
    handleFolderClick: any
    accessLink?: string
    filteredItems: any
}) {
    return (
        <>
            {filteredItems && filteredItems.length > 0 ? (
                <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                    {filteredItems.map((item: any, index: number) => (
                        <div key={index}>
                            {item.hasOwnProperty('name') ? (
                                <FileContext
                                    file={item}
                                    accessLink={accessLink}
                                />
                            ) : (
                                <FolderContext
                                    folder={item}
                                    handleFolderClick={handleFolderClick}
                                />
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <h1 className="text-center text-lg">Файлов не найдено</h1>
            )}
        </>
    )
}
