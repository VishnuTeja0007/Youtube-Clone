# YouTube Clone

A comprehensive full-stack YouTube clone application that replicates the core functionality of the world's leading video-sharing platform. This project demonstrates modern web development practices through a scalable architecture, real-time features, and professional user experience design.

## Features

### User Authentication & Profile Management
- **Secure Registration System**: Multi-field user registration with email validation, password strength requirements, and duplicate account prevention
- **JWT-Based Authentication**: Industry-standard JSON Web Token implementation for secure session management with automatic token refresh
- **Profile Customization**: User avatar uploads, bio editing, and social link integration
- **Session Persistence**: Automatic login state restoration across browser sessions using secure localStorage implementation
- **Account Security**: Password hashing with bcrypt, protected routes, and secure logout functionality

### Video Management & Streaming
- **Advanced Upload System**: Multi-format video support with automatic transcoding, thumbnail generation, and metadata extraction
- **Video Processing Pipeline**: Background processing for video optimization, quality settings, and adaptive streaming preparation
- **Rich Metadata Management**: Comprehensive video information including titles, descriptions, tags, categories, and upload scheduling
- **Video Analytics**: View counts, engagement metrics, and performance tracking for content creators
- **Privacy Controls**: Public, unlisted, and private video settings with granular access control

### Social Interaction & Engagement
- **Advanced Comment System**: Nested replies with unlimited depth, comment threading, @mentions, and rich text support
- **Engagement Metrics**: Real-time like/dislike counters with user interaction history and sentiment analysis
- **Channel Subscription System**: One-click subscriptions with notification preferences and subscription management
- **Watch History**: Intelligent video tracking with resume playback functionality and viewing pattern analysis
- **Content Discovery**: Trending algorithms, personalized recommendations, and content categorization

### Professional User Interface
- **Responsive Design**: Mobile-first approach with seamless adaptation across all device sizes and orientations
- **Dark Theme Implementation**: YouTube-inspired dark mode with careful attention to contrast ratios and accessibility standards
- **Component Architecture**: Modular React components with reusable UI elements and consistent design patterns
- **Interactive Elements**: Smooth animations, hover states, loading indicators, and micro-interactions throughout the interface
- **Accessibility Features**: ARIA labels, keyboard navigation, screen reader compatibility, and WCAG 2.1 compliance

## Usage & Application

### For Content Creators
The platform provides comprehensive tools for content creators to:
- **Upload and Manage Content**: Bulk video uploads, batch processing, and content organization through custom channels
- **Build Audience**: Channel branding, subscriber analytics, and engagement tracking to grow their community
- **Monetization Ready**: Infrastructure prepared for future advertising integration and revenue sharing models
- **Performance Insights**: Detailed analytics on viewer demographics, watch time, and content performance

### For Viewers
Users enjoy a feature-rich viewing experience:
- **Seamless Discovery**: Intelligent search functionality, personalized recommendations, and curated content feeds
- **Interactive Engagement**: Real-time commenting, video reactions, and community participation features
- **Cross-Device Sync**: Watch history synchronization across devices with offline viewing capabilities
- **Social Integration**: Share videos, follow creators, and participate in community discussions

### For Developers
This project serves as a comprehensive learning resource:
- **Modern Architecture**: Demonstrates scalable full-stack development with separation of concerns
- **Best Practices**: Implements industry-standard coding patterns, security measures, and optimization techniques
- **Technology Integration**: Shows effective combination of multiple modern technologies in a cohesive application
- **Extensible Design**: Modular structure allows for easy feature additions and system enhancements

## Setup Process

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure & Architecture

### Backend Architecture Overview

The backend follows a **layered architecture pattern** with clear separation of concerns, ensuring maintainability and scalability:

#### Core Configuration Layer
- **`server.js`** - Application entry point that initializes the Express server, configures environment variables, establishes database connections, and starts the listening process. Handles graceful shutdown procedures and error logging.
- **`src/app.js`** - Central Express application configuration that registers middleware, sets up CORS policies, defines route prefixes, and implements global error handling strategies.

