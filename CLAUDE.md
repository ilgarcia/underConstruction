# Project Rules (MANDATORY)

Follow all rules defined in agents.md.

## Critical Rules

- This is a modern Next.js project. Do NOT assume legacy patterns.
- Always follow the latest Next.js conventions (App Router).
- Use TypeScript strictly (no `any`).
- Use React Query for server state.
- Use Zustand for global state.
- Tailwind CSS is mandatory (no inline styles).

## Next.js Warning

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->