import { useState } from 'react'
import { FileAccessToken } from '@/types'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/Components/ui/dialog'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import { Button } from '@/Components/ui/button'

export default function UserAccessList({ token }: { token: FileAccessToken }) {
    const [selectedToken, setSelectedToken] = useState<FileAccessToken | null>(
        null
    )

    const handleTokenClick = (token: FileAccessToken) => {
        setSelectedToken(token)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant={'outline'}
                    key={token.id}
                    onClick={() => handleTokenClick(token)}>
                    <span>{token.access_token.substring(0, 10)}...</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Информация о токене</DialogTitle>
                    <DialogDescription>
                        Токен - {token.access_token.substring(0, 10)}
                    </DialogDescription>
                    <Table>
                        {selectedToken &&
                        Array.isArray(selectedToken.users_with_access) &&
                        selectedToken.users_with_access.length > 0 ? (
                            <>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Пользователь</TableHead>
                                        <TableHead className="text-right">
                                            Дата
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedToken.users_with_access.map(
                                        (userAccess, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="w-full">
                                                    {userAccess.user.name}
                                                </TableCell>
                                                <TableCell className="w-full text-right">
                                                    {new Date(
                                                        userAccess.created_at
                                                    ).toLocaleDateString(
                                                        'ru-RU'
                                                    )}
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
                                        colSpan={2}
                                        className="mt-4 text-center text-sm text-muted-foreground">
                                        Пользователем с доступом нет
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </Table>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
