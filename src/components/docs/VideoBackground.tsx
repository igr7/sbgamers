'use client';

import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

interface VideoBackgroundProps {
    src: string;
    className?: string;
    grayscale?: boolean;
    opacity?: number;
}

export function VideoBackground({ src, className = '', grayscale = true, opacity = 0.4 }: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Check if it's an HLS stream
        if (src.endsWith('.m3u8')) {
            if (Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {
                        // Autoplay might be blocked, that's okay
                    });
                });

                return () => {
                    hls.destroy();
                };
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                video.src = src;
                video.play().catch(() => { });
            }
        } else {
            // Regular video
            video.src = src;
            video.play().catch(() => { });
        }
    }, [src]);

    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{
                    filter: grayscale ? 'grayscale(100%)' : 'none',
                    opacity,
                }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>
    );
}
