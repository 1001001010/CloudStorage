import { useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import '/resources/css/isotope.min.css'

export function CodeViewer({
    code,
    language,
}: {
    code: string
    language: string
}) {
    const codeRef = useRef<HTMLPreElement | null>(null)

    // useEffect(() => {
    //     if (codeRef.current) {
    //         hljs.highlightElement(codeRef.current)
    //     }
    //     console.log(code)
    // }, [code, language])

    return (
        <div className="grid h-full w-full gap-4">
            <div className="h-full w-full overflow-auto rounded-md bg-black p-6">
                <pre
                    ref={codeRef}
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                    }}>
                    <code className={`language-${language}`}>{code}</code>
                </pre>
            </div>
        </div>
    )
}
