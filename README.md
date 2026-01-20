# Stray Tales 🐾

Stray Tales is a production-ready web application developed to record, organize, and communicate animal stories, emergency cases, and fundraising in an efficient and transparent manner, and is actively being developed and improved as a real-world system rather than a prototype.

The project is deliberately designed to mirror professional engineering practices, with a well-defined separation of concerns, scalability in mind, and a clear division between presentation, business logic, and external services.

✨ Why all this? Because I love coding, and I love animals — and I believe good software should be used for something meaningful! 


🌐 **Live website**: [https://www.animalvoices.gr/](https://www.animalvoices.gr/)

## Overview

The platform supports public story browsing and role-based content management. Authorized users can create, update, and manage stories, upload and organize images, and associate donation links, while visitors interact with a fast, responsive, and accessible interface. The application covers the full lifecycle of a modern web product, from authentication and authorization to media handling and deployment.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend Services**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Run with Docker 🐋

**Prerequisites:** Docker Desktop installed  
**Setup:** Create a `.env.local` file with the required environment variables  
**Build & run:** `docker compose up --build`  
**Access:** http://localhost:3000  
**Stop:** `docker compose down`


## Project Structure

```text
src/
├── app/                 # App Router: pages, layouts, and flows
│   ├── actions/         # Server Actions (secure mutations & logic)
│   ├── admin/           # Protected admin space
│   │   └── stories/     # Create & edit story workflows
│   ├── stories/         # Public story experience
│   │   └── [id]/        # Dynamic story pages
│   ├── login/           # Authentication entry
│   ├── layout.tsx       # Global layout
│   └── page.tsx         # Landing page
├── lib/                 # Shared logic & service boundaries
│   └── supabase/        # Supabase client setup
supabase/
├── migrations/          # Database evolution, versioned & explicit
schema.sql               # Database reference schema
```

The structure separates public and admin domains, handles sensitive logic on the server, and manages database changes through migrations.

## Architecture

The application uses a domain-oriented architecture based on Next.js App Router, where routing and UI are organized around real product features. Public and admin areas are clearly separated, sensitive operations run on the server through Server Actions, and the database is managed through explicit migrations, resulting in a clean and maintainable structure.

## Database Overview

Below is the complete database schema used by the application, showing all core tables and their relationships.

![Database schema](docs/database.png)


