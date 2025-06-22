'use client'

import type { File as FileType } from '@/types'
import { CalendarIcon, Share2, Users, Globe } from 'lucide-react'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import { Slider } from '@/Components/ui/slider'
import { type FormEventHandler, useState, useEffect } from 'react'
import { Button } from '@/Components/ui/button'
import { useForm } from '@inertiajs/react'
import AccessFileLink from '@/Components/Files/AccessFileLink'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Label } from '@/Components/ui/label'
import { Card, CardContent } from '@/Components/ui/card'
import { useFilesStore } from '@/store/use-file-store'

import * as React from 'react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/Components/ui/popover'
import { ScrollArea, ScrollBar } from '@/Components/ui/scroll-area'
import { Calendar } from '@/Components/ui/calendar'

type AccessType = 'authenticated_only' | 'public'

export default function FileShare({
    file,
    accessLink,
    variant,
}: {
    file: FileType
    accessLink?: string
    variant: 'context' | 'button'
}) {
    const { currentFolderId, setCurrentPath } = useFilesStore()
    const [val, setVal] = useState(1)
    const [open, setIsOpen] = useState(false)
    const [date, setDate] = React.useState<Date>()
    const [openLink, setIsOpenLink] = useState(false)
    const [accessType, setAccessType] =
        useState<AccessType>('authenticated_only')

    const { post, reset, errors, processing, setData } = useForm({
        file_id: file.id,
        user_limit: val,
        expires_at: null as string | null,
        access_type: 'authenticated_only' as AccessType,
    })

    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

    const hours = Array.from({ length: 24 }, (_, i) => i)

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const withTime = new Date(selectedDate)
            if (date) {
                withTime.setHours(date.getHours())
                withTime.setMinutes(date.getMinutes())
            }
            setDate(withTime)
        }
    }

    const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
        if (date) {
            const newDate = new Date(date)
            if (type === 'hour') {
                newDate.setHours(Number.parseInt(value))
            } else if (type === 'minute') {
                newDate.setMinutes(Number.parseInt(value))
            }
            setDate(newDate)
        }
    }

    const handleAccessTypeChange = (value: AccessType) => {
        setAccessType(value)
        setData('access_type', value)
    }

    useEffect(() => {
        setData('user_limit', val)
    }, [val])

    useEffect(() => {
        if (date) {
            setData('expires_at', format(date, 'yyyy-MM-dd HH:mm:ss'))
        } else {
            setData('expires_at', null)
        }
    }, [date])

    const submit: FormEventHandler = async (e) => {
        e.preventDefault()
        post(route('access.upload'), {
            onSuccess: async () => {
                setIsOpen(false)
                setIsOpenLink(true)
                try {
                    const response = await fetch(
                        `/api/folder/${currentFolderId}/contents`
                    )
                    const updatedData = await response.json()
                    setCurrentPath([updatedData])
                } catch (error) {
                    console.error(
                        'Ошибка при обновлении содержимого папки после создания ссылки:',
                        error
                    )
                }
            },
        })
    }

    const getPeopleText = (count: number) => {
        const lastDigit = count % 10
        const lastTwoDigits = count % 100

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return `${count} пользователей`
        }

        if (lastDigit === 1) {
            return `${count} пользователь`
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return `${count} пользователя`
        } else {
            return `${count} пользователей`
        }
    }

    const getAccessTypeDescription = () => {
        if (accessType === 'authenticated_only') {
            return {
                title: 'Только для авторизованных',
                description:
                    'Доступ получат только зарегистрированные пользователи. Вы сможете видеть, кто именно получил доступ к файлу.',
                limitText: `Файл получат: ${getPeopleText(val)}`,
            }
        } else {
            return {
                title: 'Публичный доступ',
                description:
                    'Доступ получит любой, у кого есть ссылка, включая неавторизованных пользователей. Отслеживается только общая статистика.',
                limitText: `Максимум переходов: ${val}`,
            }
        }
    }

    const Content = (
        <>
            <Share2 className="mr-2 h-4 w-4" />
            Поделиться
        </>
    )

    const accessInfo = getAccessTypeDescription()

    return (
        <>
            <Dialog open={open} onOpenChange={setIsOpen}>
                {variant === 'button' ? (
                    <Button
                        onClick={() => setIsOpen(true)}
                        variant="outline"
                        size="sm">
                        {Content}
                    </Button>
                ) : (
                    <DialogTrigger
                        onClick={() => setIsOpen(true)}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                        {Content}
                    </DialogTrigger>
                )}

                <DialogContent className="min-w-fit max-w-md">
                    <DialogHeader className="h-min">
                        <DialogTitle>
                            Поделиться файлом{' '}
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {file.name}.{file.extension.extension}
                            </code>
                        </DialogTitle>
                        <DialogDescription>
                            Настройте параметры доступа к файлу
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submit} className="flex flex-col gap-6">
                        {/* Выбор типа доступа */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Тип доступа
                            </Label>
                            <RadioGroup
                                value={accessType}
                                onValueChange={handleAccessTypeChange}
                                className="grid grid-cols-1 gap-3">
                                <Card
                                    className={cn(
                                        'cursor-pointer transition-colors',
                                        accessType === 'authenticated_only'
                                            ? 'ring-2 ring-primary'
                                            : 'hover:bg-muted/50'
                                    )}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem
                                                value="authenticated_only"
                                                id="authenticated_only"
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="authenticated_only"
                                                    className="flex cursor-pointer items-center gap-2">
                                                    <Users className="h-4 w-4" />
                                                    <span className="font-medium">
                                                        Только авторизованные
                                                    </span>
                                                </Label>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Доступ только для
                                                    зарегистрированных
                                                    пользователей
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card
                                    className={cn(
                                        'cursor-pointer transition-colors',
                                        accessType === 'public'
                                            ? 'ring-2 ring-primary'
                                            : 'hover:bg-muted/50'
                                    )}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start space-x-3">
                                            <RadioGroupItem
                                                value="public"
                                                id="public"
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <Label
                                                    htmlFor="public"
                                                    className="flex cursor-pointer items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    <span className="font-medium">
                                                        Публичный доступ
                                                    </span>
                                                </Label>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    Доступ для всех, включая
                                                    неавторизованных
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </RadioGroup>
                        </div>

                        {/* Информация о выбранном типе */}
                        <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-sm text-muted-foreground">
                                {accessInfo.description}
                            </p>
                        </div>

                        {/* Лимит пользователей */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                {accessType === 'authenticated_only'
                                    ? 'Количество пользователей'
                                    : 'Лимит переходов'}
                            </Label>
                            <p className="text-center text-sm">
                                {accessInfo.limitText}
                            </p>
                            <Slider
                                defaultValue={[val]}
                                max={50}
                                min={1}
                                step={1}
                                onValueChange={(i) => setVal(i[0])}
                            />
                        </div>

                        {/* Срок действия */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Срок действия ссылки (необязательно)
                            </Label>
                            <Popover
                                open={isCalendarOpen}
                                onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !date && 'text-muted-foreground'
                                        )}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? (
                                            format(date, 'dd.MM.yyyy HH:mm')
                                        ) : (
                                            <span>Выберите дату и время</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <div className="sm:flex">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateSelect}
                                            initialFocus
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                        />
                                        <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                                            <ScrollArea className="w-64 sm:w-auto">
                                                <div className="flex p-2 sm:flex-col">
                                                    {hours.map((hour) => (
                                                        <Button
                                                            key={hour}
                                                            size="icon"
                                                            variant={
                                                                date &&
                                                                date.getHours() ===
                                                                    hour
                                                                    ? 'default'
                                                                    : 'ghost'
                                                            }
                                                            className="aspect-square shrink-0 sm:w-full"
                                                            onClick={() =>
                                                                handleTimeChange(
                                                                    'hour',
                                                                    hour.toString()
                                                                )
                                                            }>
                                                            {hour}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <ScrollBar
                                                    orientation="horizontal"
                                                    className="sm:hidden"
                                                />
                                            </ScrollArea>
                                            <ScrollArea className="w-64 sm:w-auto">
                                                <div className="flex p-2 sm:flex-col">
                                                    {Array.from(
                                                        { length: 12 },
                                                        (_, i) => i * 5
                                                    ).map((minute) => (
                                                        <Button
                                                            key={minute}
                                                            size="icon"
                                                            variant={
                                                                date &&
                                                                date.getMinutes() ===
                                                                    minute
                                                                    ? 'default'
                                                                    : 'ghost'
                                                            }
                                                            className="aspect-square shrink-0 sm:w-full"
                                                            onClick={() =>
                                                                handleTimeChange(
                                                                    'minute',
                                                                    minute.toString()
                                                                )
                                                            }>
                                                            {minute
                                                                .toString()
                                                                .padStart(
                                                                    2,
                                                                    '0'
                                                                )}
                                                        </Button>
                                                    ))}
                                                </div>
                                                <ScrollBar
                                                    orientation="horizontal"
                                                    className="sm:hidden"
                                                />
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            {date && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDate(undefined)}
                                    className="w-full">
                                    Убрать ограничение по времени
                                </Button>
                            )}
                        </div>

                        {/* Показываем ошибки валидации */}
                        {Object.keys(errors).length > 0 && (
                            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
                                <ul className="space-y-1 text-sm text-destructive">
                                    {Object.values(errors).map(
                                        (error, index) => (
                                            <li key={index}>• {error}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full">
                            {processing
                                ? 'Создание ссылки...'
                                : 'Создать ссылку'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
            <AccessFileLink
                file={file}
                accessLink={accessLink}
                openLink={openLink}
                setIsOpenLink={setIsOpenLink}
            />
        </>
    )
}
