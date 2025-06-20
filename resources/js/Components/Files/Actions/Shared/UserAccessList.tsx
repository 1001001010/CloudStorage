'use client'

import { type FormEventHandler, useState, useEffect } from 'react'
import type {
    FileAccessToken,
    FileUsersAccess,
    FilePublicAccess,
} from '@/types'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/Components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Check, Copy, Globe, Lock, X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import { Button } from '@/Components/ui/button'
import { useForm } from '@inertiajs/react'
import { Badge } from '@/Components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'

export default function UserAccessList({
    token: initialToken,
    onUpdate,
}: {
    token: FileAccessToken
    onUpdate?: () => void
}) {
    const [token, setToken] = useState<FileAccessToken>(initialToken)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        data,
        setData,
        processing,
        delete: destroy,
    } = useForm({
        user_id: 0,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        destroy(route('access.delete', token.id), {
            onSuccess: async () => {
                await refreshTokenData()
                if (onUpdate) {
                    await onUpdate()
                }
            },
        })
    }

    // Функция для обновления данных токена
    const refreshTokenData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/token/${token.id}`, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            })
            if (response.ok) {
                const freshToken = await response.json()
                setToken(freshToken)
                console.log('Токен обновлен:', freshToken)
            } else {
                console.error('Ошибка при получении токена:', response.status)
                toast('Ошибка при обновлении данных токена')
            }
        } catch (error) {
            console.error('Ошибка при обновлении токена:', error)
            toast('Ошибка при обновлении данных токена')
        } finally {
            setLoading(false)
        }
    }

    // Обновляем данные при открытии диалога
    useEffect(() => {
        if (dialogOpen) {
            refreshTokenData()
        }
    }, [dialogOpen, token.id]) // Добавляем token.id в зависимости

    const [selectedToken, setSelectedToken] = useState<FileAccessToken | null>(
        null
    )

    const handleTokenClick = (token: FileAccessToken) => {
        setSelectedToken(token)
    }

    const routeUrl = route('access.user.upload', { token: token.access_token })

    const handleCopy = () => {
        const textToCopy: string = routeUrl ?? ''
        navigator.clipboard.writeText(textToCopy)
        toast('Ссылка успешно скопирована')
    }

    // Определяем тип доступа
    const isPublic = token.access_type === 'public'

    // Получаем статистику для публичного доступа
    const publicStats = isPublic
        ? {
              totalAccesses: token.usage_count || 0,
              uniqueIPs: token.public_accesses?.length
                  ? new Set(
                        token.public_accesses.map(
                            (access: FilePublicAccess) => access.ip_address
                        )
                    ).size
                  : 0,
              authenticatedUsers:
                  token.public_accesses?.filter(
                      (access: FilePublicAccess) => access.user_id
                  ).length || 0,
          }
        : null

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    key={token.id}
                    onClick={() => {
                        handleTokenClick(token)
                        setDialogOpen(true)
                    }}
                    className="flex items-center gap-2">
                    {isPublic ? (
                        <Globe className="h-4 w-4 text-blue-500" />
                    ) : (
                        <Lock className="h-4 w-4 text-green-500" />
                    )}
                    <span>{token.access_token.substring(0, 10)}...</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                        {isPublic ? (
                            <Badge variant="secondary">
                                <Globe className="mr-1 h-3 w-3" />
                                Публичный доступ
                            </Badge>
                        ) : (
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-700">
                                <Lock className="mr-1 h-3 w-3" />
                                Только авторизованные
                            </Badge>
                        )}
                        <DialogTitle>Информация о токене</DialogTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={refreshTokenData}
                            disabled={loading}
                            className="h-8 w-8 rounded-full">
                            <RefreshCw
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                            />
                            <span className="sr-only">Обновить</span>
                        </Button>
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Закрыть</span>
                            </Button>
                        </DialogClose>
                    </div>
                </DialogHeader>

                <DialogDescription>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Токен:
                            </p>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {token.access_token.substring(0, 16)}...
                            </code>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Срок действия:
                            </p>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {token.expires_at
                                    ? formatDate(token.expires_at, true)
                                    : 'Бессрочен'}
                            </code>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Лимит:
                            </p>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {token.user_limit}{' '}
                                {isPublic ? 'скачиваний' : 'пользователей'}
                            </code>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Использовано:
                            </p>
                            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                                {isPublic
                                    ? `${token.usage_count || 0} из ${token.user_limit}`
                                    : `${token.users_with_access?.length || 0} из ${token.user_limit}`}
                            </code>
                        </div>
                    </div>
                </DialogDescription>

                <div className="mb-4 flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue={routeUrl}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        className="px-3"
                        onClick={handleCopy}>
                        <span className="sr-only">Скопировать</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>

                {isPublic ? (
                    // Для публичных токенов показываем статистику
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-black">
                            <div className="rounded-lg bg-blue-50 p-3 text-center">
                                <p className="text-2xl font-bold">
                                    {publicStats?.totalAccesses}
                                </p>
                                <p className="text-xs">Всего скачиваний</p>
                            </div>
                            <div className="rounded-lg bg-green-50 p-3 text-center">
                                <p className="text-2xl font-bold">
                                    {publicStats?.uniqueIPs}
                                </p>
                                <p className="text-xs">Уникальных IP</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3 text-center">
                                <p className="text-2xl font-bold">
                                    {publicStats?.authenticatedUsers}
                                </p>
                                <p className="text-xs">Авторизованных</p>
                            </div>
                        </div>

                        {token.public_accesses &&
                        token.public_accesses.length > 0 ? (
                            <Tabs defaultValue="recent">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="recent">
                                        Последние доступы
                                    </TabsTrigger>
                                    <TabsTrigger value="auth">
                                        Авторизованные
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="recent">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>IP адрес</TableHead>
                                                <TableHead>Дата</TableHead>
                                                <TableHead>
                                                    Пользователь
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {token.public_accesses
                                                .slice(0, 5)
                                                .map(
                                                    (
                                                        access: FilePublicAccess,
                                                        index: number
                                                    ) => (
                                                        <TableRow key={index}>
                                                            <TableCell className="font-mono text-xs">
                                                                {
                                                                    access.ip_address
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(
                                                                    access.created_at
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {access.user
                                                                    ? access
                                                                          .user
                                                                          .name
                                                                    : '-'}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="auth">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>
                                                    Пользователь
                                                </TableHead>
                                                <TableHead>Дата</TableHead>
                                                <TableHead>IP адрес</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {token.public_accesses
                                                .filter(
                                                    (
                                                        access: FilePublicAccess
                                                    ) => access.user
                                                )
                                                .slice(0, 5)
                                                .map(
                                                    (
                                                        access: FilePublicAccess,
                                                        index: number
                                                    ) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {
                                                                    access.user
                                                                        ?.name
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatDate(
                                                                    access.created_at
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-mono text-xs">
                                                                {
                                                                    access.ip_address
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                                Нет данных о доступах
                            </div>
                        )}
                    </div>
                ) : (
                    // Для токенов с авторизацией показываем список пользователей
                    <Table>
                        {selectedToken &&
                        Array.isArray(selectedToken.users_with_access) &&
                        selectedToken.users_with_access.length > 0 ? (
                            <>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Пользователь</TableHead>
                                        <TableHead>Дата</TableHead>
                                        <TableHead className="text-right">
                                            Действия
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedToken.users_with_access.map(
                                        (
                                            userAccess: FileUsersAccess,
                                            index: number
                                        ) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {userAccess.user.name}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        userAccess.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell className="flex justify-end">
                                                    <form onSubmit={submit}>
                                                        <Button
                                                            variant="outline"
                                                            type="submit"
                                                            onClick={() =>
                                                                setData(
                                                                    'user_id',
                                                                    userAccess
                                                                        .user.id
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }>
                                                            {userAccess.deleted_at ===
                                                            null ? (
                                                                <X className="h-4 w-4" />
                                                            ) : (
                                                                <Check className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </form>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </>
                        ) : (
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="mt-4 text-center text-sm text-muted-foreground">
                                        Пользователей с доступом нет
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                )}
            </DialogContent>
        </Dialog>
    )
}
