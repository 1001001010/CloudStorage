import { Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { Button } from '@/Components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { AtSign, Lock } from 'lucide-react'

export default function Login() {
    const { data, setData, post, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-[450px]">
                <form onSubmit={submit}>
                    <CardHeader>
                        <CardTitle>Вход в аккаунт</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <AtSign size={18} />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="Введите вашу почту"
                                    required
                                    className="pl-10"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-3 text-muted-foreground">
                                    <Lock size={18} />
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Введите ваш пароль"
                                    type="password"
                                    value={data.password}
                                    autoComplete="current-password"
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
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Link href={route('register')}>
                            <p className="text-center text-sm text-muted-foreground">
                                Регистрация
                            </p>
                        </Link>
                        <Button>Вход</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
