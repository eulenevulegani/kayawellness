# KAYA Backend API

Production-ready backend for the KAYA wellness platform built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with refresh tokens
- 📊 **Database**: PostgreSQL with Prisma ORM
- ⚡ **Caching**: Redis for performance optimization
- 🤖 **AI Integration**: Google Gemini AI for personalized content
- 🔌 **Real-time**: Socket.IO for live features
- 📧 **Email**: Automated email notifications
- 💳 **Payments**: Stripe integration for subscriptions
- 📝 **Logging**: Winston logger with file rotation
- 🐳 **Docker**: Complete containerization setup
- 🔒 **Security**: Helmet, CORS, rate limiting
- ✅ **Validation**: Express-validator for input validation

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Cache**: Redis
- **AI**: Google Gemini
- **WebSockets**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer
- **Payments**: Stripe
- **File Storage**: AWS S3

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Prisma client
│   │   ├── redis.ts     # Redis client
│   │   └── index.ts     # App config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # Authentication
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   └── validation.ts
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── ai.service.ts
│   │   ├── email.service.ts
│   │   └── session.service.ts
│   ├── sockets/         # WebSocket handlers
│   ├── utils/           # Utilities
│   │   ├── logger.ts
│   │   └── errors.ts
│   └── server.ts        # App entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env.example
```

## Prerequisites

- Node.js 20+
- Supabase account (free tier available)
- Resend account (free tier available)
- Redis (optional - can use Upstash free tier)
- npm or yarn

## Installation

### Quick Setup with Supabase & Resend

1. **Create accounts** (5 minutes - both free!)
   - Supabase: [supabase.com](https://supabase.com) - Create project
   - Resend: [resend.com](https://resend.com) - Get API key

2. **Navigate to backend**
   ```bash
   cd backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` and add:
   - Supabase DATABASE_URL and DIRECT_URL
   - Resend API key
   - JWT secrets

   📖 See `SUPABASE_RESEND_SETUP.md` for detailed instructions.

5. **Set up database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # Seed database (optional)
   npm run prisma:seed
   ```

## Running the Application

### Development Mode

```bash
npm run dev
```

The server will start on `http://localhost:5000` with hot-reload enabled.

### Production Mode

```bash
npm run build
npm start
```

### Docker

```bash
# Note: Using Supabase, so no local PostgreSQL needed
# Docker only runs Redis (optional) and API

# Start services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Session Endpoints

All session endpoints require authentication header:
```
Authorization: Bearer <access_token>
```

#### Create Session
```http
POST /sessions
Content-Type: application/json

{
  "activityType": "MEDITATION",
  "title": "Morning Meditation",
  "durationMinutes": 10,
  "scriptContent": "..."
}
```

#### Get User Sessions
```http
GET /sessions?limit=20&offset=0
```

#### Complete Session
```http
PATCH /sessions/:id/complete
Content-Type: application/json

{
  "mood": "calm",
  "reflection": "Felt very peaceful",
  "rating": 5
}
```

### Program Endpoints

#### Get All Programs
```http
GET /programs
```

#### Enroll in Program
```http
POST /programs/:id/enroll
```

#### Get My Enrollments
```http
GET /programs/enrollments/my
```

### Journal Endpoints

#### Create Journal Entry
```http
POST /journal
Content-Type: application/json

{
  "title": "Today's Reflection",
  "content": "...",
  "mood": "peaceful",
  "tags": ["mindfulness", "gratitude"]
}
```

#### Get Journal Entries
```http
GET /journal
```

#### Add Gratitude Entry
```http
POST /journal/gratitude
Content-Type: application/json

{
  "word": "sunshine"
}
```

### Community Endpoints

#### Get Community Posts
```http
GET /community?category=support&limit=20
```

#### Create Post
```http
POST /community
Content-Type: application/json

{
  "content": "Sharing my journey...",
  "category": "support",
  "isAnonymous": false
}
```

#### Like Post
```http
POST /community/:id/like
```

#### Add Comment
```http
POST /community/:id/comments
Content-Type: application/json

{
  "content": "Great post!"
}
```

### AI Endpoints

#### Generate Personalized Session
```http
POST /ai/session/generate
Content-Type: application/json

{
  "mood": "anxious",
  "goals": ["stress relief", "better sleep"],
  "sessionLength": "medium"
}
```

#### Generate Sleep Story
```http
POST /ai/sleep-story/generate
Content-Type: application/json

{
  "theme": "peaceful forest"
}
```

#### Chat with AI
```http
POST /ai/chat
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "I'm feeling stressed"}
  ]
}
```

## WebSocket Events

Connect to WebSocket:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

#### Session Events
```javascript
// Start session
socket.emit('session:start', { sessionId: '123' });

// Complete session
socket.emit('session:complete', { 
  sessionId: '123',
  xpEarned: 50 
});

// Listen for session updates
socket.on('session:acknowledged', (data) => {
  console.log('Session started:', data);
});
```

#### Chat Events
```javascript
// Send message
socket.emit('chat:message', {
  text: 'I need help with anxiety'
});

// Receive response
socket.on('chat:response', (data) => {
  console.log('AI response:', data.text);
});
```

## Database Schema

Key models:
- **User**: User accounts and profiles
- **Session**: Meditation/wellness sessions
- **WellnessProgram**: Multi-day programs
- **Achievement**: Unlockable achievements
- **JournalEntry**: Personal journal entries
- **CommunityPost**: Community content
- **WellnessEvent**: Scheduled events
- **Therapist**: Therapist directory

See `prisma/schema.prisma` for complete schema.

## Environment Variables

Required variables:
```env
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=             # JWT signing secret
JWT_REFRESH_SECRET=     # Refresh token secret
GEMINI_API_KEY=         # Google Gemini API key
```

Optional but recommended:
```env
REDIS_HOST=             # Redis host
REDIS_PORT=             # Redis port
EMAIL_HOST=             # SMTP host
EMAIL_USER=             # SMTP username
EMAIL_PASSWORD=         # SMTP password
STRIPE_SECRET_KEY=      # Stripe secret
AWS_ACCESS_KEY_ID=      # AWS access key
AWS_SECRET_ACCESS_KEY=  # AWS secret
```

## Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm test                 # Run tests
```

## Error Handling

All errors are handled by the centralized error handler middleware. Custom error classes:

- `ValidationError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `TooManyRequestsError` (429)

## Security

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- JWT with short expiration (15 minutes)
- Refresh tokens with 7-day expiration
- Password hashing with bcrypt
- Input validation on all routes

## Performance

- Redis caching for frequently accessed data
- Database query optimization with Prisma
- Connection pooling
- Compression middleware
- Efficient indexing strategy

## Logging

Logs are written to:
- `logs/all.log` - All logs
- `logs/error.log` - Error logs only
- Console - Development mode

## Testing

```bash
npm test
```

(Note: Add test files in `__tests__` directory)

## Deployment

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables on your server

3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Docker Deployment

```bash
docker-compose up -d
```

## Monitoring

Add monitoring services:
- **Sentry**: Error tracking
- **Prometheus**: Metrics
- **Grafana**: Dashboards
- **PM2**: Process management

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update API documentation
4. Use conventional commits

## License

MIT

## Support

For issues and questions, please open an issue on GitHub or contact support@kaya.app
