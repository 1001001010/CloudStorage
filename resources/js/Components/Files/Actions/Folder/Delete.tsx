import { Folder as FolderType } from '@/types'
import { Trash2 } from 'lucide-react'
import { useForm } from '@inertiajs/react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog'
import { useFilesStore } from '@/store/use-file-store'

export default function FolderDelete({ folder }: { folder: FolderType }) {
    const { currentFolderId, setCurrentPath } = useFilesStore()
    const { delete: destroy, processing } = useForm()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        destroy(route('folder.delete', { folder: folder.id }), {
            onSuccess: async () => {
                try {
                    const response = await fetch(
                        `/api/folder/${currentFolderId}/contents`
                    )
                    const updatedData = await response.json()
                    setCurrentPath([updatedData])
                } catch (error) {
                    console.error(
                        'Ошибка при обновлении содержимого папки после удаления:',
                        error
                    )
                }
            },
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-medium">
                        Вы точно уверены?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                        Все файлы, находящиеся в папке тоже будут удалены
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                    <AlertDialogCancel className="mt-0">
                        Закрыть
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={processing}>
                        {processing ? 'Удаление...' : 'Удалить'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
