// import { Metadata } from 'next'
// import Image from 'next/image'
import { Code2, RotateCcw, TextIcon } from 'lucide-react'

import { Button } from '../ui/button'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/Components/ui/hover-card'
import { Label } from '@/Components/ui/label'
import { Separator } from '@/Components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Textarea } from '@/Components/ui/textarea'

import { CodeViewer } from './components/code-viewer'
import { MaxLengthSelector } from './components/maxlength-selector'
import { ModelSelector } from './components/model-selector'
import { PresetActions } from './components/preset-actions'
import { PresetSave } from './components/preset-save'
import { PresetSelector } from './components/preset-selector'
import { PresetShare } from './components/preset-share'
import { TemperatureSelector } from './components/temperature-selector'
import { TopPSelector } from './components/top-p-selector'
import { models, types } from './data/models'
import { presets } from './data/presets'
import { PageProps, File } from '@/types'
import { useEffect, useState } from 'react'
import TextTabs from './Tabs/TextTabs'
import CodeTabs from './Tabs/CodeTabs'

export default function EditorField({ file, auth }: PageProps<{ file: File }>) {
    return (
        <>
            <div className="expend-h mx-4 my-2 flex min-h-screen flex-wrap rounded-lg border shadow">
                <div className="h-full w-full p-2">
                    <div className="hidden h-full w-full flex-col px-4 pr-2 md:flex">
                        <div className="flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                            <h2 className="text-lg font-semibold">
                                Редактирование
                            </h2>
                            <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                                <div className="hidden space-x-2 md:flex">
                                    {/* <CodeViewer /> */}
                                    <PresetShare />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <Tabs defaultValue="complete" className="flex-1">
                            <div className="h-full w-full pb-3 pt-6">
                                <div className="grid h-full w-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
                                    <div className="hidden flex-col space-y-4 sm:flex md:order-2">
                                        <div className="grid gap-2">
                                            <HoverCard openDelay={200}>
                                                <HoverCardTrigger asChild>
                                                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                        Mode
                                                    </span>
                                                </HoverCardTrigger>
                                                <HoverCardContent
                                                    className="w-[320px] text-sm"
                                                    side="left">
                                                    Choose the interface that
                                                    best suits your task. You
                                                    can provide: a simple prompt
                                                    to complete, starting and
                                                    ending text to insert a
                                                    completion within, or some
                                                    text with instructions to
                                                    edit it.
                                                </HoverCardContent>
                                            </HoverCard>
                                            <TabsList className="grid grid-cols-2">
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
                                    </div>
                                    <div className="md:order-1">
                                        <TextTabs auth={auth} file={file} />
                                        <CodeTabs auth={auth} file={file} />
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
