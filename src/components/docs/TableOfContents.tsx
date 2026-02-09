'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DocSection } from '@/types/docs';

interface TableOfContentsProps {
    sections: DocSection[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sections]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <nav className="w-56 flex-shrink-0 hidden xl:block">
            <div className="sticky top-20 py-6 pl-4">
                <h4 className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
                    On this page
                </h4>
                <ul className="space-y-2 border-l border-white/10">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                onClick={(e) => handleClick(e, section.id)}
                                className={`block pl-4 py-1 text-sm transition-all duration-200 border-l -ml-px ${activeSection === section.id
                                        ? 'text-white border-white/50 font-medium'
                                        : 'text-white/50 border-transparent hover:text-white hover:border-white/30'
                                    }`}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
