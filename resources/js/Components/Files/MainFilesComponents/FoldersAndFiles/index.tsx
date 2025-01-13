import FileContext from './FileContext'
import FolderContext from './FolderContext'

export type FolderOrFile = any

export default function FoldersAndFiles({
    currentPath,
    handleFolderClick,
    accessLink,
}: {
    currentPath: FolderOrFile[][]
    handleFolderClick: any
    accessLink?: string
}) {
    return (
        <>
            {currentPath[currentPath.length - 1] &&
            currentPath[currentPath.length - 1].length > 0 ? (
                <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                    {currentPath[currentPath.length - 1].map((item, index) => (
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
