'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Code2, Tag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { docPages, apiGroups, changelogVersions } from '@/data/docs';
import { SearchResult } from '@/types/docs';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search function
    const performSearch = useCallback((searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        const searchLower = searchQuery.toLowerCase();
        const newResults: SearchResult[] = [];

        // Search documentation
        docPages.forEach((page) => {
            if (
                page.title.toLowerCase().includes(searchLower) ||
                page.description.toLowerCase().includes(searchLower)
            ) {
                newResults.push({
                    title: page.title,
                    slug: `/docs/${page.slug}`,
                    category: 'Documentation',
                    excerpt: page.description,
                });
            }
        });

        // Search API endpoints
        apiGroups.forEach((group) => {
            group.endpoints.forEach((endpoint) => {
                if (
                    endpoint.title.toLowerCase().includes(searchLower) ||
                    endpoint.path.toLowerCase().includes(searchLower)
                ) {
                    newResults.push({
                        title: `${endpoint.method} ${endpoint.title}`,
                        slug: `/api-reference/${endpoint.slug}`,
                        category: 'API Reference',
                        excerpt: endpoint.description,
                    });
                }
            });
        });

        // Search changelog
        changelogVersions.forEach((version) => {
            version.entries.forEach((entry) => {
                if (entry.description.toLowerCase().includes(searchLower)) {
                    newResults.push({
                        title: `v${version.version}: ${entry.type}`,
                        slug: '/changelog',
                        category: 'Changelog',
                        excerpt: entry.description,
                    });
                }
            });
        });

        setResults(newResults.slice(0, 10));
        setSelectedIndex(0);
    }, []);

    useEffect(() => {
        performSearch(query);
    }, [query, performSearch]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case 'Enter':
                if (results[selectedIndex]) {
                    router.push(results[selectedIndex].slug);
                    onClose();
                }
                break;
            case 'Escape':
                onClose();
                break;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Documentation':
                return FileText;
            case 'API Reference':
                return Code2;
            case 'Changelog':
                return Tag;
            default:
                return FileText;
        }
    };

    // Group results by category
    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = [];
        }
        acc[result.category].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-2xl mx-auto px-4"
                    >
                        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-4 p-4 border-b border-white/10">
                                <Search className="w-5 h-5 text-white/50" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search documentation, API, changelog..."
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/40 text-lg"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white/50" />
                                </button>
                            </div>

                            {/* Results */}
                            <div className="max-h-[60vh] overflow-y-auto">
                                {query && results.length === 0 && (
                                    <div className="p-8 text-center">
                                        <p className="text-white/50">No results found for &quot;{query}&quot;</p>
                                        <p className="text-white/30 text-sm mt-1">Try searching for something else</p>
                                    </div>
                                )}

                                {Object.entries(groupedResults).map(([category, categoryResults]) => {
                                    const Icon = getCategoryIcon(category);
                                    return (
                                        <div key={category} className="py-2">
                                            <div className="flex items-center gap-2 px-4 py-2">
                                                <Icon className="w-4 h-4 text-white/40" />
                                                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                                                    {category}
                                                </span>
                                            </div>
                                            {categoryResults.map((result, idx) => {
                                                const globalIndex = results.indexOf(result);
                                                const isSelected = globalIndex === selectedIndex;
                                                return (
                                                    <button
                                                        key={`${result.slug}-${idx}`}
                                                        onClick={() => {
                                                            router.push(result.slug);
                                                            onClose();
                                                        }}
                                                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                        className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white font-medium truncate">{result.title}</p>
                                                            <p className="text-white/50 text-sm truncate">{result.excerpt}</p>
                                                        </div>
                                                        <ArrowRight
                                                            className={`w-4 h-4 flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-white' : 'opacity-0'
                                                                }`}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}

                                {!query && (
                                    <div className="p-6">
                                        <p className="text-white/40 text-sm text-center">
                                            Start typing to search...
                                        </p>
                                        <div className="flex justify-center gap-4 mt-4">
                                            <div className="flex items-center gap-2 text-xs text-white/30">
                                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">↑↓</kbd>
                                                <span>Navigate</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/30">
                                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">↵</kbd>
                                                <span>Select</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-white/30">
                                                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/50">esc</kbd>
                                                <span>Close</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
