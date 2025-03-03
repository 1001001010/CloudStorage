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

export default function EditRole({ user }: PageProps<{ user: User }>) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        is_admin: user.is_admin ? 'true' : 'false',
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        const payload = {
            is_admin: data.is_admin === 'true',
        }

        patch(route('admin.role.update', { user: user.id }), {
            data: payload,
            onSuccess: () => {
                setDialogOpen(false)
            },
        })
    }

    const selectedRoleOption = roleOptions.find(
        (role) => role.value === data.is_admin
    )

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger onClick={() => setDialogOpen(true)}>
                Изменить роль
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Изменение роли</DialogTitle>
                    <DialogDescription>
                        Выберите роль для {user.email}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <Select
                        value={data.is_admin}
                        onValueChange={(value) => setData('is_admin', value)}>
                        <SelectTrigger id="role">
                            <SelectValue>
                                <div className="flex items-center space-x-2">
                                    {selectedRoleOption?.icon && (
                                        <selectedRoleOption.icon className="h-5 w-5" />
                                    )}
                                    <span>
                                        {selectedRoleOption?.label ||
                                            'Выберите роль'}
                                    </span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent position="popper">
                            {roleOptions.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    <div className="flex items-center space-x-2">
                                        {role.icon && (
                                            <role.icon className="h-5 w-5" />
                                        )}
                                        <span>{role.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
