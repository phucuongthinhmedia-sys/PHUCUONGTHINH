# @repo/shared-utils

Shared utility functions and API client for the Digital Showroom monorepo.

## Purpose

This package contains common utility functions, the configured API client, and shared constants used across frontend and CMS applications.

## Contents

- API client (configured axios instance)
- Formatters (currency, date, number)
- Validators (email, phone, URL)
- Helper functions
- Constants and configuration

## Usage

```typescript
import { apiClient, formatCurrency } from "@repo/shared-utils";
```

## Development

```bash
# Build utilities
pnpm build

# Watch mode
pnpm dev
```
