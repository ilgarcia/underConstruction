<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Context

## 1. Code Style

- **File Naming**: Use `kebab-case` for all files and folders.
- **Component Naming**: Use `PascalCase` for React components.
- **Import Aliases**: Use `@/` for the root of the project.
- **Line Length**: Keep lines under 100 characters.
- **Indentation**: Use 2 spaces for indentation.

## 2. Component Design

- **Componentization**: Use Shadcn UI for componentization.
- **Component Structure**:
  - `src/components/ui/`: Base UI components (Shadcn and low-level primitives).
  - `src/components/custom/`: Reusable components (inputs, charts, UI compositions, etc.).
  - `src/components/form/`: Full form components only.
- **Form Rule (STRICT)**:
  - Any full form component MUST be placed inside `src/components/form/`.
- **Form Composition (STRICT)**:
  - Each form MUST have its own folder inside `src/components/form/`.
- **Scoped Components**:
  - Components that belong exclusively to a form MUST be nested inside that form's directory.
  - Example:
    - `cash-flow-form/quick-transaction`
    - `cash-flow-form/category`
    - `cash-flow-form/cash-flow-chart`
- **Encapsulation Rule**:
  - Nested components are private to the form and MUST NOT be reused outside.
  - If reuse is needed, move them to `custom/`.
- **Naming Inside Forms**:
  - Do NOT use `-form` suffix for nested components.
  - The parent folder provides context.
- **Field Components Rule**:
  - Input-like components MUST be placed inside `custom/`, NOT inside `form/`.

## 3. State Management

- **Local State**: Use `useState` for local component state.
- **Global State**: Use Zustand for global state management.
- **Server State**: Use React Query for server state management.

## 4. API Design

- **REST API**: Use RESTful API design principles.
- **Authentication**: Use JWT for authentication.
- **Error Handling**: Return meaningful error messages.

## 5. Testing

- **Unit Tests**: Use Jest for unit testing.
- **Integration Tests**: Use React Testing Library for integration testing.
- **End-to-End Tests**: Use Playwright for end-to-end testing.

## 6. Performance

- **Code Splitting**: Use dynamic imports for code splitting.
- **Lazy Loading**: Use lazy loading for components.
- **Memoization**: Use `memo` and `useCallback` for memoization.

## 7. Security

- **Input Validation**: Validate all user inputs.
- **XSS Protection**: Use proper escaping to prevent XSS attacks.
- **CSRF Protection**: Use CSRF tokens for authentication.

## 8. Documentation

- **Code Comments**: Add comments for complex logic.
- **JSDoc**: Use JSDoc for function documentation.
- **README**: Keep the README updated with project information.

## 9. Git

- **Commit Messages**: Use conventional commits for commit messages.
- **Branch Naming**: Use `feature/` or `fix/` prefixes for branch names.
- **Pull Requests**: Use descriptive pull request titles and descriptions.

## 10. Environment Variables

- **Naming**: Use `UPPER_SNAKE_CASE` for environment variables.
- **Prefixes**: Use `NEXT_PUBLIC_` for public variables.
- **Security**: Never commit environment variables to version control.

## 11. TypeScript

- **Strict Mode**: Enable strict mode in `tsconfig.json`.
- **Type Inference**: Prefer explicit types for public APIs and props. Type inference is allowed only for local variables.
- **Non-Null Assertions**: Avoid non-null assertions (`!`) unless necessary.

## 12. Accessibility

- **ARIA Labels**: Use ARIA labels for interactive elements.
- **Keyboard Navigation**: Ensure all elements are keyboard accessible.
- **Color Contrast**: Maintain sufficient color contrast.

## 13. Deployment

- **Build Optimization**: Optimize the build for production.
- **Environment Configuration**: Use environment-specific configurations.
- **Monitoring**: Set up monitoring and error tracking.

## 14. Code Review

