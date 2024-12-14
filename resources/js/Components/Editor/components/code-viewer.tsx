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

    useEffect(() => {
        if (codeRef.current) {
            const codeElement = document.createElement('code')
            codeElement.className = `language-${language}`
            codeElement.textContent = code
            codeRef.current.innerHTML = ''
            codeRef.current.appendChild(codeElement)
            hljs.highlightElement(codeElement)
        }
    }, [code, language])

    return (
        <div className="grid h-full w-full gap-4">
            <div className="h-full w-full overflow-auto rounded-md bg-black p-6">
                <pre
                    ref={codeRef}
                    key={code}
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                />
            </div>
        </div>
    )
}
