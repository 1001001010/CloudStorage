import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from '@/Components/ui/context-menu'
import { Folder as FolderType } from '@/types'
import { Folder } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import FolderDelete from '../../Actions/Folder/Delete'

export default function FolderContext({
    folder,
    handleFolderClick,
}: {
    folder: FolderType
    handleFolderClick: any
}) {
    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Button
                    variant="ghost"
                    className="flex h-full w-full flex-col items-center"
                    onClick={() =>
                        handleFolderClick(
                            folder.children,
                            folder.files,
                            folder.title,
                            folder.id
                        )
                    }>
                    <Folder size={80} className="!h-20 !w-20" />
                    {folder.title}
                </Button>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <FolderDelete folder={folder} />
            </ContextMenuContent>
        </ContextMenu>
    )
}
