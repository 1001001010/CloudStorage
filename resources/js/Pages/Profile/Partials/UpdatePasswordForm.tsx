import { useRef, FormEventHandler } from 'react'
import { useForm } from '@inertiajs/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string
}) {
    const passwordInput = useRef<HTMLInputElement>(null)
    const currentPasswordInput = useRef<HTMLInputElement>(null)

    const { data, setData, errors, put, reset, processing } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    })

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault()

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast('Успешно', {
                    description: 'Пароль успешно изменен',
                })
                reset()
            },
            onError: (errors) => {
                toast('Ошибка', {
                    description:
                        'Ошибка при изменении пароля. Пожалуйста, попробуйте снова',
                })

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
                <h2 className="text-lg font-medium">Обновление пароля</h2>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
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

                <div>
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

                <div>
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
                    <Button variant="outline" disabled={processing}>
                        Сохранить
                    </Button>
                </div>
            </form>
        </section>
    )
}
