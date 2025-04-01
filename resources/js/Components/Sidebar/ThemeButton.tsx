import { useEffect, useState } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

export default function ThemeButton() {
    const [isDarkMode, setIsDarkMode] = useState(() =>
        typeof window !== 'undefined'
            ? localStorage.getItem('theme') === 'dark'
            : false
    )

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <button onClick={toggleDarkMode}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-muted-foreground">
                            {isDarkMode ? (
                                <SunMedium className="size-4" />
                            ) : (
                                <MoonStar className="size-4" />
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-semibold">Сменить тему</span>
                        </div>
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
