# AthensGo - GitHub Copilot Instructions

## Project Overview

**AthensGo** is a tourist assistance application that helps visitors to Athens, Greece generate personalized tourist routes based on their preferences. Built for the Apps4Athens Hackathon.

## Architecture

This is a **monorepo** with three distinct projects:

1. **Backend** (`projects/backend/`) - NestJS REST API with AI-powered itinerary generation
2. **Mobile App** (`projects/app/`) - React Native mobile application with Expo
3. **Landing Page** (`projects/landing/`) - React web landing page with Vite

## Monorepo Structure

- Root uses **Bun workspaces**
- Each project is independent with its own `package.json`
- Use `bun` as the package manager (not npm or yarn)
- Navigate to specific project directories to run project-specific commands

## General Coding Standards

### TypeScript

- Use TypeScript for all projects
- Prefer strict typing
- Use `type` for object types, `interface` for extendable contracts
- Avoid `any` types when possible

### Code Style

- Use **ESLint** for linting
- Use descriptive variable and function names
- Prefer functional programming patterns
- Use async/await over promises
- Use arrow functions for callbacks

### File Organization

- Keep related files close together (feature-based structure)
- Use index files for clean exports
- DTOs and entities in separate folders
- One component/service per file

### Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`, `auth.service.ts`)
- **Components**: PascalCase (e.g., `UserProfile`, `AuthButton`)
- **Functions/Variables**: camelCase (e.g., `getUserProfile`, `isAuthenticated`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `AuthResponse`)

## Project-Specific Instructions

See individual project Copilot instruction files:
- Backend: `projects/backend/.github/copilot-instructions.md`
- Mobile App: `projects/app/.github/copilot-instructions.md`
- Landing Page: `projects/landing/.github/copilot-instructions.md`

## Domain Knowledge

### Athens Tourism Context

- Focus on Athens, Greece attractions
- Consider Greek cultural sensitivity
- Support both Greek and English languages where appropriate
- Common tourist interests: Ancient history, archaeology, gastronomy, nightlife, beaches
- Popular areas: Acropolis, Plaka, Monastiraki, Syntagma, Kolonaki, Psyrri

### User Personas

- **Solo travelers**: Flexibility, social opportunities
- **Couples**: Romantic experiences, fine dining
- **Families**: Kid-friendly activities, accessibility
- **Friend groups**: Social experiences, nightlife

### Budget Categories

- **Low**: Free attractions, street food, public transport
- **Medium**: Museum entries, mid-range restaurants, occasional taxis
- **High**: Premium experiences, fine dining, private tours

## Common Patterns

### Error Handling

```typescript
try {
  // operation
} catch (error) {
  // Log error with context
  // Throw appropriate HTTP exception or handle gracefully
}
```

### API Responses

- Use proper HTTP status codes
- Return consistent response structures
- Include error messages that are user-friendly

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for documentation
- Access via `process.env.VARIABLE_NAME`

## Git Workflow

- Use meaningful commit messages
- Branch naming: `feature/description`, `fix/description`, `chore/description`
- Keep commits atomic and focused
- node_modules are gitignored (do not commit)

## Dependencies

### When Adding Dependencies

1. Navigate to the specific project directory
2. Use `bun add <package>` or `bun add -d <package>` for dev dependencies
3. Update imports and types as needed
4. Document if it requires environment variables

## Testing

- Write tests for critical business logic
- Use Jest for unit tests
- Mock external dependencies
- Aim for meaningful coverage over 100% coverage

## Documentation

- Add JSDoc comments for public APIs
- Keep README files updated
- Document environment variables
- Add inline comments for complex logic only

## Performance Considerations

- Optimize API calls (batch when possible)
- Use pagination for large datasets
- Implement caching where appropriate
- Lazy load heavy components
- Optimize images and assets

## Security

- Never expose API keys or secrets
- Validate all user inputs
- Use JWT for authentication
- Sanitize data before database operations
- Use HTTPS in production

## AI/Genkit Specific

- AI flows are in `projects/backend/src/ai/flows/`
- Use Genkit tools for external integrations (e.g., Google Maps)
- Always validate AI outputs with Zod schemas
- Provide clear, specific prompts to AI models
- Handle AI failures gracefully

