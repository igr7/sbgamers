'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaveTextProps {
    text: string;
    className?: string;
    delay?: number;
}

export function WaveText({ text, className = '', delay = 0 }: WaveTextProps) {
    const words = text.split(' ');

    return (
        <span className={className}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
                    {word.split('').map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                                duration: 0.4,
                                ease: 'easeOut',
                            }}
                            className="inline-block"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </span>
    );
}

interface WaveTextWithHoverProps {
    text: string;
    className?: string;
}

export function WaveTextWithHover({ text, className = '' }: WaveTextWithHoverProps) {
    return (
        <span className={className}>
            {text.split('').map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block cursor-default"
                    whileHover={{
                        y: -5,
                        color: 'rgba(255, 255, 255, 1)',
                        transition: { duration: 0.15 },
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </motion.span>
            ))}
        </span>
    );
}
