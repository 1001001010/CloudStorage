'use client'

import { type FormEventHandler, useState } from 'react'
import type { PageProps, User } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog'
import { useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { formatFileSize } from '@/lib/utils'

export default function EditQuota({ user }: PageProps<{ user: User }>) {
    const { setData, patch, processing, errors } = useForm({
        quota: 0,
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('admin.quota.update', { user: user.id }), {
            onSuccess: () => {
                setDialogOpen(false)
            },
        })
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>Изменить квоту</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Изменение квоты</DialogTitle>
                    <DialogDescription>
                        <p>
                            Изменение квоты пользователя{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {user.email}
                            </code>
                        </p>
                        <p>
                            Старое значение:{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {formatFileSize(user.quota.size, 'МБ', 'ГБ')}
                            </code>
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">
                            Новое значение в{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                ГБ
                            </code>
                        </Label>
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    id="quota"
                                    name="quota"
                                    type="number"
                                    className="[&::-moz-appearance]:textfield pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    onChange={(e) =>
                                        setData(
                                            'quota',
                                            parseInt(e.target.value)
                                        )
                                    }
                                />
                                {errors?.quota && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors?.quota}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            variant={'default'}
                            disabled={processing}>
                            {processing ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
