// import { Metadata } from 'next'
// import Image from 'next/image'
import { RotateCcw } from 'lucide-react'

import { Button } from '../ui/button'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/Components/ui/hover-card'
import { Label } from '@/Components/ui/label'
import { Separator } from '@/components/ui/separator'
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
                                    <CodeViewer />
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
                                                        Complete
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        className="h-5 w-5">
                                                        <rect
                                                            x="4"
                                                            y="3"
                                                            width="12"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="4"
                                                            y="7"
                                                            width="12"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="4"
                                                            y="11"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="4"
                                                            y="15"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="8.5"
                                                            y="11"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="8.5"
                                                            y="15"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="13"
                                                            y="11"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                    </svg>
                                                </TabsTrigger>
                                                <TabsTrigger value="insert">
                                                    <span className="sr-only">
                                                        Insert
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        className="h-5 w-5">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M14.491 7.769a.888.888 0 0 1 .287.648.888.888 0 0 1-.287.648l-3.916 3.667a1.013 1.013 0 0 1-.692.268c-.26 0-.509-.097-.692-.268L5.275 9.065A.886.886 0 0 1 5 8.42a.889.889 0 0 1 .287-.64c.181-.17.427-.267.683-.269.257-.002.504.09.69.258L8.903 9.87V3.917c0-.243.103-.477.287-.649.183-.171.432-.268.692-.268.26 0 .509.097.692.268a.888.888 0 0 1 .287.649V9.87l2.245-2.102c.183-.172.432-.269.692-.269.26 0 .508.097.692.269Z"
                                                            fill="currentColor"></path>
                                                        <rect
                                                            x="4"
                                                            y="15"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="8.5"
                                                            y="15"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                        <rect
                                                            x="13"
                                                            y="15"
                                                            width="3"
                                                            height="2"
                                                            rx="1"
                                                            fill="currentColor"></rect>
                                                    </svg>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>
                                    </div>
                                    <div className="md:order-1">
                                        <TextTabs auth={auth} file={file} />
                                        <TabsContent
                                            value="insert"
                                            className="mt-0 border-0 p-0">
                                            <div className="flex flex-col space-y-4">
                                                <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                                                    <Textarea
                                                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                                                        className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                                                    />
                                                    <div className="rounded-md border bg-muted"></div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button>Submit</Button>
                                                    <Button variant="secondary">
                                                        <span className="sr-only">
                                                            Show history
                                                        </span>
                                                        <RotateCcw />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TabsContent>
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
