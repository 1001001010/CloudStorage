import { FormEventHandler, useState } from 'react'
import { PageProps, User } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select'
import { IconUserShield } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { User2Icon } from 'lucide-react'

const roleOptions = [
    { label: 'Администратор', value: 'true', icon: IconUserShield },
    { label: 'Пользователь', value: 'false', icon: User2Icon },
]

export default function ResetPassword({ user }: PageProps<{ user: User }>) {
    const { data, setData, patch, processing, errors, reset } = useForm({})

    const [dialogOpen, setDialogOpen] = useState(false)

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('admin.password.update', { user: user.id }), {
            onSuccess: () => {
                setDialogOpen(false)
            },
        })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger onClick={() => setDialogOpen(true)}>
                Сбросить пароль
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Изменение роли</DialogTitle>
                    <DialogDescription>
                        Выберите роль для {user.email}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-4">
                            {processing ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
