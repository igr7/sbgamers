'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Lock, LockOpen } from 'lucide-react';
import { ApiEndpoint, HttpMethod } from '@/types/docs';
import { CodeBlock } from './CodeBlock';

const methodColors: Record<HttpMethod, { bg: string; text: string; border: string }> = {
    GET: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
    POST: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    PUT: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    DELETE: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    PATCH: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
};

interface APIContentProps {
    endpoint: ApiEndpoint;
}

export function APIContent({ endpoint }: APIContentProps) {
    const [copiedPath, setCopiedPath] = useState(false);
    const colors = methodColors[endpoint.method];

    const handleCopyPath = async () => {
        await navigator.clipboard.writeText(endpoint.path);
        setCopiedPath(true);
        setTimeout(() => setCopiedPath(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span
                        className={`px-3 py-1.5 rounded-lg font-bold text-sm uppercase ${colors.bg} ${colors.text} ${colors.border} border`}
                    >
                        {endpoint.method}
                    </span>
                    <h1 className="text-2xl font-bold text-white tracking-tighter">
                        {endpoint.title}
                    </h1>
                </div>
                <p className="text-white/60 text-lg">{endpoint.description}</p>
            </div>

            {/* Endpoint URL */}
            <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors.bg} ${colors.text}`}
                        >
                            {endpoint.method}
                        </span>
                        <code className="text-white/90 font-mono text-sm truncate">
                            https://api.platform.com{endpoint.path}
                        </code>
                    </div>
                    <button
                        onClick={handleCopyPath}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {copiedPath ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-white/50" />
                        )}
                    </button>
                </div>
            </div>

            {/* Authentication */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                {endpoint.authentication ? (
                    <>
                        <Lock className="w-5 h-5 text-amber-400" />
                        <div>
                            <p className="text-white font-medium text-sm">Authentication Required</p>
                            <p className="text-white/50 text-sm">
                                Include your API key in the Authorization header
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <LockOpen className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-white font-medium text-sm">No Authentication Required</p>
                            <p className="text-white/50 text-sm">This endpoint is publicly accessible</p>
                        </div>
                    </>
                )}
            </div>

            {/* Parameters */}
            {endpoint.parameters.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Parameters</h2>
                    <div className="overflow-hidden rounded-xl border border-white/10">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.03]">
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Name</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Type</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Required</th>
                                    <th className="text-left py-3 px-4 text-white/60 font-medium">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {endpoint.parameters.map((param) => (
                                    <tr key={param.name} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4">
                                            <code className="text-white font-mono">{param.name}</code>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded bg-white/10 text-white/70 text-xs">
                                                {param.type}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {param.required ? (
                                                <span className="text-amber-400 text-xs font-medium">Required</span>
                                            ) : (
                                                <span className="text-white/40 text-xs">Optional</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-white/60">{param.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Request Body */}
            {endpoint.requestBody && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">Request Body</h2>
                    <CodeBlock code={endpoint.requestBody} language="json" />
                </div>
            )}

            {/* Response */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Response</h2>
                <CodeBlock code={endpoint.responseBody} language="json" />
            </div>
        </motion.div>
    );
}
