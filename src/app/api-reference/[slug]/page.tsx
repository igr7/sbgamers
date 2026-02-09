'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { DocsNavbar, DocsFooter, APISidebar, APIContent } from '@/components/docs';
import { apiGroups } from '@/data/docs';

export default function APIReferencePage() {
    const params = useParams();
    const slug = params?.slug as string || 'sign-up';

    // Find the current endpoint
    let currentEndpoint = null;
    let currentGroup = null;

    for (const group of apiGroups) {
        const endpoint = group.endpoints.find((e) => e.slug === slug);
        if (endpoint) {
            currentEndpoint = endpoint;
            currentGroup = group;
            break;
        }
    }

    // Find prev/next endpoints
    const allEndpoints = apiGroups.flatMap((g) =>
        g.endpoints.map((e) => ({ ...e, groupTitle: g.title }))
    );
    const currentIndex = allEndpoints.findIndex((e) => e.slug === slug);
    const prevEndpoint = currentIndex > 0 ? allEndpoints[currentIndex - 1] : null;
    const nextEndpoint = currentIndex < allEndpoints.length - 1 ? allEndpoints[currentIndex + 1] : null;

    if (!currentEndpoint || !currentGroup) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Endpoint Not Found</h1>
                    <p className="text-white/50 mb-8">The API endpoint you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/api-reference/sign-up"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium"
                    >
                        <Home className="w-4 h-4" />
                        Go to API Reference
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <DocsNavbar />

            <div className="pt-16">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex">
                        {/* Left Sidebar */}
                        <APISidebar />

                        {/* Main Content */}
                        <main className="flex-1 min-w-0 py-8 lg:px-8">
                            {/* Breadcrumb */}
                            <motion.nav
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 mb-8 text-sm"
                            >
                                <Link href="/docs-home" className="text-white/50 hover:text-white transition-colors">
                                    Docs
                                </Link>
                                <ChevronRight className="w-4 h-4 text-white/30" />
                                <span className="text-white/50">API Reference</span>
                                <ChevronRight className="w-4 h-4 text-white/30" />
                                <span className="text-white/50">{currentGroup.title}</span>
                                <ChevronRight className="w-4 h-4 text-white/30" />
                                <span className="text-white">{currentEndpoint.title}</span>
                            </motion.nav>

                            {/* API Content */}
                            <APIContent endpoint={currentEndpoint} />

                            {/* Navigation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-4"
                            >
                                {prevEndpoint && (
                                    <Link
                                        href={`/api-reference/${prevEndpoint.slug}`}
                                        className="group p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                                            <ChevronRight className="w-4 h-4 rotate-180" />
                                            <span>Previous</span>
                                        </div>
                                        <span className="text-white font-medium group-hover:text-white/80">
                                            {prevEndpoint.method} {prevEndpoint.title}
                                        </span>
                                    </Link>
                                )}
                                {nextEndpoint && (
                                    <Link
                                        href={`/api-reference/${nextEndpoint.slug}`}
                                        className="group p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all text-right ml-auto"
                                    >
                                        <div className="flex items-center justify-end gap-2 text-white/50 text-sm mb-1">
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                        <span className="text-white font-medium group-hover:text-white/80">
                                            {nextEndpoint.method} {nextEndpoint.title}
                                        </span>
                                    </Link>
                                )}
                            </motion.div>
                        </main>
                    </div>
                </div>
            </div>

            <DocsFooter />
        </div>
    );
}