#### Data Access Layer
- **`src/config/db.js`** - MongoDB connection management with connection pooling, retry logic, and environment-specific configuration. Handles database lifecycle events and connection monitoring.
- **`src/models/`** - Mongoose schema definitions that enforce data integrity and business rules at the database level:
  - **`userModel.js`** - Comprehensive user schema with authentication fields, profile information, preferences, and activity tracking. Includes virtual fields for derived data and middleware for password hashing.
  - **`videoModel.js`** - Complex video schema supporting metadata, processing status, engagement metrics, and content relationships. Implements indexing for optimal query performance.
  - **`channelModel.js`** - Channel management schema with subscriber tracking, analytics data, and branding information. Supports hierarchical channel structures.
  - **`commentModel.js`** - Nested comment schema supporting threaded discussions, moderation flags, and rich content. Includes aggregation pipelines for comment analytics.

#### Business Logic Layer
- **`src/controllers/`** - Request handlers that implement core business logic and coordinate between models and services:
  - **`authController.js`** - Handles user authentication flows including registration validation, login verification, token generation, and session management. Implements rate limiting and security measures.
  - **`videoController.js`** - Manages video lifecycle operations including upload processing, metadata updates, search functionality, and analytics tracking. Coordinates with file storage systems.
  - **`channelController.js`** - Channel creation, customization, subscriber management, and analytics operations. Implements channel permission systems.
  - **`commentController.js`** - Comment CRUD operations, moderation workflows, and threading logic. Handles spam detection and content filtering.
  - **`actionController.js`** - User interaction handlers for likes, dislikes, subscriptions, and watch history. Implements engagement tracking and recommendation algorithms.

#### Routing Layer
- **`src/routes/`** - Express route definitions that map HTTP endpoints to controller functions:
  - **`authRoutes.js`** - Authentication endpoints with validation middleware and security headers
  - **`videoRoutes.js`** - Video-related endpoints with pagination, filtering, and sorting capabilities
  - **`channelRoutes.js`** - Channel management endpoints with permission-based access control
  - **`commentRoutes.js`** - Comment system endpoints with threading and moderation support
  - **`miscellaneousRoutes.js`** - User action endpoints for engagement tracking and social features

#### Middleware Layer
- **`src/middlewares/`** - Custom middleware functions for cross-cutting concerns:
  - **`auth.js`** - JWT token verification, user session validation, and protected route implementation
  - **`validation.js`** - Input sanitization, schema validation, and request normalization
  - **`errorHandler.js`** - Centralized error processing with appropriate HTTP status codes and error formatting

### Frontend Architecture Overview

The frontend implements a **component-based architecture** with modern React patterns and state management strategies:

#### Application Core
- **`main.jsx`** - React application bootstrap with Router configuration, global providers setup, and error boundary implementation. Manages application initialization and service worker registration.
- **`App.jsx`** - Root component with route definitions, layout structure, and global state providers. Implements routing logic and page-level error handling.
- **`index.css`** - Global styles including CSS custom properties for theming, utility classes, and responsive design foundations.

#### Page Components
- **`pages/Login.jsx`** - Authentication interface with form validation, error handling, and social login integration. Implements accessibility features and progressive enhancement.
- **`pages/Register.jsx`** - User registration flow with multi-step form validation, real-time feedback, and terms acceptance. Includes password strength indicators and email verification.
- **`pages/Homepage.jsx`** - Main content discovery interface with video feeds, trending content, and personalized recommendations. Implements infinite scrolling and lazy loading.
- **`pages/Videos.jsx`** - Video playback interface with adaptive streaming, engagement controls, and recommendation sidebar. Includes accessibility features and keyboard shortcuts.

#### Reusable Components
- **`components/Header.jsx`** - Navigation header with search functionality, user menu, and notification system. Implements responsive design and accessibility features.
- **`components/VideoCard.jsx`** - Video thumbnail component with metadata display, engagement metrics, and hover interactions. Supports different layout modes and loading states.
- **`components/CommentSection.jsx`** - Complete comment interface with threading, real-time updates, and moderation tools. Implements rich text editing and @mention functionality.
- **`components/SuccesToast.jsx`** - Notification system with multiple toast types, auto-dismiss functionality, and queue management. Supports custom positioning and animations.
- **`components/channelForms/`** - Channel creation and management forms with validation, image upload, and preview functionality.

