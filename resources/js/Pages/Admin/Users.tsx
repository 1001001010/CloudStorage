import { useState, useEffect } from 'react'
import { Folder, PageProps, User } from '@/types'
import { Button } from '@/Components/ui/button'
import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { UsersContextProvider } from './context/users-context'
import UsersActionDialog from './components/users-action-dialog'
import UsersInviteDialog from './components/users-invite-dialog'
import UsersDeleteDialog from './components/users-delete-dialog'
import Layout from '@/Layouts/Layout'

export default function Welcome({
    auth,
    FoldersTree,
    FoldersAndFiles,
    totalSize,
    msg,
    users, // Данные пользователей, переданные через Inertia
}: PageProps<{
    FoldersTree: Folder[]
    toast: string
    FoldersAndFiles: any
    totalSize: number
    msg: string
    users: User[] // Добавляем типизацию для пользователей
}>) {
    const [open, setOpen] = useState<string | null>(null)
    const [currentRow, setCurrentRow] = useState<User | null>(null)

    // Можно использовать useEffect, чтобы обновить данные при изменении
    useEffect(() => {
        // Например, можно загружать пользователей с сервера при монтировании
        // setUsers(users);
    }, [users])

    return (
        <Layout FoldersTree={FoldersTree} msg={msg} totalSize={totalSize}>
            <UsersContextProvider
                value={{ open, setOpen, currentRow, setCurrentRow }}>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            User List
                        </h2>
                        <p className="text-muted-foreground">
                            Manage your users and their roles here.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="space-x-1"
                            onClick={() => setOpen('invite')}>
                            <span>Invite User</span> <IconMailPlus size={18} />
                        </Button>
                        <Button
                            className="space-x-1"
                            onClick={() => setOpen('add')}>
                            <span>Add User</span> <IconUserPlus size={18} />
                        </Button>
                    </div>
                </div>

                {/* Ваши диалоговые окна */}
                <UsersActionDialog
                    key="user-add"
                    open={open === 'add'}
                    onOpenChange={() => setOpen('add')}
                />
                <UsersInviteDialog
                    key="user-invite"
                    open={open === 'invite'}
                    onOpenChange={() => setOpen('invite')}
                />

                {/* Если currentRow существует, показываем диалог редактирования или удаления */}
                {currentRow && (
                    <>
                        <UsersActionDialog
                            key={`user-edit-${currentRow.id}`}
                            open={open === 'edit'}
                            onOpenChange={() => {
                                setOpen('edit')
                                setTimeout(() => setCurrentRow(null), 500)
                            }}
                            currentRow={currentRow}
                        />
                        <UsersDeleteDialog
                            key={`user-delete-${currentRow.id}`}
                            open={open === 'delete'}
                            onOpenChange={() => {
                                setOpen('delete')
                                setTimeout(() => setCurrentRow(null), 500)
                            }}
                            currentRow={currentRow}
                        />
                    </>
                )}

                {/* Пример отображения списка пользователей */}
                <div className="mt-4">
                    {users.map((user) => (
                        <div key={user.id} className="border-b p-2">
                            <span>{user.name}</span>{' '}
                            {/* Добавьте другие данные пользователя */}
                        </div>
                    ))}
                </div>
            </UsersContextProvider>
        </Layout>
    )
}
