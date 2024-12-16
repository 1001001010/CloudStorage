import { useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { PageProps } from '@/types'
import { toast } from 'sonner'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'

export default function UpdateProfileInformation({
    className = '',
}: {
    status?: string
    className?: string
}) {
    const user = usePage<PageProps>().props.auth.user

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('profile.update'), {
            onSuccess: () => {
                toast('Данные успешно обновлены')
            },
            onError: () => {
                toast('Ошибка обновления данных')
            },
        })
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">Профиль</h2>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">Имя</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    {/* <InputError className="mt-2" message={errors.name} /> */}
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    {/* <InputError className="mt-2" message={errors.email} /> */}
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