#### State Management
- **`contexts/userContext.jsx`** - React Context provider for user authentication state, session management, and global user operations. Implements optimistic updates and error recovery.
- **`store/`** - Redux Toolkit configuration for complex application state including video data, UI state, and caching strategies. Implements middleware for persistence and synchronization.

#### Service Layer
- **`services/`** - API abstraction layer with request/response interceptors, error handling, and caching mechanisms. Implements retry logic and offline support.

#### Layout Components
- **`Layout/authLayout.jsx`** - Authentication page layout with centered content, background styling, and responsive behavior. Implements loading states and error boundaries.

## Technology Stack & Implementation Details

### Backend Technologies

#### Core Framework & Runtime
- **Node.js (v16+)** - Asynchronous JavaScript runtime built on Chrome's V8 engine, providing event-driven, non-blocking I/O operations optimized for scalable network applications
- **Express.js (v5.x)** - Minimalist and flexible web application framework that provides robust set of features for web and mobile applications, including routing, middleware support, and HTTP utility methods
- **MongoDB with Mongoose ODM** - NoSQL document database with flexible schema design, horizontal scalability, and powerful aggregation framework. Mongoose provides elegant MongoDB object modeling for Node.js with schema validation, middleware, and business logic hooks

#### Security & Authentication
- **JWT (JSON Web Tokens)** - Industry-standard RFC 7519 implementation for stateless authentication, enabling secure token-based authentication with payload claims and signature verification
- **bcryptjs** - Cryptographic library implementing the bcrypt password hashing algorithm with salt rounds for secure password storage, providing protection against rainbow table attacks and brute force attempts
- **CORS (Cross-Origin Resource Sharing)** - Security mechanism that allows or restricts requested resources on a web server depending on where the HTTP request was initiated, configured with flexible origin policies

#### Development & Deployment
- **Nodemon** - Development utility that automatically restarts the Node.js application when file changes are detected, improving development workflow efficiency
- **dotenv** - Zero-dependency module that loads environment variables from a .env file into process.env, enabling configuration management across different deployment environments

### Frontend Technologies

#### Core Framework & Build Tools
- **React 19** - Latest version of Facebook's JavaScript library for building user interfaces, featuring concurrent rendering, automatic batching, and improved server-side rendering capabilities
- **Vite (v7.x)** - Next-generation frontend build tool providing lightning-fast development server, optimized production builds, and modern ES module support with Hot Module Replacement (HMR)

#### Styling & Design System
- **Tailwind CSS (v4.x)** - Utility-first CSS framework that provides low-level utility classes for building custom designs without writing CSS, featuring JIT compilation, dark mode support, and responsive design utilities
- **Lucide React** - Beautifully crafted, consistent icon library with 300+ icons, designed for React applications with tree-shaking support and multiple stroke variants

#### State Management & Data Flow
- **Redux Toolkit** - Official, opinionated, batteries-included toolset for efficient Redux development, including configureStore, createSlice, and createAsyncThunk for simplified store setup and reducer management
- **React Router (v7.x)** - Declarative routing library for React applications supporting dynamic routing, code splitting, nested routes, and navigation guards with modern hooks-based API

#### HTTP Client & Data Fetching
- **Axios** - Promise-based HTTP client for the browser and Node.js with request/response transformation, automatic JSON data transformation, and built-in support for request cancellation and timeout handling

#### Development Tools
- **ESLint** - Pluggable JavaScript linter for identifying and fixing problems in JavaScript code, with React-specific rules for enforcing best practices and code consistency
- **Vite Plugin React** - Official Vite plugin for React applications providing Fast Refresh, JSX support, and React-specific optimizations

## API Architecture & Endpoints

### Authentication & User Management
The authentication system implements RESTful principles with comprehensive security measures:

