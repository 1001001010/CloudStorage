import { Head, Link, useForm } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/components/ui/button'
import { PropsWithChildren, ReactNode, useEffect } from 'react'
import { useDarkMode } from '@/Components/ThemeButton'

export default function Register() {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
    }, [isDarkMode])

    const { data, setData, post, processing, errors, reset } = useForm({
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
                        <CardTitle>Вход в аккаунт</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Имя</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    autoComplete="name"
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
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
                                    required
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                            <div className="flex w-full gap-3">
                                <div className="flex w-full flex-col space-y-1.5">
                                    <Label htmlFor="name">Пароль</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="new-password"
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
                                <div className="flex w-full flex-col space-y-1.5">
                                    <Label htmlFor="name">
                                        Подтверждение пароля
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-500">
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
        // <GuestLayout>
        //     <Head title="Register" />

        //     <form onSubmit={submit}>
        //         <div>
        //             <InputLabel htmlFor="name" value="Name" />

        //             <TextInput
        //                 id="name"
        //                 name="name"
        //                 value={data.name}
        //                 className="mt-1 block w-full"
        //                 autoComplete="name"
        //                 isFocused={true}
        //                 onChange={(e) => setData('name', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.name} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="email" value="Email" />

        //             <TextInput
        //                 id="email"
        //                 type="email"
        //                 name="email"
        //                 value={data.email}
        //                 className="mt-1 block w-full"
        //                 autoComplete="username"
        //                 onChange={(e) => setData('email', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.email} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel htmlFor="password" value="Password" />

        //             <TextInput
        //                 id="password"
        //                 type="password"
        //                 name="password"
        //                 value={data.password}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) => setData('password', e.target.value)}
        //                 required
        //             />

        //             <InputError message={errors.password} className="mt-2" />
        //         </div>

        //         <div className="mt-4">
        //             <InputLabel
        //                 htmlFor="password_confirmation"
        //                 value="Confirm Password"
        //             />

        //             <TextInput
        //                 id="password_confirmation"
        //                 type="password"
        //                 name="password_confirmation"
        //                 value={data.password_confirmation}
        //                 className="mt-1 block w-full"
        //                 autoComplete="new-password"
        //                 onChange={(e) =>
        //                     setData('password_confirmation', e.target.value)
        //                 }
        //                 required
        //             />

        //             <InputError
        //                 message={errors.password_confirmation}
        //                 className="mt-2"
        //             />
        //         </div>

        //         <div className="mt-4 flex items-center justify-end">
        //             <Link
        //                 href={route('login')}
        //                 className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        //                 Already registered?
        //             </Link>

        //             <PrimaryButton className="ms-4" disabled={processing}>
        //                 Register
        //             </PrimaryButton>
        //         </div>
        //     </form>
        // </GuestLayout>
    )
}
