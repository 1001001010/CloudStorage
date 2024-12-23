import { Button } from '@/Components/ui/button'
import { Folder } from 'lucide-react'
import FileContext from './FileContext'

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
            <div className="grids grid min-h-[200px] items-center justify-center gap-5">
                {currentPath[currentPath.length - 1] &&
                currentPath[currentPath.length - 1].length > 0 ? (
                    currentPath[currentPath.length - 1].map((item, index) => (
                        <div key={index}>
                            {item.hasOwnProperty('name') ? (
                                <FileContext
                                    file={item}
                                    accessLink={accessLink}
                                />
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="flex h-full w-full flex-col items-center"
                                    onClick={() =>
                                        handleFolderClick(
                                            item.children,
                                            item.files,
                                            item.title,
                                            item.id
                                        )
                                    }>
                                    <Folder size={80} className="!h-20 !w-20" />
                                    {item.title}
                                </Button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-7 text-center">
                        <h1 className="text-lg">Папка пуста</h1>
                    </div>
                )}
            </div>
        </>
    )
}