- **Self-Review**: Review your own code before submitting a pull request.
- **Peer Review**: Ensure at least one other developer reviews the code.
- **Checklist**: Use the PR template for code review checklist.

## 15. Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable components
├── lib/              # Utility functions
├── hooks/            # Custom React hooks
├── store/            # State management
├── api/              # API clients
├── types/            # TypeScript types
├── assets/           # Static assets
└── styles/           # Global styles
```

## 16. Best Practices

- **DRY Principle**: Don't repeat yourself.
- **KISS Principle**: Keep it simple, stupid.
- **YAGNI Principle**: You ain't gonna need this.
- **Single Responsibility**: Each component should have one responsibility.
- **Immutability**: Use immutable data structures.

## 17. Tooling

- **Linter**: ESLint
- **Formatter**: Prettier
- **Type Checker**: TypeScript
- **Testing**: Jest, React Testing Library, Playwright
- **Build Tool**: Next.js

## 18. Performance Metrics

- **Bundle Size**: Keep the bundle size under 200KB.
- **Load Time**: Aim for a load time under 2 seconds.
- **First Contentful Paint**: Aim for FCP under 1 second.
- **Time to Interactive**: Aim for TTI under 2 seconds.

## 19. Error Handling

- **Graceful Degradation**: Handle errors gracefully without crashing.
- **Error Boundaries**: Use error boundaries for critical components.
- **Logging**: Log errors to a centralized logging system.
- **User Feedback**: Provide meaningful error messages to users.

## 20. Code Review Checklist

- [ ] Code follows the style guide
- [ ] TypeScript types are used correctly
- [ ] Tests are written and passing
- [ ] Performance is optimized
- [ ] Security best practices are followed
- [ ] Accessibility requirements are met
- [ ] Documentation is up to date
- [ ] No duplicate code
- [ ] Error handling is implemented
- [ ] Environment variables are configured

## 21. Troubleshooting

- **Common Issues**: Check the troubleshooting guide for common issues.
- **Debugging**: Use browser dev tools for debugging.
- **Logging**: Check the logs for error messages.
- **Performance**: Use performance monitoring tools.

## 22. Security Best Practices

- **Input Validation**: Validate all user inputs
- **Output Encoding**: Encode all outputs to prevent XSS
- **Authentication**: Use secure authentication mechanisms
- **Authorization**: Implement proper authorization checks
- **Rate Limiting**: Implement rate limiting on sensitive endpoints
- **SQL Injection**: Use parameterized queries to prevent SQL injection
- **CSRF Protection**: Use CSRF tokens for authentication
- **Security Headers**: Set appropriate security headers
- **Password Storage**: Use bcrypt or Argon2 for password hashing
- **HTTPS**: Use HTTPS in production

## 23. Performance Optimization

- **Code Splitting**: Use dynamic imports for code splitting
- **Lazy Loading**: Use lazy loading for components
- **Memoization**: Use `memo` and `useCallback` for memoization
- **Image Optimization**: Use optimized images
- **Caching**: Implement proper caching strategies
- **CDN**: Use a CDN for static assets
- **Compression**: Enable Gzip or Brotli compression
- **Database Optimization**: Optimize database queries
- **Server-Side Rendering**: Use SSR for better SEO
- **Static Site Generation**: Use SSG for better performance

## 24. Accessibility (a11y)

- **Semantic HTML**: Use appropriate HTML5 elements
- **ARIA Labels**: Use ARIA labels for interactive elements
- **Keyboard Navigation**: Ensure all elements are keyboard accessible
- **Color Contrast**: Maintain sufficient color contrast
- **Focus Management**: Manage focus properly
- **Screen Reader Support**: Ensure screen reader compatibility
- **Form Accessibility**: Make forms accessible
- **Alternative Text**: Provide alt text for images
- **Keyboard Shortcuts**: Implement keyboard shortcuts
- **Testing**: Use accessibility testing tools


## 25. Testing Strategy

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions