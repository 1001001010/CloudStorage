import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/Components/ui/dialog'
import { FormEventHandler } from 'react'

export type FolderOrFile = any

export default function RenameLoadFile({
    isDialogOpen,
    setIsDialogOpen,
    post,
    setData,
    processing,
    fileExtension,
}: {
    isDialogOpen: boolean
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
    post: any
    setData: any
    processing: boolean
    fileExtension: string | null
}) {
    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('file.upload'), {
            onSuccess: () => {
                window.location.reload()
            },
        })

        setIsDialogOpen(false)
    }

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submit}>
                        <DialogHeader>
                            <DialogTitle>Имя файла слишком длинное</DialogTitle>
                            <DialogDescription>
                                Введите новое имя файла, чтобы сохранить его
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center gap-4">
                                <Input
                                    id="name"
                                    placeholder="Название файла"
                                    maxLength={20}
                                    onChange={(e) =>
                                        setData('file_name', e.target.value)
                                    }
                                />
                                <Label htmlFor="name" className="text-right">
                                    .{fileExtension}
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={processing}>Сохранить</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
