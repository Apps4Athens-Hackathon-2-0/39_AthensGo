# AthensGo Backend - GitHub Copilot Instructions

## Project Overview

NestJS-based REST API that powers the AthensGo application. Provides AI-powered personalized itinerary generation for Athens tourism using Google Genkit and Google Maps APIs.

## Tech Stack

- **Framework**: NestJS 11.x
- **Runtime**: Bun (use for running and package management)
- **Language**: TypeScript (ES2023, NodeNext modules)
- **AI**: Google Genkit with Google Generative AI
- **APIs**: Google Maps Services
- **Authentication**: JWT via @nestjs/jwt
- **Validation**: class-validator, class-transformer
- **Documentation**: OpenAPI/Swagger with Scalar UI
- **Testing**: Jest

## Architecture

### Module Structure

```
src/
├── ai/              # AI-powered itinerary generation
│   ├── flows/       # Genkit flows (AI workflows)
│   ├── tools/       # Genkit tools (external integrations)
│   ├── dto/         # Data Transfer Objects
│   ├── ai.service.ts
│   ├── ai.controller.ts
│   └── genkit.ts    # Genkit configuration
├── auth/            # Authentication & authorization
│   ├── dto/
│   ├── types/
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.guard.ts
├── users/           # User management
│   ├── entities/
│   ├── dto/
│   └── users.service.ts
├── app.module.ts    # Root module
└── main.ts          # Application bootstrap
```

## Coding Standards

### NestJS Patterns

#### Modules
```typescript
@Module({
  imports: [/* other modules */],
  controllers: [/* controllers */],
  providers: [/* services */],
  exports: [/* services to export */],
})
export class FeatureModule {}
```

#### Controllers
```typescript
@Controller('resource')
@ApiTags('resource')
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Post()
  @ApiOperation({ summary: 'Description' })
  @ApiResponse({ status: 201, description: 'Success' })
  async create(@Body() dto: CreateDto) {
    return this.service.create(dto);
  }
}
```

#### Services
```typescript
@Injectable()
export class ResourceService {
  // Business logic here
  async findOne(id: string): Promise<Resource> {
    // implementation
  }
}
```

### DTOs (Data Transfer Objects)

- Use `class-validator` decorators for validation
- Use `@ApiProperty()` from `@nestjs/swagger` for documentation
- Place in `dto/` folder within each module
- Export from `dto/index.ts` for clean imports

Example:
```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({ description: 'Description', example: 'value' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['option1', 'option2'] })
  @IsEnum(['option1', 'option2'])
  type: 'option1' | 'option2';
}
```

### Genkit AI Flows

Located in `src/ai/flows/`, these are the AI workflow definitions.

#### Flow Structure
```typescript
import { ai } from '../genkit';
import { z } from 'genkit';

const InputSchema = z.object({
  field: z.string().describe('Description for AI'),
});

const OutputSchema = z.object({
  result: z.string().describe('Description'),
});

const myPrompt = ai.definePrompt({
  name: 'promptName',
  input: { schema: InputSchema },
  output: { schema: OutputSchema },
  tools: [/* tools */],
  prompt: `System prompt here with {{{inputField}}} placeholders`,
});

export const myFlow = ai.defineFlow({
  name: 'myFlow',
  inputSchema: InputSchema,
  outputSchema: OutputSchema,
}, async (input) => {
  const result = await myPrompt(input);
  return result.output;
});
```

#### Key Patterns
- Always define Zod schemas for input/output validation
- Use `.describe()` on schema fields to guide AI behavior
- Use tools for external API calls (Google Maps, etc.)
- Handle tool calls properly in prompts
- Always validate AI outputs against schemas

### Genkit Tools

Located in `src/ai/tools/`, these provide external integrations.

```typescript
import { ai } from '../genkit';
import { z } from 'genkit';

export const myTool = ai.defineTool({
  name: 'toolName',
  description: 'What this tool does',
  inputSchema: z.object({
    param: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
}, async (input) => {
  // Make external API call
  // Return structured data
});
```

