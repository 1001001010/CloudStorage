'use client'

import { Button } from '@/Components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { User } from '@/types'
import { IconUserShield } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, User2Icon } from 'lucide-react'
import { MoreHorizontal } from 'lucide-react'
import moment from 'moment'

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
        header: 'Кол-во Папок',
        cell: ({ row }) => <div>{row.getValue('folders_count')}</div>,
    },
    {
        accessorKey: 'files_count',
        header: 'Кол-во Файлов',
        cell: ({ row }) => <div>{row.getValue('files_count')}</div>,
    },
    {
        accessorKey: 'created_at',
        header: 'Регистрация',
        cell: ({ row }) => {
            const createdAt: string = row.getValue('created_at')
            const formattedDate = moment(createdAt).format(
                'YYYY-MM-DD HH:mm:ss'
            )
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

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(user.email)
                            }>
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
