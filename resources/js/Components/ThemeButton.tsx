import { PageProps } from '@/types'
import { MoonStar, SunMedium } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

export default function ThemeButton({}: PageProps<{}>) {
    const handleToggleDarkMode = () => {
        document.documentElement.classList.toggle('dark')
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <a href="#" onClick={handleToggleDarkMode}>
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-muted-foreground">
                                {document.documentElement.classList.contains(
                                    'dark'
                                ) ? (
                                    <SunMedium className="size-4" />
                                ) : (
                                    <MoonStar className="size-4" />
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-semibold">
                                    Сменить тему
                                </span>
                            </div>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </>
    )
}
