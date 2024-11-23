import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Transition } from '@headlessui/react'
import { useForm } from '@inertiajs/react'
import { Label } from '@radix-ui/react-label'
import { FormEventHandler, useRef } from 'react'

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string
}) {
    const passwordInput = useRef<HTMLInputElement>(null)
    const currentPasswordInput = useRef<HTMLInputElement>(null)

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation')
                    passwordInput.current?.focus()
                }

                if (errors.current_password) {
                    reset('current_password')
                    currentPasswordInput.current?.focus()
                }
            },
        })
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Update Password
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay
                    secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="current_password">
                        Действительный пароль
                    </Label>
                    <Input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                    />
                    {errors.current_password && (
                        <p className="text-sm text-red-500">
                            {errors.current_password}
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Новый пароль</Label>
                    <Input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-sm text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password_confirmation">
                        Подтверждение пароля
                    </Label>
                    <Input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                    />
                    {errors.password_confirmation && (
                        <p className="text-sm text-red-500">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Сохранить</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Сохранено</p>
                    </Transition>
                </div>
            </form>
        </section>
    )
}
