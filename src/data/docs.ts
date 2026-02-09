import { NavGroup, DocPage, ApiGroup, ChangelogVersion } from '@/types/docs';

// Navigation Groups for Docs
export const docsNavigation: NavGroup[] = [
    {
        title: 'Getting Started',
        icon: 'Rocket',
        items: [
            { title: 'Introduction', slug: 'introduction' },
            { title: 'Quick Start', slug: 'quick-start' },
            { title: 'Installation', slug: 'installation' },
            { title: 'Configuration', slug: 'configuration' },
        ],
    },
    {
        title: 'Core Concepts',
        icon: 'BookOpen',
        items: [
            { title: 'Architecture', slug: 'architecture' },
            { title: 'Authentication', slug: 'authentication' },
            { title: 'Data Models', slug: 'data-models' },
            { title: 'Workflows', slug: 'workflows' },
        ],
    },
    {
        title: 'Guides',
        icon: 'FileText',
        items: [
            { title: 'Integration Guide', slug: 'integration-guide' },
            { title: 'Best Practices', slug: 'best-practices' },
            { title: 'Performance', slug: 'performance' },
            { title: 'Security', slug: 'security' },
        ],
    },
    {
        title: 'Advanced',
        icon: 'Zap',
        items: [
            { title: 'Plugins', slug: 'plugins' },
            { title: 'Custom Extensions', slug: 'custom-extensions' },
            { title: 'Webhooks', slug: 'webhooks' },
            { title: 'Rate Limiting', slug: 'rate-limiting' },
        ],
    },
];

// Documentation Pages
export const docPages: DocPage[] = [
    {
        slug: 'introduction',
        title: 'Introduction',
        description: 'Learn about the fundamentals and get started with our platform.',
        category: 'Getting Started',
        sections: [
            {
                id: 'what-is-this',
                title: 'What is our Platform?',
                content: `Our platform is a comprehensive developer toolkit that enables you to build, deploy, and scale applications with ease. It provides a unified API for all your backend needs, from authentication to data storage, real-time updates, and serverless functions.

Built for modern development workflows, our platform integrates seamlessly with your existing tech stack while providing enterprise-grade security and scalability out of the box.`,
            },
            {
                id: 'key-features',
                title: 'Key Features',
                content: `**Authentication & Authorization**
Built-in user management with support for OAuth, SSO, and custom authentication flows.

**Real-time Database**
Instant data synchronization across all clients with conflict resolution.

**Serverless Functions**
Deploy edge functions globally with zero configuration.

**File Storage**
Secure file uploads with automatic CDN distribution.

**API Gateway**
Rate limiting, caching, and request transformation out of the box.`,
            },
            {
                id: 'why-choose-us',
                title: 'Why Choose Us?',
                content: `**Developer Experience First**
We prioritize developer experience with intuitive APIs, comprehensive documentation, and powerful tooling.

**Enterprise Ready**
SOC2 compliant, 99.99% uptime SLA, and dedicated support for enterprise customers.

**Global Scale**
Deploy to 30+ edge locations worldwide for minimal latency.`,
            },
        ],
    },
    {
        slug: 'quick-start',
        title: 'Quick Start',
        description: 'Get up and running in under 5 minutes.',
        category: 'Getting Started',
        sections: [
            {
                id: 'prerequisites',
                title: 'Prerequisites',
                content: `Before you begin, ensure you have:
- Node.js 18 or later installed
- npm or yarn package manager
- A free account on our platform

\`\`\`bash
# Check your Node.js version
node --version
\`\`\``,
            },
            {
                id: 'installation',
                title: 'Install the SDK',
                content: `Install our SDK using npm or yarn:

\`\`\`bash
npm install @platform/sdk
# or
yarn add @platform/sdk
\`\`\``,
            },
            {
                id: 'initialize',
                title: 'Initialize the Client',
                content: `Import and initialize the client in your application:

\`\`\`typescript
import { createClient } from '@platform/sdk';

const client = createClient({
  apiKey: process.env.PLATFORM_API_KEY,
  projectId: 'your-project-id',
});

// You're ready to use the platform!
const user = await client.auth.getUser();
console.log('Current user:', user);
\`\`\``,
            },
        ],
    },
    {
        slug: 'installation',
        title: 'Installation',
        description: 'Detailed installation instructions for all environments.',
        category: 'Getting Started',
        sections: [
            {
                id: 'node-installation',
                title: 'Node.js Installation',
                content: `\`\`\`bash
npm install @platform/sdk
\`\`\`

Or with yarn:

\`\`\`bash
yarn add @platform/sdk
\`\`\``,
            },
            {
                id: 'browser-installation',
                title: 'Browser Installation',
                content: `For browser environments, use the CDN:

\`\`\`html
<script src="https://cdn.platform.com/sdk/v1.min.js"></script>
\`\`\`

Or import via ESM:

\`\`\`javascript
import { createClient } from 'https://esm.platform.com/sdk';
\`\`\``,
            },
        ],
    },
    {
        slug: 'authentication',
        title: 'Authentication',
        description: 'Learn how to implement authentication in your application.',
        category: 'Core Concepts',
        sections: [
            {
                id: 'overview',
                title: 'Overview',
                content: `Our authentication system supports multiple providers and methods:
- Email/Password
- OAuth (Google, GitHub, Discord)
- Magic Links
- Phone Authentication
- Enterprise SSO (SAML, OIDC)`,
            },
            {
                id: 'email-auth',
                title: 'Email Authentication',
                content: `\`\`\`typescript
// Sign up with email
const { user, session } = await client.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});

// Sign in with email
const { user, session } = await client.auth.signIn({
  email: 'user@example.com',
  password: 'secure-password',
});
\`\`\``,
            },
        ],
    },
];

