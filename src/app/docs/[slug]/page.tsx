'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { DocsNavbar, DocsFooter, DocsSidebar, TableOfContents, MarkdownContent } from '@/components/docs';
import { docPages, docsNavigation } from '@/data/docs';

export default function DocsPage() {
    const params = useParams();
    const slug = params?.slug as string || 'introduction';

    // Find the current page
    const currentPage = docPages.find((page) => page.slug === slug);

    // Find the category and position for navigation
    const flatItems = docsNavigation.flatMap((group) =>
        group.items.map((item) => ({ ...item, category: group.title }))
    );
    const currentIndex = flatItems.findIndex((item) => item.slug === slug);
    const prevPage = currentIndex > 0 ? flatItems[currentIndex - 1] : null;
    const nextPage = currentIndex < flatItems.length - 1 ? flatItems[currentIndex + 1] : null;

    if (!currentPage) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
                    <p className="text-white/50 mb-8">The documentation page you&apos;re looking for doesn&apos;t exist.</p>
                    <Link
                        href="/docs/introduction"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-medium"
                    >
                        <Home className="w-4 h-4" />
                        Go to Introduction
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <DocsNavbar />

            <div className="pt-16">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex">
                        {/* Left Sidebar */}
                        <DocsSidebar />

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
                                <span className="text-white/50">{currentPage.category}</span>
                                <ChevronRight className="w-4 h-4 text-white/30" />
                                <span className="text-white">{currentPage.title}</span>
                            </motion.nav>

                            {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="mb-10"
                            >
                                <h1 className="text-4xl font-bold text-white tracking-tighter mb-4">
                                    {currentPage.title}
                                </h1>
                                <p className="text-xl text-white/60">{currentPage.description}</p>
                            </motion.div>

                            {/* Sections */}
                            <div className="space-y-12">
                                {currentPage.sections.map((section, index) => (
                                    <motion.section
                                        key={section.id}
                                        id={section.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="scroll-mt-24"
                                    >
                                        <h2 className="text-2xl font-semibold text-white mb-4">{section.title}</h2>
                                        <MarkdownContent content={section.content} />
                                    </motion.section>
                                ))}
                            </div>

                            {/* Navigation */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 gap-4"
                            >
                                {prevPage && (
                                    <Link
                                        href={`/docs/${prevPage.slug}`}
                                        className="group p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all"
                                    >
                                        <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                                            <ChevronRight className="w-4 h-4 rotate-180" />
                                            <span>Previous</span>
                                        </div>
                                        <span className="text-white font-medium group-hover:text-white/80">
                                            {prevPage.title}
                                        </span>
                                    </Link>
                                )}
                                {nextPage && (
                                    <Link
                                        href={`/docs/${nextPage.slug}`}
                                        className="group p-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all text-right ml-auto"
                                    >
                                        <div className="flex items-center justify-end gap-2 text-white/50 text-sm mb-1">
                                            <span>Next</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                        <span className="text-white font-medium group-hover:text-white/80">
                                            {nextPage.title}
                                        </span>
                                    </Link>
                                )}
                            </motion.div>
                        </main>

                        {/* Right Sidebar - Table of Contents */}
                        <TableOfContents sections={currentPage.sections} />
                    </div>
                </div>
            </div>

            <DocsFooter />
        </div>
    );
}
