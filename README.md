# 🎬 Movie Production System

A full-stack **Movie Management Platform** for cataloguing movies, actors, and directors, with role-based access control, reviews, ratings, favorites, and watchlists.

The system is built as a **monorepo** with a **NestJS + PostgreSQL (Prisma)** backend and a **Next.js (React 19)** frontend, deployed as three independent services:

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | Next.js 16 (App Router) | **Vercel** |
| Backend API | NestJS 11 | **Railway** |
| Database | PostgreSQL | **Railway** |
| Image Storage | Cloudinary | Cloudinary CDN |

🔗 **Live App:** [https://movie-production-system.vercel.app/](https://movie-production-system.vercel.app/)

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Architecture](#-architecture)
4. [Project Structure](#-project-structure)
5. [Database Schema / Entities](#-database-schema--entities)
6. [Authentication](#-authentication)
7. [Authorization & Roles](#-authorization--roles)
8. [API Reference](#-api-reference)
9. [Frontend Pages & Routes](#-frontend-pages--routes)
10. [Image Uploads (Cloudinary)](#-image-uploads-cloudinary)
11. [Environment Variables](#-environment-variables)
12. [Local Development Setup](#-local-development-setup)
13. [Deployment](#-deployment)
14. [Error Handling & Logging](#-error-handling--logging)
15. [Testing](#-testing)
16. [API Documentation (Swagger)](#-api-documentation-swagger)

---

## 🧭 Overview

The **Movie Production System** is a role-based movie catalogue and review platform. It allows an organization to manage a database of **Movies**, **Actors**, and **Directors**, while letting general users (**Viewers**) browse the catalogue, leave **reviews/ratings**, and maintain a personal **Favorites** list and **Watchlist**.

Three types of users interact with the system, each with a different purpose:

- **Admins** manage the entire system — users, movies, actors, directors — and have full destructive control (delete permissions).
- **Editors** are content managers — they can add and update movies, actors, and directors, but cannot delete records or manage users.
- **Viewers** are the general audience — they can browse the catalogue, write reviews, rate movies, and manage their own favorites/watchlist.

---

## 🧱 Tech Stack

### Backend (`/backend`)
- **NestJS 11** — modular, TypeScript-first Node.js framework
- **Prisma ORM 6** — schema-first ORM/migrations for PostgreSQL
- **PostgreSQL** — relational database (hosted on Railway)
- **Passport.js + `passport-jwt`** — authentication strategy
- **JWT (`@nestjs/jwt`)** — stateless access tokens, stored in **HTTP-only cookies**
- **bcrypt** — password hashing
- **Cloudinary SDK** — image upload/storage for posters and profile photos
- **Multer** — multipart/form-data file upload handling
- **class-validator / class-transformer** — DTO validation and transformation
- **Swagger (`@nestjs/swagger`)** — auto-generated interactive API docs
- **Jest** — unit testing (service-level test suites exist for movies, actors, directors, reviews, users, auth)

### Frontend (`/frontend`)
- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **Axios** — HTTP client, configured with `withCredentials: true` to support cookie-based auth across the Vercel ↔ Railway origin
- **React Context (`AuthContext`)** — global authenticated-user state
- **react-hot-toast** & **SweetAlert2** — notifications/confirmation modals

### Infrastructure
- **Vercel** — frontend hosting (auto-deploys from `main`, and the CORS policy also allows any `*.vercel.app` preview URL)
- **Railway** — backend (NestJS) + PostgreSQL hosting
- **Cloudinary** — image CDN for movie posters, actor photos, and director photos

---

## 🏗 Architecture

```
┌────────────────────┐      HTTPS (cookies + JWT)     ┌───────────────────────┐
│   Next.js Frontend │ ───────────────────────────▶  │   NestJS REST API      │
│   (Vercel)         │ ◀───────────────────────────  │   (Railway)            │
└────────────────────┘        JSON responses          └───────────┬───────────┘
                                                                   │
                                                     Prisma ORM    │
                                                                   ▼
                                                       ┌───────────────────────┐
                                                       │   PostgreSQL          │
                                                       │   (Railway)           │
                                                       └───────────────────────┘
                                                                   │
                                                          Image URLs
                                                                   ▼
                                                       ┌───────────────────────┐
                                                       │   Cloudinary CDN      │
                                                       └───────────────────────┘
```

Request flow:
1. The Next.js frontend calls the NestJS API over HTTPS using Axios (`withCredentials: true`).
2. The NestJS backend authenticates the request via a **JWT stored in an HTTP-only cookie** (or a Bearer token as a fallback).
3. Global guards (`JwtAuthGuard`, `RolesGuard`) validate the token and enforce role-based permissions before the request reaches a controller.
4. Prisma executes the database query against PostgreSQL.
5. If the request includes a file upload (poster/profile image), the file is streamed to **Cloudinary**, and the returned secure URL is stored in the database.
6. A global `ResponseInterceptor` wraps all successful responses in a consistent envelope; a global `HttpExceptionFilter` normalizes error responses.

---

## 📁 Project Structure

```
Movie-Production-System/
├── backend/                      # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma         # Data model (single source of truth)
│   │   └── migrations/           # Versioned SQL migrations
│   └── src/
│       ├── auth/                 # Auth module: strategies, guards, decorators
│       │   ├── decorators/       # @Public(), @Roles(), @StandardCrudRoles()
│       │   ├── guards/           # JwtAuthGuard, RolesGuard
│       │   ├── strategies/       # JwtStrategy (passport-jwt)
│       │   └── auth.service.ts   # register/login/logout/me logic
│       ├── users/                # Admin-only user management (CRUD)
│       ├── movies/               # Movie CRUD + filtering/search
│       ├── actors/               # Actor CRUD + filtering/search
│       ├── directors/            # Director CRUD + filtering/search
│       ├── reviews/              # Reviews & ratings
│       ├── movie-interactions/   # Favorites & Watchlist
│       ├── dashboard/            # Role-specific dashboard summaries
│       ├── cloudinary/           # Cloudinary upload service
│       ├── prisma/               # PrismaService (DB client wrapper)
│       ├── common/
│       │   ├── filters/          # Global HttpExceptionFilter
│       │   ├── interceptors/     # Global ResponseInterceptor
│       │   └── middleware/       # RequestLoggerMiddleware
│       ├── app.module.ts         # Root module — wires everything together
│       └── main.ts               # Bootstrap: CORS, Swagger, global pipes/guards
│
└── frontend/                     # Next.js App Router UI
    └── src/
        ├── app/
        │   ├── admin/            # Admin dashboard + user management UI
        │   ├── editor/           # Editor dashboard UI
        │   ├── viewer/           # Viewer landing/dashboard UI
        │   ├── movies/           # Movie list, details, create/edit, reviews
        │   ├── actors/           # Actor list, create/edit
        │   ├── directors/        # Director list, create/edit
        │   ├── login/            # Login page
        │   ├── register/        # Registration page
        │   └── components/      # Shared UI components
        ├── context/
        │   └── AuthContext.tsx  # Global auth state (user, loading, logout)
        ├── services/             # Axios-based API clients (one per module)
        └── types/                 # Shared TypeScript interfaces (mirrors backend DTOs)
```

---

## 🗄 Database Schema / Entities

The schema is defined in `backend/prisma/schema.prisma` and managed through Prisma Migrate. It has **6 core models** and **2 enums**.

### Enums

```prisma
enum Role {
  ADMIN
  EDITOR
  VIEWER
}

enum InteractionType {
  FAVORITE
  WATCHLIST
}
```

### `User`
The account/identity entity. Every user has exactly one `Role`.

| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | Auto-increment |
| `username` | String | Unique |
| `email` | String | Unique |
| `password` | String | bcrypt hash, never returned to the client |
| `firstName`, `lastName` | String | Must differ from each other at registration |
| `role` | `Role` | Defaults to `VIEWER` |
| `ISActive` | Boolean | Soft "is active" flag, defaults to `true` |
| `createdAt` / `updatedAt` | DateTime | Auto-managed timestamps |

Relations: a `User` can have many `reviews`, `interactions` (favorites/watchlist), and — since content creators are tracked — many `createdMovies`, `createdActors`, and `createdDirectors`.

### `Movie`
| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | |
| `title` | String | Unique together with `releaseDate` |
| `duration` | Int | Minutes |
| `genre` | String | |
| `rating` | Float | Base/curated rating field |
| `description` | String | |
| `language` | String | |
| `posterPath` | String? | Cloudinary secure URL |
| `releaseDate` | DateTime | |
| `trailerId` | String | YouTube video ID/URL |
| `directorId` | Int (FK) | → `Director` |
| `createdById` | Int? (FK) | → `User` who created the record |
| `createdAt` / `updatedAt` | DateTime | |

Relations: belongs to one `Director`, has **many-to-many** `actors` (join relation `ActorToMovie`), has many `reviews` and `interactions`.

### `Actor`
| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | |
| `name` | String | Unique |
| `dob` | DateTime | Date of birth |
| `nationality` | String | |
| `awards` | Int | |
| `biography` | String | |
| `gender` | String | |
| `imagePath` | String? | Cloudinary secure URL |
| `createdById` | Int? (FK) | → `User` |
| `createdAt` / `updatedAt` | DateTime | |

Relations: many-to-many with `Movie`.

### `Director`
| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | |
| `name` | String | Unique |
| `dob` | DateTime | |
| `biography` | String | |
| `imagePath` | String? | Cloudinary secure URL |
| `nationality` | String | |
| `createdById` | Int? (FK) | → `User` |
| `createdAt` / `updatedAt` | DateTime | |

Relations: one-to-many with `Movie` (a director can direct multiple movies).

### `Review`
| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | |
| `rating` | Int | Numeric star rating |
| `comment` | String? | Optional text |
| `userId` | Int (FK) | → `User`, cascade delete |
| `movieId` | Int (FK) | → `Movie`, cascade delete |
| `createdAt` / `updatedAt` | DateTime | |

Constraint: `@@unique([userId, movieId])` — **one review per user per movie**.

### `MovieInteraction`
Represents a user "liking"/tracking a movie via **Favorites** or **Watchlist**.

| Field | Type | Notes |
|---|---|---|
| `id` | Int (PK) | |
| `userId` | Int (FK) | → `User`, cascade delete |
| `movieId` | Int (FK) | → `Movie`, cascade delete |
| `type` | `InteractionType` | `FAVORITE` or `WATCHLIST` |
| `createdAt` | DateTime | |

Constraint: `@@unique([userId, movieId, type])` — a user can only favorite/watchlist a given movie once (idempotent add).

### Entity-Relationship Summary

```
User ──< createdMovies, createdActors, createdDirectors (as content creator)
User ──< Review (1 review per movie per user)
User ──< MovieInteraction (favorite/watchlist)

Director ──< Movie (1 director → many movies)
Actor >──< Movie (many-to-many cast)

Movie ──< Review
Movie ──< MovieInteraction
```

---

## 🔐 Authentication

Authentication is implemented with **Passport.js** using the **JWT strategy** (`passport-jwt`), fully custom-built in the `auth` module.

### How it works

1. **Registration** (`POST /auth/register`)
   - Validates that `password === confirmPassword`.
   - Validates that `firstName` and `lastName` are not identical.
   - Checks for existing username/email (both must be unique).
   - Hashes the password with **bcrypt** before persisting (via `UsersService.create`).
   - New self-registered accounts are **always created with the `VIEWER` role** — a user cannot register themselves as `ADMIN` or `EDITOR`.
   - On success, a JWT is issued and the flow described below is triggered.

2. **Login** (`POST /auth/login`)
   - Accepts a combined `login` field (username **or** email) plus `password`.
   - Looks the user up by username or email.
   - Verifies the password with `bcrypt.compare`.
   - Issues the same JWT + cookie response as registration.

3. **Token issuance**
   - JWT payload: `{ sub: user.id, username, role }`.
   - Signed using `JwtService` (`@nestjs/jwt`) with a secret from `JWT_SECRET`.
   - The token is:
     - Set as an **HTTP-only cookie** named `access_token` (`secure: true`, `sameSite: 'none'`, 1-day expiry) — required because the frontend (Vercel) and backend (Railway) are different origins.
     - **Also returned in the JSON body** as `access_token`, so the frontend can use it as a Bearer token fallback if cookies are blocked.

4. **Token verification**
   - `JwtStrategy` extracts the token from either the `access_token` cookie **or** the `Authorization: Bearer <token>` header (cookie is tried first).
   - The decoded payload (`id`, `username`, `role`) is attached to `req.user` for use in controllers/guards.

5. **Logout** (`POST /auth/logout`)
   - Clears the `access_token` cookie server-side.

6. **Current user** (`GET /auth/me`)
   - Returns the authenticated user's profile (id, username, email, name, role) based on the JWT in the request.

7. **Availability checks** (public, no auth required)
   - `GET /auth/check-username?username=...`
   - `GET /auth/check-email?email=...`
   - Used by the registration form for real-time validation feedback.

### Public vs. Protected Routes
By default, **every route in the API requires authentication** — `JwtAuthGuard` is registered as a **global guard** in `main.ts`/`app.module.ts`. Routes are made public individually using the `@Public()` decorator (e.g., `register`, `login`, `check-username`, `check-email`).

### Frontend Auth State
- `AuthContext` (`frontend/src/context/AuthContext.tsx`) loads the current user via `GET /auth/me` on app mount and exposes `{ user, loading, refreshUser, logout }` to the whole app through React Context.
- `services/api.ts` configures a shared Axios instance with `withCredentials: true` so the `access_token` cookie is automatically sent on every request to the Railway API.

---

## 🛡 Authorization & Roles

The system implements **Role-Based Access Control (RBAC)** with three roles: **`ADMIN`**, **`EDITOR`**, **`VIEWER`**.

### Roles Guard Logic (`RolesGuard`)

Authorization is enforced through a custom `RolesGuard`, which supports **two complementary strategies**:

1. **Explicit roles** via the `@Roles(...roles)` decorator — used for endpoints with custom/non-standard rules (e.g., reviews, favorites, users, dashboards). If present, this **always takes priority**.
2. **Standard CRUD roles** via the `@StandardCrudRoles()` decorator — a convention applied at the controller level for `Movies`, `Actors`, and `Directors`, which maps HTTP methods to role requirements automatically:

   | HTTP Method | Allowed Roles |
   |---|---|
   | `GET` | Any authenticated user (`ADMIN`, `EDITOR`, `VIEWER`) |
   | `POST` / `PUT` / `PATCH` | `ADMIN`, `EDITOR` |
   | `DELETE` | `ADMIN`, `EDITOR`* |

   > *Note: while the guard code technically allows `EDITOR` on `DELETE` for standard-CRUD-tagged routes, the service layer / Swagger docs for **Movies, Actors, and Directors** explicitly restrict deletion to **`ADMIN` only** — deletions are additionally checked using the authenticated `req.user`, forming defense-in-depth (guard + service-level check).

3. If neither decorator is present, the route is accessible to any authenticated user (no extra role restriction).

### Role Capability Matrix

| Capability | ADMIN | EDITOR | VIEWER |
|---|:---:|:---:|:---:|
| Browse Movies / Actors / Directors | ✅ | ✅ | ✅ |
| Create Movies / Actors / Directors | ✅ | ✅ | ❌ |
| Update Movies / Actors / Directors | ✅ | ✅ | ❌ |
| **Delete** Movies / Actors / Directors | ✅ | ❌ | ❌ |
| Manage Users (create/update/delete/list) | ✅ | ❌ | ❌ |
| View Admin Dashboard (`/dashboard/admin`) | ✅ | ❌ | ❌ |
| View Editor Dashboard (`/dashboard/editor`) | ❌ | ✅ | ❌ |
| Write a Review on a Movie | ❌ | ❌ | ✅ |
| Delete own review | ✅ (any) | ❌ | ✅ (own) |
| Edit any review (moderation) | ✅ | ❌ | ❌ |
| View reviews for a movie / average rating | ✅ | ✅ | ✅ |
| Add/remove Favorites & Watchlist | ❌ | ❌ | ✅ |
| Register a new account | Self-service — always created as **VIEWER** | | |

### Frontend Route Protection
The frontend mirrors backend roles with dedicated dashboard routes/layouts:
- `/admin` — Admin dashboard & user management (`/admin/users`, `/admin/users/create`, `/admin/users/edit/[id]`)
- `/editor` — Editor dashboard
- `/viewer` — Viewer dashboard (favorites, watchlist, reviews)

Pages read the authenticated `user.role` from `AuthContext` to conditionally render UI (e.g., hiding "Delete" buttons for non-admins, hiding "Add Movie" for viewers) and to redirect unauthorized users away from role-restricted pages.

---

## 📡 API Reference

Base URL (production): the Railway-hosted backend URL configured in `NEXT_PUBLIC_API_URL`.
All endpoints are prefixed as shown below (no global `/api` prefix on routes — Swagger docs are mounted separately at `/api`).

### Auth — `/auth`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new account (always as VIEWER) |
| POST | `/auth/login` | Public | Login with username/email + password |
| GET | `/auth/check-username` | Public | Check username availability |
| GET | `/auth/check-email` | Public | Check email availability |
| POST | `/auth/logout` | Authenticated | Clear auth cookie |
| GET | `/auth/me` | Authenticated | Get current user profile |

### Users — `/users` (ADMIN only, all routes)
| Method | Route | Description |
|---|---|---|
| POST | `/users` | Create a user (admin can assign any role) |
| GET | `/users` | List all users (supports query filters) |
| GET | `/users/:id` | Get a single user |
| PATCH | `/users/:id` | Update a user |
| DELETE | `/users/:id` | Delete a user |

### Movies — `/movies` (Standard CRUD roles)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/movies` | ADMIN, EDITOR | Create movie (multipart form, optional `poster` image) |
| GET | `/movies` | Any authenticated | List/search/filter movies |
| GET | `/movies/genres` | Any authenticated | List distinct genres |
| GET | `/movies/:id` | Any authenticated | Get movie details (with director + cast) |
| PATCH | `/movies/:id` | ADMIN, EDITOR | Partially update a movie |
| PUT | `/movies/:id` | ADMIN, EDITOR | Fully update a movie |
| DELETE | `/movies/:id` | **ADMIN only** | Delete a movie |

### Actors — `/actors` (Standard CRUD roles)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/actors` | ADMIN, EDITOR | Create actor (multipart, optional `image`) |
| GET | `/actors` | Any authenticated | List/search/filter actors |
| GET | `/actors/:id` | Any authenticated | Get actor details |
| PATCH | `/actors/:id` | ADMIN, EDITOR | Partial update |
| PUT | `/actors/:id` | ADMIN, EDITOR | Full update |
| DELETE | `/actors/:id` | **ADMIN only** | Delete actor |

### Directors — `/directors` (Standard CRUD roles)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/directors` | ADMIN, EDITOR | Create director (multipart, optional `image`) |
| GET | `/directors` | Any authenticated | List/search/filter directors |
| GET | `/directors/:id` | Any authenticated | Get director details |
| PATCH | `/directors/:id` | ADMIN, EDITOR | Partial update |
| PUT | `/directors/:id` | ADMIN, EDITOR | Full update |
| DELETE | `/directors/:id` | **ADMIN only** | Delete director |

### Reviews — `/reviews`
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/reviews/movie/:movieId` | VIEWER | Create a review for a movie |
| PATCH | `/reviews/:id` | ADMIN | Moderate/update any review |
| DELETE | `/reviews/:id` | VIEWER, ADMIN | Delete a review (own review, or any as admin) |
| GET | `/reviews/movie/:movieId` | Any authenticated | List reviews for a movie |
| GET | `/reviews/my-reviews` | VIEWER | List the logged-in viewer's own reviews |
| GET | `/reviews/:id` | ADMIN | Get a single review by ID |
| GET | `/reviews/movie/:movieId/rating` | Any authenticated | Get the average rating for a movie |

### Movie Interactions — `/movie-interactions` (VIEWER only)
| Method | Route | Description |
|---|---|---|
| POST | `/movie-interactions/favorite/:movieId` | Add movie to favorites |
| DELETE | `/movie-interactions/favorite/:movieId` | Remove movie from favorites |
| GET | `/movie-interactions/favorites` | Get logged-in user's favorites |
| POST | `/movie-interactions/watchlist/:movieId` | Add movie to watchlist |
| DELETE | `/movie-interactions/watchlist/:movieId` | Remove movie from watchlist |
| GET | `/movie-interactions/watchlist` | Get logged-in user's watchlist |

### Dashboard — `/dashboard`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/dashboard/admin` | ADMIN | Totals (movies/actors/directors/users) + 5 most recently created movies |
| GET | `/dashboard/editor` | EDITOR | Total movie count + 5 most recently updated movies |

---

## 🖥 Frontend Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Login form |
| `/register` | Registration form (real-time username/email availability checks) |
| `/movies` | Browse/search/filter all movies |
| `/movies/[id]` | Movie details — cast, director, average rating, reviews |
| `/movies/create` | Create a new movie (ADMIN/EDITOR) |
| `/movies/edit/[id]` | Edit an existing movie (ADMIN/EDITOR) |
| `/movies/[id]/review` | Submit a review for a movie (VIEWER) |
| `/movies/[id]/review/edit/[reviewId]` | Edit an existing review |
| `/actors` | Browse all actors |
| `/actors/create` | Create a new actor (ADMIN/EDITOR) |
| `/actors/edit/[id]` | Edit an actor (ADMIN/EDITOR) |
| `/directors` | Browse all directors |
| `/directors/create` | Create a new director (ADMIN/EDITOR) |
| `/directors/edit/[id]` | Edit a director (ADMIN/EDITOR) |
| `/admin` | Admin dashboard (system-wide stats) |
| `/admin/users` | User management list (ADMIN) |
| `/admin/users/create` | Create a user with any role (ADMIN) |
| `/admin/users/edit/[id]` | Edit a user (ADMIN) |
| `/editor` | Editor dashboard (content stats) |
| `/viewer` | Viewer dashboard (favorites, watchlist, my reviews) |

Each API-consuming feature has a matching **service module** in `frontend/src/services/` (`movieService`, `actorService`, `directorService`, `reviewService`, `userService`, `authService`, `dashboardService`, `movieInteractionService`, `filterService`), all built on top of the shared Axios instance in `services/api.ts`.

---

## 🖼 Image Uploads (Cloudinary)

- Movie posters, actor photos, and director photos are uploaded as `multipart/form-data` (via Multer's `FileInterceptor`).
- Uploads are validated server-side:
  - **Max file size:** 5 MB
  - **Allowed type:** image files only (validated by `FileTypeValidator`)
- Valid files are streamed to **Cloudinary** (folder: `movie-production-system`) via `CloudinaryService.uploadImage()`.
- The returned Cloudinary secure URL is persisted as `posterPath` (Movie) or `imagePath` (Actor/Director).
- Image upload is **optional** on both create and update — records can exist without an image.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=<your-strong-jwt-secret>
PORT=3001

CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://<your-railway-backend-domain>
```

> In production, `DATABASE_URL` points to the Railway-managed PostgreSQL instance, and `NEXT_PUBLIC_API_URL` points to the Railway-hosted NestJS service. CORS on the backend explicitly allows `http://localhost:3000`, `https://movie-production-system.vercel.app`, and any `*.vercel.app` subdomain (for Vercel preview deployments), with `credentials: true` so the auth cookie is honored cross-origin.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (LTS)
- A PostgreSQL database (local or hosted)
- A Cloudinary account (for image uploads)

### 1. Clone the repository
```bash
git clone https://github.com/hamdaahmad1/Movie-Production-System.git
cd Movie-Production-System
```

### 2. Backend setup
```bash
cd backend
npm install

# Configure your .env file (see Environment Variables above)

# Run Prisma migrations against your database
npx prisma migrate deploy
npx prisma generate

# Start the API in watch mode
npm run start:dev
```
The API will be available at `http://localhost:3001`, and Swagger docs at `http://localhost:3001/api`.

### 3. Frontend setup
```bash
cd ../frontend
npm install

# Configure .env.local with NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```
The frontend will be available at `http://localhost:3000`.

### 4. Run backend tests
```bash
cd backend
npm run test        # unit tests
npm run test:cov    # with coverage
```

---

## 🚀 Deployment

| Service | Platform | Notes |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | Deploys the `frontend/` directory; set `NEXT_PUBLIC_API_URL` in Vercel's environment variables to the Railway backend URL. |
| **Backend (API)** | [Railway](https://railway.app) | Deploys the `backend/` directory; set `DATABASE_URL`, `JWT_SECRET`, and Cloudinary credentials in Railway's environment variables. Run `npx prisma migrate deploy` as part of the build/release step. |
| **Database** | [Railway PostgreSQL](https://railway.app) | Managed PostgreSQL instance; connection string injected into the backend via `DATABASE_URL`. |
| **Images** | Cloudinary | External CDN; no deployment needed, just valid API credentials. |

**Live production URL:** [https://movie-production-system.vercel.app/](https://movie-production-system.vercel.app/)

---

## 🧯 Error Handling & Logging

- **`HttpExceptionFilter`** (global) — normalizes all thrown exceptions into a consistent JSON error shape.
- **`ResponseInterceptor`** (global) — wraps all successful responses in a consistent envelope.
- **`RequestLoggerMiddleware`** — applied to all routes (`forRoutes('*')`), logs incoming requests.
- Service-level `Logger` instances (e.g., in `AuthService`) log key lifecycle events: successful registration, login attempts, failed logins, logout, and profile retrieval — useful for debugging in Railway's log viewer.

---

## 🧪 Testing

The backend includes Jest **unit test suites** (`*.service.spec.ts`) for:
- `AuthService`
- `UsersService`
- `MoviesService`
- `ActorsService`
- `DirectorsService`
- `ReviewsService`

Run them with:
```bash
cd backend
npm run test
```

---

## 📘 API Documentation (Swagger)

The backend auto-generates interactive API documentation using `@nestjs/swagger`, mounted at:

```
<backend-url>/api
```

It includes:
- Full endpoint list grouped by tag (Auth, Movies, Actors, Directors, Reviews, Movie Interactions, Users, Dashboard)
- Request/response schemas and example payloads
- Bearer-token authorization support (`JWT-auth`) for testing protected routes directly from the Swagger UI

---

## 👤 Author

**Hamda Ahmad**
Repository: [github.com/hamdaahmad1/Movie-Production-System](https://github.com/hamdaahmad1/Movie-Production-System)
