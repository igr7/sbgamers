'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronRight, BookOpen, Code2, FileText } from 'lucide-react';
import { SearchModal } from './SearchModal';

export function DocsNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navLinks = [
        { href: '/docs/introduction', label: 'Documentation', icon: BookOpen },
        { href: '/api-reference/sign-up', label: 'API', icon: Code2 },
        { href: '/changelog', label: 'Changelog', icon: FileText },
    ];

    const isActive = (href: string) => {
        if (href.startsWith('/docs')) return pathname?.startsWith('/docs');
        if (href.startsWith('/api-reference')) return pathname?.startsWith('/api-reference');
        return pathname === href;
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
                        : 'bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                                <span className="text-black font-bold text-sm">P</span>
                            </div>
                            <span className="text-white font-semibold tracking-tighter">
                                Platform
                            </span>
                        </Link>

                        {/* Search Bar - Desktop */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 group min-w-[280px]"
                        >
                            <Search className="w-4 h-4 text-white/50 group-hover:text-white/70" />
                            <span className="text-white/50 text-sm">Search documentation...</span>
                            <div className="flex items-center gap-1 ml-auto">
                                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-white/50 font-medium">
                                    ⌘
                                </kbd>
                                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-white/50 font-medium">
                                    K
                                </kbd>
                            </div>
                        </button>

                        {/* Nav Links - Desktop */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                                                ? 'text-white bg-white/10'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CTA Button - Desktop */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="#"
                                className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {/* Mobile Search */}
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                                >
                                    <Search className="w-4 h-4 text-white/50" />
                                    <span className="text-white/50 text-sm">Search...</span>
                                </button>

                                {/* Mobile Nav Links */}
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            <Icon className="w-5 h-5" />
                                            {link.label}
                                            <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                                        </Link>
                                    );
                                })}

                                {/* Mobile CTA */}
                                <Link
                                    href="#"
                                    className="flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl bg-white text-black font-semibold"
                                >
                                    Get Started
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
