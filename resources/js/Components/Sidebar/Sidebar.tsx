'use client'

import {
    AlignEndVerticalIcon,
    GalleryVerticalEnd,
    Trash2,
} from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/Components/ui/sidebar'
import { Link, usePage } from '@inertiajs/react'
import UserDropDownMenu from './UserDropDowrnMenu'
import ThemeButton from './ThemeButton'
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert'
import { Progress } from '@/Components/ui/progress'
import { Button } from '@/Components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import NewFolder from '../Folder/NewFolder'
import { Folder as FolderType } from '@/types'
import UserDataLink from './data/UsersData'
import AdminDataLink from './data/AdminData'
import FileUploadButton from '@/Components/Sidebar/FileUploadButton'
export const iframeHeight = '800px'

const formatFileSize = (bytes: number) => {
    const kb = 1024 // 1KB = 1024 байт
    const mb = 1024 * 1024 // 1MB = 1024 * 1024 байт
    const gb = 1024 * 1024 * 1024 // 1GB = 1024 * 1024 * 1024 байт

    if (bytes >= gb) {
        return `${(bytes / gb).toFixed(2)} ГБ`
    } else if (bytes >= mb) {
        return `${(bytes / mb).toFixed(2)} МБ`
    } else if (bytes >= kb) {
        return `${(bytes / kb).toFixed(2)} КБ`
    } else {
        return `${bytes} Б`
    }
}

export default function SideBarComponent({
    totalSize,
    FoldersTree,
}: {
    totalSize: number
    FoldersTree: FolderType[]
}) {
    const { open, isMobile } = useSidebar()
    const auth = usePage().props.auth

    return (
        <>
            <Sidebar variant="floating" collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href={route('index')}>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">
                                            Облачное хранилище
                                        </span>
                                        <span className="">v1.0.0</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem className="pb-1">
                            <FileUploadButton auth={auth} open={open} />
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <NewFolder
                                open={open}
                                auth={auth}
                                FoldersTree={FoldersTree}
                            />
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <Link href={route('shared.index')}>
                                <SidebarMenuButton>
                                    <AlignEndVerticalIcon className="mr-2 h-4 w-4" />
                                    <span>Общий доступ</span>
                                </SidebarMenuButton>
                            </Link>
                            <Link href={route('trash.index')}>
                                <SidebarMenuButton>
                                    <Trash2 />
                                    <span>Корзина</span>
                                </SidebarMenuButton>
                            </Link>
                            <UserDataLink FoldersTree={FoldersTree} />
                            <AdminDataLink auth={auth} />
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <ThemeButton auth={auth}></ThemeButton>
                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.1 }}>
                                <Alert>
                                    <Progress
                                        value={
                                            (totalSize /
                                                (5 * 1024 * 1024 * 1024)) *
                                            100
                                        }
                                    />
                                    <AlertTitle className="pt-2 text-center">
                                        <p className="text-nowrap">
                                            Занято {formatFileSize(totalSize)}{' '}
                                            из 5 ГБ
                                        </p>
                                    </AlertTitle>
                                    <AlertDescription className="flex justify-center pt-2">
                                        <Button className="w-full">
                                            Увеличить
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <UserDropDownMenu auth={auth} isMobile={isMobile} />
                </SidebarFooter>
            </Sidebar>
        </>
    )
}
