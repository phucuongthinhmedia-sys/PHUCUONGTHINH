# @repo/shared-types

Shared TypeScript type definitions for the monorepo.

## Overview

This package provides type-safe definitions for all domain models, DTOs, and API responses used across the backend and frontend applications.

## Structure

```
src/
├── domain/          # Domain model types (Product, Category, Tag, Media, Lead)
├── dto/             # Data Transfer Objects for API requests
├── api/             # API response types
└── index.ts         # Main export file
```

## Usage

Install the package in your workspace:

```bash
npm install @repo/shared-types
```

Import types in your code:

```typescript
import { Product, CreateProductDto, AuthResponse } from "@repo/shared-types";
```

## Building

```bash
npm run build
```

This generates TypeScript declaration files in the `dist/` directory.

## Features

- **Type Safety**: Ensures consistency between backend and frontend
- **No Runtime Code**: Only TypeScript declarations (no JavaScript runtime)
- **Comprehensive Coverage**: All domain models, DTOs, and API responses
- **Backward Compatible**: Includes legacy fields for smooth migration
