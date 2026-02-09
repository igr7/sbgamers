'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DocsNavbar, DocsFooter } from '@/components/docs';
import { changelogVersions } from '@/data/docs';
import { ChangeType } from '@/types/docs';

const typeStyles: Record<ChangeType, { bg: string; text: string }> = {
    New: { bg: 'bg-green-500/10', text: 'text-green-400' },
    Fix: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    Improved: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    Breaking: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-black">
            <DocsNavbar />

            <div className="pt-24 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
                            Changelog
                        </h1>
                        <p className="text-xl text-white/60">
                            All the latest updates, improvements, and fixes to our platform.
                        </p>
                    </motion.div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

                        <div className="space-y-12">
                            {changelogVersions.map((version, versionIndex) => (
                                <motion.div
                                    key={version.version}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: versionIndex * 0.1 }}
                                    className="relative pl-8"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-white/50 -translate-x-1/2" />

                                    {/* Version header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-2xl font-bold text-white">v{version.version}</span>
                                        <span className="text-white/40 text-sm">{version.date}</span>
                                    </div>

                                    {/* Entries */}
                                    <div className="space-y-4">
                                        {version.entries.map((entry, entryIndex) => {
                                            const styles = typeStyles[entry.type];
                                            return (
                                                <motion.div
                                                    key={entryIndex}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: versionIndex * 0.1 + entryIndex * 0.05 }}
                                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors"
                                                >
                                                    <span
                                                        className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium uppercase ${styles.bg} ${styles.text}`}
                                                    >
                                                        {entry.type}
                                                    </span>
                                                    <p className="text-white/70 leading-relaxed">{entry.description}</p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <DocsFooter />
        </div>
    );
}
