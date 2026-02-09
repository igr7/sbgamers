// Documentation Types

export interface DocSection {
    id: string;
    title: string;
    content: string;
}

export interface DocPage {
    slug: string;
    title: string;
    description: string;
    sections: DocSection[];
    category: string;
    icon?: string;
}

export interface NavGroup {
    title: string;
    icon: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    slug: string;
    icon?: string;
}

// API Reference Types

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

export interface ApiEndpoint {
    slug: string;
    title: string;
    method: HttpMethod;
    path: string;
    description: string;
    parameters: ApiParameter[];
    requestBody?: string;
    responseBody: string;
    authentication: boolean;
}

export interface ApiGroup {
    title: string;
    icon: string;
    endpoints: ApiEndpoint[];
}

// Changelog Types

export type ChangeType = 'New' | 'Fix' | 'Improved' | 'Breaking';

export interface ChangelogEntry {
    type: ChangeType;
    description: string;
}

export interface ChangelogVersion {
    version: string;
    date: string;
    entries: ChangelogEntry[];
}

// Search Types

export interface SearchResult {
    title: string;
    slug: string;
    category: 'Documentation' | 'API Reference' | 'Changelog';
    excerpt: string;
}

// Chat Types

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}
