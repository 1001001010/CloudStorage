import { useEffect } from 'react'
import { useProfileStore } from '@/store/store'
import { Folder, PageProps, Session } from '@/types'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import Layout from '@/Layouts/Layout'
import ActiveSession from './Partials/ActiveSession'

export default function Dashboard({
    auth,
    activeSession,
    userAgent,
    FoldersTree,
    totalSize,
}: PageProps<{
    activeSession: Session[]
    userAgent: string
    FoldersTree: Folder[]
    totalSize: number
}>) {
    const { setActiveSession, setUserAgent } = useProfileStore()

    useEffect(() => {
        setActiveSession(activeSession)
        setUserAgent(userAgent)
    }, [activeSession, userAgent, setActiveSession, setUserAgent])

    return (
        <Layout
            FoldersTree={FoldersTree}
            breadcrumbs={['Профиль']}
            totalSize={totalSize}>
            <div className="m-4 flex flex-wrap rounded-lg border shadow max-sm:m-1 max-sm:p-1 xl:flex-nowrap">
                <div className="w-full p-4 text-gray-900 dark:text-gray-100 max-sm:p-1 xl:w-2/3">
                    <div className="w-full rounded-lg border p-4 shadow">
                        <UpdateProfileInformationForm />
                    </div>
                    {auth.user.provider == 'email' ? (
                        <div className="mt-4 w-full rounded-lg border p-4 shadow">
                            <UpdatePasswordForm />
                        </div>
                    ) : null}
                </div>

                <div className="w-full p-4 text-gray-900 dark:text-gray-100 max-sm:pt-0 xl:w-1/3">
                    <div className="mb-4 w-full rounded-lg border p-4 shadow">
                        <h2 className="mb-4 text-lg font-medium">
                            Активные сессии
                        </h2>
                        <ActiveSession />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
