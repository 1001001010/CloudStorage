import FileContext from './FileContext'
import FolderContext from './FolderContext'
import { FolderX } from 'lucide-react'

export type FolderOrFile = any

export default function FoldersAndFiles({
    currentPath,
    handleFolderClick,
    accessLink,
    filteredItems,
    viewMode = 'grid',
    itemSize = 100,
    select,
    setSelect,
}: {
    currentPath: FolderOrFile[][]
    handleFolderClick: any
    accessLink?: string
    filteredItems: any
    viewMode?: 'grid' | 'list'
    itemSize?: number
    select?: {
        type: 'file' | 'folder'
        id: number
    } | null
    setSelect?: React.Dispatch<
        React.SetStateAction<{
            type: 'file' | 'folder'
            id: number
        } | null>
    >
}) {
    const gridClasses =
        'grid min-h-[150px] grids items-center justify-center gap-5'
    const listClasses = 'flex flex-col min-h-[150px] gap-2'

    return (
        <>
            {filteredItems && filteredItems.length > 0 ? (
                <div
                    className={viewMode === 'grid' ? gridClasses : listClasses}>
                    {filteredItems.map((item: any, index: number) => (
                        <div key={index}>
                            {item.hasOwnProperty('name') ? (
                                <FileContext
                                    select={select}
                                    setSelect={setSelect}
                                    file={item}
                                    accessLink={accessLink}
                                    viewMode={viewMode}
                                    itemSize={itemSize}
                                />
                            ) : (
                                <FolderContext
                                    select={select}
                                    setSelect={setSelect}
                                    folder={item}
                                    handleFolderClick={handleFolderClick}
                                    viewMode={viewMode}
                                    itemSize={itemSize}
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
                        В этой папке нет файлов или папок
                    </p>
                </div>
            )}
        </>
    )
}
