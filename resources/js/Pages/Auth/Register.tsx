import { Link, useForm } from '@inertiajs/react'
import { Icons } from '@/Components/ui/icons'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { cn } from '@/lib/utils'
import { FormEventHandler } from 'react'

export default function Register() {
    const { data, setData, processing, post, errors, reset } = useForm({
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
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] lg:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Регистрация
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Укажите данные для регистрации
                        </p>
                    </div>
                    <div className={cn('grid gap-6')}>
                        <form onSubmit={submit}>
                            <div className="grid gap-2">
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    placeholder="Введите ваше имя"
                                    autoCapitalize="none"
                                    autoComplete="name"
                                    autoCorrect="off"
                                    disabled={processing}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    placeholder="Введите вашу почту"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={processing}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            placeholder="Введите пароль"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            autoCorrect="off"
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            placeholder="Подтвердите пароль"
                                            autoCapitalize="none"
                                            autoComplete="new-password"
                                            autoCorrect="off"
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        {errors.password_confirmation && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.password_confirmation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button disabled={processing}>
                                    Регистрация
                                </Button>
                            </div>
                        </form>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    ИЛИ
                                </span>
                            </div>
                        </div>
                        <a href={route('login.github')} className="w-full">
                            <Button
                                variant="outline"
                                type="button"
                                className="w-full"
                                disabled={processing}>
                                <Icons.gitHub className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                        </a>
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Уже есть аккаунт?{' '}
                        <Link
                            href={route('login')}
                            className="underline underline-offset-4 hover:text-primary">
                            Войти
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
