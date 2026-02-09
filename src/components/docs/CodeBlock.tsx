'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'typescript', showLineNumbers = false }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.trim().split('\n');

    return (
        <div className="relative group rounded-xl overflow-hidden bg-white/[0.03] border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                <span className="text-xs text-white/40 font-mono uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-xs text-green-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-xs">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code */}
            <div className="overflow-x-auto">
                <pre className="p-4 text-sm leading-relaxed">
                    <code className="font-mono">
                        {showLineNumbers
                            ? lines.map((line, i) => (
                                <div key={i} className="flex">
                                    <span className="w-8 flex-shrink-0 text-white/20 select-none text-right pr-4">
                                        {i + 1}
                                    </span>
                                    <span className="text-white/80">{line}</span>
                                </div>
                            ))
                            : <span className="text-white/80">{code}</span>
                        }
                    </code>
                </pre>
            </div>
        </div>
    );
}

// Simple syntax highlighting for markdown code blocks
export function MarkdownContent({ content }: { content: string }) {
    // Parse content and render code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return (
        <div className="prose prose-invert max-w-none">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    // Extract language and code
                    const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
                    if (match) {
                        const language = match[1] || 'text';
                        const code = match[2];
                        return <CodeBlock key={index} code={code} language={language} />;
                    }
                }

                // Regular text - render as paragraphs
                return (
                    <div key={index} className="text-white/70 leading-relaxed space-y-4">
                        {part.split('\n\n').map((paragraph, pIndex) => {
                            // Handle bold text
                            let processed = paragraph.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-white font-semibold">$1</strong>'
                            );
                            // Handle inline code
                            processed = processed.replace(
                                /`([^`]+)`/g,
                                '<code class="px-1.5 py-0.5 rounded bg-white/10 text-white/90 text-sm font-mono">$1</code>'
                            );

                            if (processed.trim()) {
                                return (
                                    <p
                                        key={pIndex}
                                        dangerouslySetInnerHTML={{ __html: processed }}
                                        className="text-white/70 leading-relaxed"
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                );
            })}
        </div>
    );
}
