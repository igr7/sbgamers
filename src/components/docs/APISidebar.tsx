'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, Users, Folder } from 'lucide-react';
import { apiGroups } from '@/data/docs';
import { HttpMethod } from '@/types/docs';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Lock,
    Users,
    Folder,
};

const methodColors: Record<HttpMethod, string> = {
    GET: 'text-green-400 bg-green-400/10',
    POST: 'text-blue-400 bg-blue-400/10',
    PUT: 'text-amber-400 bg-amber-400/10',
    DELETE: 'text-red-400 bg-red-400/10',
    PATCH: 'text-violet-400 bg-violet-400/10',
};

export function APISidebar() {
    const pathname = usePathname();
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        apiGroups.map((g) => g.title)
    );

    const toggleGroup = (title: string) => {
        setExpandedGroups((prev) =>
            prev.includes(title)
                ? prev.filter((t) => t !== title)
                : [...prev, title]
        );
    };

    const isActive = (slug: string) => pathname === `/api-reference/${slug}`;

    return (
        <nav className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6 pr-4">
                <div className="space-y-1">
                    {apiGroups.map((group) => {
                        const Icon = iconMap[group.icon] || Lock;
                        const isExpanded = expandedGroups.includes(group.title);

                        return (
                            <div key={group.title} className="mb-4">
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
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
                                            <div className="ml-2 mt-1 space-y-0.5">
                                                {group.endpoints.map((endpoint) => (
                                                    <Link
                                                        key={endpoint.slug}
                                                        href={`/api-reference/${endpoint.slug}`}
                                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(endpoint.slug)
                                                                ? 'bg-white/10'
                                                                : 'hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <span
                                                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${methodColors[endpoint.method]
                                                                }`}
                                                        >
                                                            {endpoint.method}
                                                        </span>
                                                        <span
                                                            className={`text-sm truncate ${isActive(endpoint.slug)
                                                                    ? 'text-white font-medium'
                                                                    : 'text-white/50'
                                                                }`}
                                                        >
                                                            {endpoint.title}
                                                        </span>
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
