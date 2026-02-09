'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Rocket, BookOpen, FileText, Zap } from 'lucide-react';
import { docsNavigation } from '@/data/docs';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Rocket,
    BookOpen,
    FileText,
    Zap,
};

export function DocsSidebar() {
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        docsNavigation.map((g) => g.title)
    );

    const toggleGroup = (title: string) => {
        setExpandedGroups((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const isActive = (slug: string) => pathname === `/docs/${slug}`;

    return (
        <nav className="w-64 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-4">
                <div className="space-y-1">
                    {docsNavigation.map((group) => {
                        const Icon = iconMap[group.icon] || FileText;
                        const isExpanded = expandedGroups.includes(group.title);

                        return (
                            <div key={group.title} className="mb-4">
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{group.title}</span>
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'
                                            }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="ml-4 mt-1 border-l border-white/10 pl-3 space-y-0.5">
                                                {group.items.map((item) => (
                                                    <Link
                                                        key={item.slug}
                                                        href={`/docs/${item.slug}`}
                                                        className={`block px-3 py-2 text-sm rounded-lg transition-all duration-200 ${isActive(item.slug)
                                                                ? 'text-white bg-white/10 font-medium'
                                                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