// API Reference Groups
export const apiGroups: ApiGroup[] = [
    {
        title: 'Authentication',
        icon: 'Lock',
        endpoints: [
            {
                slug: 'sign-up',
                title: 'Sign Up',
                method: 'POST',
                path: '/v1/auth/signup',
                description: 'Create a new user account with email and password.',
                parameters: [],
                requestBody: `{
  "email": "user@example.com",
  "password": "secure-password",
  "metadata": {
    "name": "John Doe"
  }
}`,
                responseBody: `{
  "user": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MjAyNC0wMS0xNQ...",
    "expires_at": 1705312200
  }
}`,
                authentication: false,
            },
            {
                slug: 'sign-in',
                title: 'Sign In',
                method: 'POST',
                path: '/v1/auth/signin',
                description: 'Authenticate an existing user with email and password.',
                parameters: [],
                requestBody: `{
  "email": "user@example.com",
  "password": "secure-password"
}`,
                responseBody: `{
  "user": {
    "id": "usr_1234567890",
    "email": "user@example.com",
    "last_sign_in": "2024-01-15T10:30:00Z"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "v1.MjAyNC0wMS0xNQ...",
    "expires_at": 1705312200
  }
}`,
                authentication: false,
            },
            {
                slug: 'sign-out',
                title: 'Sign Out',
                method: 'POST',
                path: '/v1/auth/signout',
                description: 'Invalidate the current session and sign out the user.',
                parameters: [],
                responseBody: `{
  "success": true
}`,
                authentication: true,
            },
            {
                slug: 'get-user',
                title: 'Get Current User',
                method: 'GET',
                path: '/v1/auth/user',
                description: 'Retrieve the currently authenticated user\'s profile.',
                parameters: [],
                responseBody: `{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "email_verified": true,
  "metadata": {
    "name": "John Doe"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`,
                authentication: true,
            },
        ],
    },
    {
        title: 'Users',
        icon: 'Users',
        endpoints: [
            {
                slug: 'list-users',
                title: 'List Users',
                method: 'GET',
                path: '/v1/users',
                description: 'Retrieve a paginated list of all users.',
                parameters: [
                    { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
                    { name: 'limit', type: 'integer', required: false, description: 'Items per page (default: 20, max: 100)' },
                    { name: 'order', type: 'string', required: false, description: 'Sort order: asc or desc' },
                ],
                responseBody: `{
  "data": [
    {
      "id": "usr_1234567890",
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "has_more": true
  }
}`,
                authentication: true,
            },
            {
                slug: 'get-user-by-id',
                title: 'Get User by ID',
                method: 'GET',
                path: '/v1/users/:id',
                description: 'Retrieve a specific user by their ID.',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'The user ID' },
                ],
                responseBody: `{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "email_verified": true,
  "metadata": {
    "name": "John Doe"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}`,
                authentication: true,
            },
            {
                slug: 'update-user',
                title: 'Update User',
                method: 'PUT',
                path: '/v1/users/:id',
                description: 'Update a user\'s profile information.',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'The user ID' },
                ],
                requestBody: `{
  "metadata": {
    "name": "Jane Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  }
}`,
                responseBody: `{
  "id": "usr_1234567890",
  "email": "user@example.com",
  "metadata": {
    "name": "Jane Doe",
    "avatar_url": "https://example.com/avatar.jpg"
  },
  "updated_at": "2024-01-15T12:00:00Z"
}`,
                authentication: true,
            },
            {
                slug: 'delete-user',
                title: 'Delete User',
                method: 'DELETE',
                path: '/v1/users/:id',
                description: 'Permanently delete a user and all associated data.',
                parameters: [
                    { name: 'id', type: 'string', required: true, description: 'The user ID' },
                ],
                responseBody: `{
  "success": true,
  "deleted_at": "2024-01-15T12:00:00Z"
}`,
                authentication: true,
            },
        ],
    },
    {
        title: 'Projects',
        icon: 'Folder',
        endpoints: [
            {
                slug: 'list-projects',
                title: 'List Projects',
                method: 'GET',
                path: '/v1/projects',
                description: 'Retrieve all projects for the authenticated user.',
                parameters: [],
                responseBody: `{
  "data": [
    {
      "id": "prj_1234567890",
      "name": "My Project",
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}`,
                authentication: true,
            },
            {
                slug: 'create-project',
                title: 'Create Project',
                method: 'POST',
                path: '/v1/projects',
                description: 'Create a new project.',
                parameters: [],
                requestBody: `{
  "name": "New Project",
  "region": "us-west-1"
}`,
                responseBody: `{
  "id": "prj_0987654321",
  "name": "New Project",
  "region": "us-west-1",
  "status": "active",
  "created_at": "2024-01-15T12:00:00Z"
}`,
                authentication: true,
            },
        ],
    },
];

