import { useEffect } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { useSettingsStore } from '@/store/settings-store'

export default function ThemeButton() {
    const { theme, setTheme } = useSettingsStore()

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                    <button onClick={toggleTheme}>
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-muted-foreground">
                            {theme === 'dark' ? (
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
