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
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table'
import { Button } from '@/Components/ui/button'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function UserAccessList({ token }: { token: FileAccessToken }) {
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
                    <div className="flex items-center space-x-2">
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
                            <Copy />
                        </Button>
                    </div>
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
                                        Пользователей с доступом нет
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
