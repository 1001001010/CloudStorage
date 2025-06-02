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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select'
import { useForm } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'

export default function EditQuota({ user }: PageProps<{ user: User }>) {
    const [unit, setUnit] = useState<'MB' | 'GB'>('GB')

    const { setData, patch, processing, errors, data } = useForm({
        quota: 0,
        unit: 'GB',
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    // Получение текущей квоты в выбранных единицах для отображения
    const getCurrentQuotaInUnit = (unit: 'MB' | 'GB') => {
        const sizeInMb = user.quota.size
        if (unit === 'GB') {
            return (sizeInMb / 1024).toFixed(2)
        }
        return sizeInMb.toFixed(2)
    }

    // Форматирование текущей квоты для отображения
    const formatCurrentQuota = () => {
        const sizeInMb = user.quota.size
        if (sizeInMb >= 1024) {
            return `${(sizeInMb / 1024).toFixed(1)} ГБ`
        }
        return `${sizeInMb} МБ`
    }

    // Обновляем единицу измерения в форме при изменении
    const handleUnitChange = (newUnit: 'MB' | 'GB') => {
        setUnit(newUnit)
        setData('unit', newUnit)
    }

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
            <DialogTrigger onClick={() => setDialogOpen(true)}>
                Изменить квоту
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Изменение квоты</DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>
                            Изменение квоты пользователя{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {user.email}
                            </code>
                        </p>
                        <p>
                            Текущая квота:{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {formatCurrentQuota()}
                            </code>
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="quota">Новое значение квоты</Label>
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    id="quota"
                                    name="quota"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder={`Например: ${getCurrentQuotaInUnit(unit)}`}
                                    className="[&::-moz-appearance]:textfield [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    onChange={(e) =>
                                        setData(
                                            'quota',
                                            Number.parseFloat(e.target.value) ||
                                                0
                                        )
                                    }
                                />
                            </div>
                            <Select
                                value={unit}
                                onValueChange={handleUnitChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MB">МБ</SelectItem>
                                    <SelectItem value="GB">ГБ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {errors?.quota && (
                            <p className="text-sm text-destructive">
                                {errors?.quota}
                            </p>
                        )}

                        {/* Превью нового значения */}
                        {data.quota > 0 && (
                            <div className="rounded-md bg-muted/50 p-3">
                                <p className="text-sm text-muted-foreground">
                                    Новая квота будет:{' '}
                                    <span className="font-medium text-foreground">
                                        {data.quota}{' '}
                                        {unit === 'GB' ? 'ГБ' : 'МБ'}
                                    </span>
                                    {unit === 'GB' && data.quota >= 1 && (
                                        <span className="text-muted-foreground">
                                            {' '}
                                            ({(data.quota * 1024).toFixed(
                                                0
                                            )}{' '}
                                            МБ)
                                        </span>
                                    )}
                                    {unit === 'MB' && data.quota >= 1024 && (
                                        <span className="text-muted-foreground">
                                            {' '}
                                            ({(data.quota / 1024).toFixed(
                                                2
                                            )}{' '}
                                            ГБ)
                                        </span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={processing}>
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || data.quota <= 0}>
                            {processing ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
