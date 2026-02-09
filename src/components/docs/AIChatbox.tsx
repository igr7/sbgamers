'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '@/types/docs';

export function AIChatbox() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Hi! I\'m your AI assistant. How can I help you today? Ask me anything about our platform, documentation, or API.',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamedContent, setStreamedContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamedContent]);

    const simulateStreamingResponse = async (userMessage: string) => {
        // Sample responses based on keywords
        const responses: Record<string, string> = {
            authentication: 'Our authentication system supports multiple methods including email/password, OAuth providers (Google, GitHub, Discord), Magic Links, and enterprise SSO (SAML, OIDC). You can implement authentication in just a few lines of code using our SDK.',
            api: 'Our REST API follows RESTful conventions with predictable resource-oriented URLs. All responses return JSON. We support pagination, filtering, and sorting across all list endpoints. Rate limiting is applied at 1000 requests per minute for standard plans.',
            pricing: 'We offer flexible pricing tiers: Free (up to 10K requests/month), Pro ($29/month for 100K requests), and Enterprise (custom pricing with dedicated support). All plans include access to our full API and documentation.',
            default: 'That\'s a great question! Our platform provides a comprehensive suite of tools for building modern applications. You can find detailed information in our documentation or feel free to ask me more specific questions about authentication, databases, or our API.',
        };

        // Find matching response
        const messageLower = userMessage.toLowerCase();
        let response = responses.default;
        for (const [keyword, resp] of Object.entries(responses)) {
            if (messageLower.includes(keyword)) {
                response = resp;
                break;
            }
        }

        // Simulate streaming
        setStreamedContent('');
        const words = response.split(' ');

        for (let i = 0; i < words.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 30 + Math.random() * 50));
            setStreamedContent((prev) => prev + (i === 0 ? '' : ' ') + words[i]);
        }

        // Add completed message
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setStreamedContent('');
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate API call with streaming response
        await simulateStreamingResponse(userMessage.content);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="glass rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">AI Assistant</h3>
                        <p className="text-white/50 text-xs">Powered by advanced AI</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white/50 text-xs">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-[320px] overflow-y-auto p-4 space-y-4">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${message.role === 'user'
                                            ? 'bg-white/10'
                                            : 'bg-gradient-to-br from-violet-500 to-purple-600'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-white" />
                                    )}
                                </div>
                                <div
                                    className={`flex-1 max-w-[80%] p-3 rounded-xl ${message.role === 'user'
                                            ? 'bg-white/10 ml-auto'
                                            : 'bg-white/5'
                                        }`}
                                >
                                    <p className="text-white/90 text-sm leading-relaxed">{message.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Streaming response */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex gap-3"
                        >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 max-w-[80%] p-3 rounded-xl bg-white/5">
                                {streamedContent ? (
                                    <p className="text-white/90 text-sm leading-relaxed">
                                        {streamedContent}
                                        <span className="inline-block w-1.5 h-4 ml-1 bg-white/50 animate-pulse" />
                                    </p>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-white/50 animate-spin" />
                                        <span className="text-white/50 text-sm">Thinking...</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            disabled={isLoading}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="p-3 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
