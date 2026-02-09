'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Search,
    ArrowRight,
    BookOpen,
    Code2,
    FileText,
    Mail,
    MessageCircle,
    Users,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import { DocsNavbar, DocsFooter, WaveText, AIChatbox, VideoBackground } from '@/components/docs';
import { SearchModal } from '@/components/docs/SearchModal';

export default function DocsHome() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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

    const categories = [
        {
            title: 'Documentation',
            description: 'Learn how to integrate and use our platform with comprehensive guides and tutorials.',
            icon: BookOpen,
            href: '/docs/introduction',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
        },
        {
            title: 'API Reference',
            description: 'Explore our REST API with detailed endpoint documentation and examples.',
            icon: Code2,
            href: '/api-reference/sign-up',
            image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
        },
        {
            title: 'Changelog',
            description: 'Stay up to date with the latest features, improvements, and bug fixes.',
            icon: FileText,
            href: '/changelog',
            image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop',
        },
    ];

    const supportOptions = [
        {
            title: 'Email Support',
            description: 'Get help from our team via email within 24 hours.',
            icon: Mail,
            action: 'support@platform.com',
        },
        {
            title: 'Community',
            description: 'Join our Discord community and connect with other developers.',
            icon: Users,
            action: 'Join Discord',
        },
        {
            title: 'Live Chat',
            description: 'Chat with our support team in real-time during business hours.',
            icon: MessageCircle,
            action: 'Start Chat',
        },
    ];

    const quickLinks = [
        { label: 'Quick Start', href: '/docs/quick-start' },
        { label: 'Authentication', href: '/docs/authentication' },
        { label: 'API Keys', href: '/api-reference/get-user' },
        { label: 'Webhooks', href: '/docs/webhooks' },
    ];

    return (
        <div className="min-h-screen bg-black">
            <DocsNavbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-30"
                        style={{ filter: 'grayscale(100%)' }}
                    >
                        <source src="https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-2170/1080p.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    {/* Announcement Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <Link
                            href="/changelog"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                                New
                            </span>
                            <span className="text-white/70 text-sm">v2.5.0 is now available</span>
                            <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6"
                    >
                        <WaveText text="Developer Documentation" delay={0.4} />
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
                    >
                        <WaveText
                            text="Everything you need to build and scale your applications with our platform."
                            delay={0.8}
                        />
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="relative max-w-xl mx-auto mb-8"
                    >
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl glass border border-white/20 hover:border-white/30 transition-all group"
                        >
                            <Search className="w-5 h-5 text-white/50" />
                            <span className="text-white/40 flex-1 text-left">Search documentation...</span>
                            <div className="flex items-center gap-1">
                                <kbd className="px-2 py-1 rounded-lg bg-white/10 text-white/50 text-xs font-medium">⌘</kbd>
                                <kbd className="px-2 py-1 rounded-lg bg-white/10 text-white/50 text-xs font-medium">K</kbd>
                            </div>
                        </button>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-wrap items-center justify-center gap-3"
                    >
                        {quickLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
            </section>

            {/* Categories Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                            Explore the Platform
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Discover everything you need to get started and master our platform.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            return (
                                <motion.div
                                    key={category.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        href={category.href}
                                        className="group block h-full"
                                    >
                                        <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 bg-gradient-to-b from-white/[0.03] to-transparent">
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${category.image})` }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-white">{category.title}</h3>
                                                </div>
                                                <p className="text-white/50 mb-4">{category.description}</p>
                                                <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                                                    <span className="text-sm font-medium">Explore</span>
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* AI Assistant Section */}
            <section className="relative py-24 px-4 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-purple-500/10" />
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-violet-400" />
                            <span className="text-violet-400 text-sm font-medium">AI-Powered</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                            Ask our AI Assistant
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Get instant answers to your questions about the platform, documentation, or API.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <AIChatbox />
                    </motion.div>
                </div>
            </section>

            {/* Support Section */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter mb-4">
                            Need Help?
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            Our support team is here to help you succeed with our platform.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {supportOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <motion.div
                                    key={option.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-6 rounded-2xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/15 transition-colors">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                                    <p className="text-white/50 mb-4">{option.description}</p>
                                    <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                                        <span className="text-sm font-medium">{option.action}</span>
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <DocsFooter />
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
