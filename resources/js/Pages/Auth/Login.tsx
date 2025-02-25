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
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Email</Label>
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
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Пароль</Label>
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
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
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
