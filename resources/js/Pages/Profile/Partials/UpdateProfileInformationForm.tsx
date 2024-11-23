import { Input } from '@/components/ui/input'
import { Button, Transition } from '@headlessui/react'
import { Link, useForm, usePage } from '@inertiajs/react'
import { Label } from '@radix-ui/react-label'
import { FormEventHandler } from 'react'

export default function UpdateProfileInformation({
    status,
    className = '',
}: {
    status?: string
    className?: string
}) {
    const user = usePage().props.auth.user

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        patch(route('profile.update'))
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Имя</Label>
                    <Input
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e: any) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                <div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e: any) =>
                                setData('email', e.target.value)
                            }
                            required
                            autoComplete="username"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Сохранить</Button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0">
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    )
}
