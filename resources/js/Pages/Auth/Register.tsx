import { Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import { AtSign, KeyRound, Lock, User } from 'lucide-react'

export default function Register() {
    const { data, setData, post, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-[450px]">
                <form onSubmit={submit}>
                    <CardHeader>
                        <CardTitle>Регистрация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <User size={18} />
                                </div>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    placeholder="Введите ваше имя"
                                    autoComplete="name"
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    className="pl-10"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <AtSign size={18} />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Введите вашу почту"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    className="pl-10"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                        <Lock size={18} />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        placeholder="Введите пароль"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                        className="pl-10"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-muted-foreground">
                                        <KeyRound size={18} />
                                    </div>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="Подтвердите пароль"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value
                                            )
                                        }
                                        required
                                        className="pl-10"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('login')}>
                            <p className="text-center text-sm text-muted-foreground">
                                Вход
                            </p>
                        </Link>
                        <Button>Регистрация</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