#### User Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```
- Validates input data with comprehensive schema validation
- Checks for existing users to prevent duplicate accounts
- Hashes passwords using bcrypt with configurable salt rounds
- Returns JWT tokens upon successful registration
- Implements rate limiting to prevent abuse

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```
- Verifies credentials against hashed passwords in database
- Generates short-lived access tokens and refresh tokens
- Implements secure token storage and transmission
- Provides detailed error messages for debugging
- Logs authentication attempts for security monitoring

### Video Management System
Comprehensive video lifecycle management with processing pipelines and analytics:

#### Video Upload & Processing
```http
POST /api/videos
Content-Type: multipart/form-data
Authorization: Bearer <token>

{
  "video": "file",
  "thumbnail": "file", 
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "category": "string"
}
```
- Handles multi-format video uploads with size validation
- Generates automatic thumbnails from video frames
- Processes videos for adaptive streaming (multiple resolutions)
- Extracts metadata including duration, dimensions, and codecs
- Implements background processing queue for large files

#### Video Discovery & Search
```http
GET /api/videos?page=1&limit=20&category=music&sort=trending
Authorization: Bearer <token>
```
- Advanced search with full-text search capabilities
- Pagination with cursor-based navigation for large datasets
- Filtering by category, date range, duration, and quality
- Sorting options (newest, oldest, trending, most viewed)
- Personalized recommendations based on user history

### Social Interaction APIs
Real-time engagement tracking and social features:

#### Engagement System
```http
POST /api/actions/like
Content-Type: application/json
Authorization: Bearer <token>

{
  "videoId": "string",
  "action": "like|dislike"
}
```
- Tracks user interactions with atomic operations
- Prevents duplicate likes/dislikes with unique constraints
- Updates video engagement metrics in real-time
- Provides user interaction history for personalization
- Implements undo functionality for changed preferences

#### Comment System
```http
GET /api/comments/:videoId?page=1&sort=newest
POST /api/comments
Content-Type: application/json
Authorization: Bearer <token>

{
  "videoId": "string",
  "content": "string",
  "parentId": "string" // for replies
}
```
- Nested comment threading with unlimited depth
- Real-time comment updates using WebSocket connections
- Moderation tools with flagging and reporting systems
- Rich text support with @mention functionality
- Spam detection and automated moderation

## Development Workflow & Best Practices

### Code Organization Standards
- **Modular Architecture**: Each feature is organized into self-contained modules with clear boundaries
- **Separation of Concerns**: Business logic, data access, and presentation layers are strictly separated
- **Dependency Injection**: Services and dependencies are injected rather than hard-coded
- **Configuration Management**: Environment-specific configurations are externalized and managed separately

### Security Implementation
- **Input Validation**: All user inputs are validated using comprehensive schema validation
- **SQL Injection Prevention**: Parameterized queries and ORM usage prevent injection attacks
- **XSS Protection**: Content sanitization and output encoding prevent cross-site scripting
- **Rate Limiting**: API endpoints implement rate limiting to prevent abuse and DDoS attacks
- **Secure Headers**: Security headers are implemented for enhanced browser protection

### Performance Optimization
- **Database Indexing**: Strategic indexing on frequently queried fields for optimal performance
- **Caching Strategies**: Multi-level caching with Redis for frequently accessed data
- **Lazy Loading**: Components and data are loaded on-demand to reduce initial load times
- **Code Splitting**: Frontend code is split into chunks for efficient loading
- **Image Optimization**: Images are automatically optimized and served in appropriate formats

### Testing Strategy
- **Unit Testing**: Individual functions and components are tested in isolation
- **Integration Testing**: API endpoints and database interactions are thoroughly tested
- **End-to-End Testing**: Complete user flows are tested to ensure system reliability
- **Performance Testing**: Load testing ensures system can handle expected traffic
- **Security Testing**: Vulnerability scanning and penetration testing for security assurance

This comprehensive documentation provides developers with the necessary understanding to contribute to, deploy, and maintain the YouTube Clone application effectively.
