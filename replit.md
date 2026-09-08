# HerHealth - Period Tracking & Wellness App

## Overview

HerHealth is a comprehensive menstrual health tracking application designed to empower users with cycle predictions, symptom logging, wellness resources, and personalized insights. The app combines period tracking with educational content, wellness activities, and an AI-powered chatbot assistant named Luna.

**Core Features:**
- Smart cycle tracking with AI-powered predictions
- Symptom and mood logging
- Fertility and ovulation tracking
- Analytics and insights dashboard
- Wellness content (meditation, yoga, nutrition)
- Educational articles
- AI chatbot for menstrual health questions
- Customizable reminders and notifications

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools:**
- React 18 with TypeScript
- Vite as the build tool and dev server
- Wouter for client-side routing
- TanStack Query (React Query) for server state management

**UI Component System:**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom design system
- Theme support (light/dark mode) via ThemeProvider
- Design guidelines emphasize empowering, supportive UX with calm aesthetics
- Custom color system using CSS variables for theming
- Typography: Inter/DM Sans (primary), Poppins/Plus Jakarta Sans (headers)

**State Management:**
- React Context for authentication state (AuthProvider)
- React Context for theme state (ThemeProvider)
- TanStack Query for API data fetching and caching
- Local component state with useState for UI interactions

**Key Frontend Patterns:**
- Component-based architecture with reusable UI components
- Custom hooks for mobile detection, toast notifications
- Firebase integration for authentication and data persistence
- Real-time auth state observation

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- ESM module system
- Development mode uses Vite middleware for HMR
- Production serves static built files

**API Design:**
- RESTful API endpoints under `/api` prefix
- Session-based request logging middleware
- JSON request/response handling
- Raw body parsing for webhook verification

**Authentication:**
- Firebase Authentication (Google OAuth, Email/Password)
- Client-side auth state management
- Protected routes via AuthProvider context

### Data Storage & Management

**Database:**
- PostgreSQL database via Neon serverless driver
- Drizzle ORM for schema management and queries
- Schema defined in `shared/schema.ts` for type safety
- Migration support via drizzle-kit

**Current Schema:**
- Users table with username/password fields
- UUID primary keys with database-generated defaults
- Drizzle-Zod integration for runtime validation

**Firebase Services:**
- Firestore for user profiles, period logs, daily entries
- Real-time data synchronization
- Collections: users, periods, dailyLogs
- Firebase Storage for potential media uploads

**In-Memory Storage:**
- MemStorage class provides temporary storage during development
- Interface-based design allows easy swapping to database implementation

### External Dependencies

**Third-Party Services:**

1. **Firebase Suite:**
   - Firebase Authentication (Google, Email/Password)
   - Cloud Firestore for NoSQL data storage
   - Firebase Storage for file uploads
   - Environment variables required: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID

2. **OpenAI API:**
   - Powers Luna chatbot assistant
   - GPT-based conversational AI for menstrual health guidance
   - System prompt configures Luna as empathetic, knowledgeable assistant
   - Environment variable required: OPENAI_API_KEY

3. **Neon Database:**
   - Serverless PostgreSQL hosting
   - Environment variable required: DATABASE_URL

**Key NPM Packages:**
- @radix-ui/* - Accessible component primitives
- date-fns - Date manipulation and formatting
- recharts - Data visualization charts
- drizzle-orm - TypeScript ORM
- connect-pg-simple - PostgreSQL session store
- wouter - Lightweight routing
- react-icons - Icon library (Google icon for OAuth)

**Development Tools:**
- Replit-specific plugins for error overlay, cartographer, dev banner
- ESBuild for server bundling
- TypeScript for type safety across stack

**Design Assets:**
- Custom generated images stored in `attached_assets/generated_images/`
- Images for hero sections, wellness content, and educational articles

### Architecture Decisions & Rationale

**Hybrid Data Strategy:**
- Firebase chosen for real-time auth and initial user data storage
- PostgreSQL (via Neon) prepared for structured relational data
- Allows gradual migration from Firebase to PostgreSQL as needed
- Trade-off: Dual database complexity vs. flexibility and scalability

**Client-Side Routing:**
- Wouter selected over React Router for smaller bundle size
- Sufficient for single-page application needs
- Protects routes via auth context checks

**Monorepo Structure:**
- Shared schema between client/server in `shared/` directory
- Path aliases (@/, @shared/, @assets/) for clean imports
- Single TypeScript configuration for consistency

**Component Library Approach:**
- Shadcn/ui provides copy-paste components vs. NPM dependencies
- Allows deep customization while maintaining consistency
- Radix UI ensures accessibility standards

**AI Integration:**
- OpenAI integration provides personalized health guidance
- System prompt carefully crafted to avoid medical diagnosis
- Conversation history maintained client-side for context