import FileContext from './FileContext'
import FolderContext from './FolderContext'
import { FolderX } from 'lucide-react'

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
                <div className="grids grid min-h-[200px] items-center justify-center gap-5 pt-5">
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
                <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                    <FolderX className="mb-4 h-16 w-16 text-muted-foreground" />
                    <h1 className="text-2xl font-semibold text-primary">
                        Файлов не найдено
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        В этой папке нет файлов или папок.
                    </p>
                </div>
            )}
        </>
    )
}
