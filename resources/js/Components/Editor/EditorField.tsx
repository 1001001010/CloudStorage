import { Separator } from '@/Components/ui/separator'
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
                        <div className="h-full w-full pb-3 pt-6">
                            <div className="grid h-full w-full items-stretch gap-6">
                                <div className="md:order-1">
                                    {language !== 'text' ? (
                                        <CodeTabs
                                            auth={auth}
                                            file={file}
                                            language={language}
                                        />
                                    ) : (
                                        <TextTabs auth={auth} file={file} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
