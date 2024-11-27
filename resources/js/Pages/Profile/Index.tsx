import { Folder, PageProps, Session } from '@/types'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import Layout from '@/Layouts/Layout'
import ActiveSession from './Partials/ActiveSession'

export default function Dashboard({
    auth,
    activeSession,
    BreadLvl1,
    userAgent,
    FoldersTree,
}: PageProps<{
    BreadLvl1: string
    activeSession: Session[]
    userAgent: string
    FoldersTree: Folder[]
}>) {
    return (
        <Layout FoldersTree={FoldersTree} BreadLvl1={BreadLvl1}>
            <div className="m-4 flex flex-wrap rounded-lg border shadow max-sm:m-1 max-sm:p-1 md:flex-nowrap">
                <div className="w-full p-4 text-gray-900 dark:text-gray-100 max-sm:p-1 md:w-2/3">
                    <div className="mb-4 w-full rounded-lg border p-4 shadow">
                        <UpdateProfileInformationForm className="mb-4" />
                    </div>
                    <div className="mb-4 w-full rounded-lg border p-4 shadow">
                        <UpdatePasswordForm className="mb-4" />
                    </div>
                </div>
                <div className="w-full p-4 text-gray-900 dark:text-gray-100 max-sm:p-1 md:w-1/3">
                    <div className="mb-4 w-full rounded-lg border p-4 shadow">
                        <h2 className="mb-4 text-lg font-medium">
                            Активные сессии
                        </h2>
                        <ActiveSession
                            activeSessions={activeSession}
                            userAgent={userAgent}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
