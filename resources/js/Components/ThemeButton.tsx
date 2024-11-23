import { PageProps } from '@/types'
import { MoonStar, SunMedium } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    useEffect(() => {
        const storedDarkMode = localStorage.getItem('darkMode') === 'true'
        setIsDarkMode(storedDarkMode)
        document.documentElement.classList.toggle('dark', storedDarkMode)
    }, [])

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode
        setIsDarkMode(newDarkMode)
        document.documentElement.classList.toggle('dark', newDarkMode)
        localStorage.setItem('darkMode', newDarkMode.toString())
    }

    return { isDarkMode, toggleDarkMode }
}

export default function ThemeButton({}: PageProps<{}>) {
    const { isDarkMode, toggleDarkMode } = useDarkMode()

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <a href="#" onClick={toggleDarkMode}>
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-muted-foreground">
                                {isDarkMode ? (
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
