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
import {
    EyeIcon,
    EyeOffIcon,
    CopyIcon,
    RefreshCwIcon,
    CheckIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ResetPassword({ user }: PageProps<{ user: User }>) {
    const { data, setData, patch, processing } = useForm({
        password: '',
    })

    const [dialogOpen, setDialogOpen] = useState(false)
    const [generatedPassword, setGeneratedPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [copied, setCopied] = useState(false)

    const generatePassword = () => {
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+'
        let password = ''
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setGeneratedPassword(password)
        setCopied(false)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('admin.password.update', { user: user.id }), {
            onSuccess: () => {
                setDialogOpen(false)
                setGeneratedPassword('')
                setShowPassword(false)
            },
        })
    }

    const handleOpenChange = (open: boolean) => {
        setDialogOpen(open)
        if (open && !generatedPassword) {
            generatePassword()
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger onClick={() => setDialogOpen(true)}>
                Сбросить пароль
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Сброс пароля</DialogTitle>
                    <DialogDescription>
                        Сброс пароля пользователя{' '}
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            {user.email}
                        </code>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Новый пароль</Label>
                        <div className="flex items-center space-x-2">
                            <div className="relative flex-1">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={generatedPassword}
                                    readOnly
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }>
                                    {showPassword ? (
                                        <EyeOffIcon className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={generatePassword}
                                title="Сгенерировать новый пароль">
                                <RefreshCwIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={copyToClipboard}
                                className={cn(copied && 'bg-green-100')}
                                title="Копировать пароль">
                                {copied ? (
                                    <CheckIcon className="h-4 w-4 text-green-600" />
                                ) : (
                                    <CopyIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            onClick={() => {
                                setData('password', generatedPassword)
                            }}
                            disabled={processing || !generatedPassword}>
                            {processing ? 'Сохранение...' : 'Сохранить'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