### Authentication

- JWT-based authentication
- Use `AuthGuard` from `src/auth/auth.guard.ts`
- Apply with `@UseGuards(AuthGuard)` decorator
- Access user from request: `@Request() req: RequestWithUser`

Example:
```typescript
@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req: RequestWithUser) {
  return req.user;
}
```

### API Documentation

- Use OpenAPI/Swagger decorators
- API docs available at `/reference` (Scalar UI)
- OpenAPI spec at `/openapi`

Key decorators:
- `@ApiTags('tag')` - Group endpoints
- `@ApiOperation({ summary: 'Description' })` - Describe endpoint
- `@ApiResponse()` - Document responses
- `@ApiBearerAuth()` - Mark as requiring auth
- `@ApiProperty()` - Document DTO properties

## Environment Variables

Create `.env` file (not committed):
```
PORT=3000
JWT_SECRET=your-secret-key
GOOGLE_API_KEY=your-google-api-key
# Add others as needed
```

Access in code:
```typescript
process.env.PORT ?? 3000
```

## Running the Application

```bash
# Development (with hot reload)
bun run start:dev

# Production build
bun run build
bun run start:prod

# Tests
bun test
```

## Key Dependencies

- `@nestjs/common`, `@nestjs/core` - Core framework
- `@nestjs/platform-express` - HTTP server
- `@nestjs/swagger`, `@scalar/nestjs-api-reference` - API docs
- `@nestjs/jwt` - JWT authentication
- `genkit`, `@genkit-ai/google-genai` - AI flows
- `@googlemaps/google-maps-services-js` - Google Maps integration
- `class-validator`, `class-transformer` - Validation
- `reflect-metadata` - Required for decorators
- `rxjs` - Reactive programming (NestJS dependency)

## AI-Specific Guidelines

### Itinerary Generation

The main AI feature generates personalized itineraries for Athens tourists.

Key considerations:
- Use `findAthensPlaceDetails` tool to get accurate coordinates
- Never invent locations or coordinates
- Consider user preferences: budget, interests, travel style, companion type
- Structure output with clear day-by-day breakdown
- Include practical information: duration, distance, difficulty

### Prompt Engineering

- Be specific and clear in prompts
- Provide context about Athens tourism
- Use examples when helpful
- Define output structure clearly
- Handle edge cases (e.g., closed venues, weather)

### Error Handling with AI

```typescript
try {
  const result = await flow.run(input);
  return result;
} catch (error) {
  // Log AI errors appropriately
  throw new InternalServerErrorException('Failed to generate itinerary');
}
```

## Testing

- Unit tests for services
- E2E tests for controllers
- Mock external dependencies (Genkit, Google Maps)
- Test validation and error cases

```typescript
describe('ServiceName', () => {
  let service: ServiceName;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ServiceName],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## Common Patterns

### Exception Handling
```typescript
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

throw new HttpException('Message', HttpStatus.BAD_REQUEST);
// or use built-in exceptions:
throw new NotFoundException('Resource not found');
throw new UnauthorizedException('Invalid credentials');
throw new BadRequestException('Invalid input');
```

### Async Operations
```typescript
async findAll(): Promise<Resource[]> {
  return await this.repository.find();
}
```

## Performance

- Use caching for expensive operations
- Batch API calls when possible
- Implement pagination for large datasets
- Optimize AI prompts for faster responses
- Monitor and log AI token usage

## Security

- Validate all inputs with class-validator
- Use guards for protected routes
- Sanitize data before processing
- Don't expose internal errors to clients
- Use environment variables for secrets
- Implement rate limiting for AI endpoints

## Debugging

- Use NestJS logger: `this.logger.log('message')`
- Enable debug mode: `bun run start:debug`
- Check Swagger docs for API testing
- Use Genkit DevUI for debugging AI flows (if available)

