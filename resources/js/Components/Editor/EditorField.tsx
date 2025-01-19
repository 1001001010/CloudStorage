import { Code2, TextIcon } from 'lucide-react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/Components/ui/hover-card'
import { Separator } from '@/Components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { PageProps, File } from '@/types'
import TextTabs from './Tabs/TextTabs'
import CodeTabs from './Tabs/CodeTabs'

export default function EditorField({
    file,
    auth,
    language,
}: PageProps<{ file: File; language: string }>) {
    return (
        <>
            <div className="expend-h mx-4 my-2 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-2">
                    <div className="hidden h-full w-full flex-col px-4 pr-2 md:flex">
                        <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                            <h2 className="text-lg font-semibold">
                                Редактирование
                            </h2>
                        </div>
                        <Separator />
                        <Tabs defaultValue="complete" className="flex-1">
                            <div className="h-full w-full pb-3 pt-6">
                                <div className="grid w-full gap-2 pb-4">
                                    <HoverCard openDelay={200}>
                                        <HoverCardTrigger asChild>
                                            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Режим
                                            </span>
                                        </HoverCardTrigger>
                                        <HoverCardContent
                                            className="w-[320px] text-sm"
                                            side="left">
                                            Более удобное и структурирование
                                            отображение кода
                                        </HoverCardContent>
                                    </HoverCard>
                                    <TabsList className="grid w-[320px] grid-cols-2">
                                        <TabsTrigger value="complete">
                                            <span className="sr-only">
                                                Текст
                                            </span>
                                            <TextIcon className="h-5 w-5" />
                                        </TabsTrigger>
                                        <TabsTrigger value="insert">
                                            <span className="sr-only">
                                                Code
                                            </span>
                                            <Code2 className="h-5 w-5" />
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="grid h-full w-full items-stretch gap-6">
                                    <div className="md:order-1">
                                        <TextTabs auth={auth} file={file} />
                                        <CodeTabs
                                            auth={auth}
                                            file={file}
                                            language={language}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </>
    )
}
