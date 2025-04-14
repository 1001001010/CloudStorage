'use client'

import { Button } from '@/Components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { User } from '@/types'
import { IconUserShield } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, User2Icon } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import EditRole from './EditRole'
import { usePage } from '@inertiajs/react'
import ResetPassword from './ResetPassword'
import EditQuota from './EditQuota'
import { AutoFormatFileSize, formatDate, formatFileSize } from '@/lib/utils'

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'name',
        header: 'Имя',
        cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }>
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'folders_count',
        header: 'Кол-во папок',
        cell: ({ row }) => <div>{row.getValue('folders_count')}</div>,
    },
    {
        accessorKey: 'files_count',
        header: 'Кол-во файлов',
        cell: ({ row }) => <div>{row.getValue('files_count')}</div>,
    },
    {
        accessorKey: 'quota_size',
        header: 'Квота',
        cell: ({ row }) => {
            const quota = row.original.quota
            const size = row.original.total_file_size

            return (
                <div>
                    {size ? AutoFormatFileSize(size) : null} из{' '}
                    {quota ? formatFileSize(quota.size, 'МБ', 'ГБ') : null}
                </div>
            )
        },
    },
    {
        accessorKey: 'created_at',
        header: 'Регистрация',
        cell: ({ row }) => {
            const createdAt: string = row.getValue('created_at')
            const formattedDate = formatDate(createdAt)
            return <div>{formattedDate}</div>
        },
    },
    {
        accessorKey: 'is_admin',
        header: 'Роль',
        cell: ({ row }) => (
            <div>
                {row.getValue('is_admin') ? (
                    <div className="flex gap-2">
                        <IconUserShield size={16} />
                        <p>Администратор</p>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <User2Icon size={16} />
                        <p>Пользователь</p>
                    </div>
                )}
            </div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original
            const { auth } = usePage().props

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                            <EditRole auth={auth} user={user} />
                        </div>
                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                            <EditQuota auth={auth} user={user} />
                        </div>
                        {user.provider === 'email' ? (
                            <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0">
                                <ResetPassword auth={auth} user={user} />
                            </div>
                        ) : null}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
