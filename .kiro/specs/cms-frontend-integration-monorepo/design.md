# Design Document: CMS-Frontend Integration Monorepo

## Overview

This design outlines the migration from a 3-application architecture (backend, frontend, CMS) to a 2-service monorepo architecture (backend + unified frontend). The unified frontend will serve both public routes and admin routes (/admin/\*) in a single Next.js application, with shared packages for types, utilities, and components.

## Architecture

### Monorepo Structure

```
root/
├── packages/
│   ├── backend/              # NestJS API (existing, moved)
│   ├── frontend/             # Unified Next.js app (merged frontend + CMS)
│   ├── shared-types/         # Shared
```