// Changelog Versions
export const changelogVersions: ChangelogVersion[] = [
    {
        version: '2.5.0',
        date: '2024-01-15',
        entries: [
            { type: 'New', description: 'Added support for custom OAuth providers' },
            { type: 'New', description: 'Introduced real-time webhooks for all database operations' },
            { type: 'Improved', description: 'Reduced cold start times by 40% for edge functions' },
            { type: 'Fix', description: 'Fixed race condition in concurrent session management' },
        ],
    },
    {
        version: '2.4.2',
        date: '2024-01-08',
        entries: [
            { type: 'Fix', description: 'Resolved memory leak in long-running connections' },
            { type: 'Fix', description: 'Fixed timezone handling in scheduled functions' },
            { type: 'Improved', description: 'Better error messages for authentication failures' },
        ],
    },
    {
        version: '2.4.0',
        date: '2024-01-02',
        entries: [
            { type: 'New', description: 'GraphQL subscriptions are now available' },
            { type: 'New', description: 'Added support for custom domains' },
            { type: 'Breaking', description: 'Deprecated v0 API endpoints - please migrate to v1' },
            { type: 'Improved', description: 'Dashboard UI refresh with dark mode' },
        ],
    },
    {
        version: '2.3.0',
        date: '2023-12-20',
        entries: [
            { type: 'New', description: 'Introduced AI-powered query suggestions' },
            { type: 'New', description: 'Added SAML SSO support for enterprise plans' },
            { type: 'Improved', description: 'SDK bundle size reduced by 25%' },
            { type: 'Fix', description: 'Fixed intermittent 504 errors on high-traffic endpoints' },
        ],
    },
    {
        version: '2.2.0',
        date: '2023-12-10',
        entries: [
            { type: 'New', description: 'Storage bucket policies for fine-grained access control' },
            { type: 'Improved', description: 'Faster database migrations with zero downtime' },
            { type: 'Fix', description: 'Corrected pagination offset calculation' },
        ],
    },
];
