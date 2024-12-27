import { PageProps } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { useForm } from '@inertiajs/react'
import { FormEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ForderNameForm({
    auth,
    folderId,
}: {
    auth: PageProps['auth']
    folderId: number
}) {
    const [isOpen, setIsOpen] = useState(false)
    const { data, setData, post, processing, errors, reset } = useForm({
        folder: folderId,
        title: '',
    })

    useEffect(() => {
        setData('folder', folderId)
    }, [folderId, setData])

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('folder.upload'), {
            onSuccess: () => {
                window.location.reload()
                reset()
            },
            onError: (errors) => {
                toast('Ошибка', {
                    description: 'Ошибка создания папки, попробуйте позже',
                })
            },
        })
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="default">Создать здесь</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Создание папки</DialogTitle>
                        <DialogDescription>
                            Введите название для папки
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submit} className="grid gap-4 py-4">
                        <div className="grid gap-4 py-4">
                            <Input
                                id="name"
                                name="name"
                                maxLength={20}
                                placeholder="Название папки"
                                className="col-span-3"
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={processing}>
                                Создать
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
