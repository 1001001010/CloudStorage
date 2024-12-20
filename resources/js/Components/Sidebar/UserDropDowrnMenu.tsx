import { PageProps, User } from '@/types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { SidebarMenuButton } from '../ui/sidebar'
import {
    BadgeCheck,
    Bell,
    ChevronsUpDown,
    CreditCard,
    LogOut,
    ScanEye,
    Sparkles,
} from 'lucide-react'
import { assert } from 'console'
import { FormEventHandler } from 'react'
import { Link } from '@inertiajs/react'

export default function UserDropDownMenu({
    auth,
    isMobile,
}: PageProps<{ isMobile: boolean }>) {
    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        route('logout')
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src="/img/defaul_avatar.jpg"
                                alt="avatar"
                            />
                            <AvatarFallback className="rounded-lg">
                                100
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {auth.user ? auth.user.name : null}
                            </span>
                            <span className="truncate text-xs">
                                {auth.user ? auth.user.email : null}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    // side={isMobile ? 'bottom' : 'right'}
                    align="start"
                    sideOffset={4}>
                    <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src="/img/defaul_avatar.jpg"
                                    alt="avatar"
                                />
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {auth.user ? auth.user.name : null}
                                </span>
                                <span className="truncate text-xs">
                                    {auth.user ? auth.user.email : null}
                                </span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Sparkles />
                            Upgrade to Pro
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href={route('profile.index')} className="w-full">
                            <DropdownMenuItem>
                                <BadgeCheck />
                                Профиль
                            </DropdownMenuItem>
                        </Link>
                        {auth.user?.is_admin == true ? (
                            <Link
                                href={route('admin.index')}
                                className="w-full">
                                <DropdownMenuItem>
                                    <ScanEye />
                                    Панель администратора
                                </DropdownMenuItem>
                            </Link>
                        ) : null}
                        <DropdownMenuItem>
                            <Bell />
                            Notifications
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <form onSubmit={submit}>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full">
                            <DropdownMenuItem>
                                <LogOut />
                                Выйти
                            </DropdownMenuItem>
                        </Link>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
