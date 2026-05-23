# Tibr — Gold & Silver Investment Platform
ITI Final Graduation Project — Angular Frontend Application.

## Overview
Millions of middle-income people want to protect their savings from inflation using gold and silver, but the process is complex, opaque, and requires expertise they don't have. Existing options — jewelers, banks, or physical bullion — lack transparent pricing, real-time insights, or accessibility for small investors. There is no unified digital platform that combines investment analytics and guidance in one place.

**Tibr** solves this by providing a comprehensive digital platform that lets anyone invest in gold and silver starting from small amounts, with AI guiding the optimal moments to buy or sell.

## Project Structure
- **core:** Application-wide singleton logic and configuration
  - **environments:** Environment variables for development and production API URLs
  - **guards:** Route protection
    - Auth guard — blocks unauthenticated users from protected pages
    - Logged guard — redirects already logged-in users away from auth pages
  - **interceptors:** Global HTTP handling
    - Headers interceptor — attaches JWT token to every outgoing request
    - Errors interceptor — catches API errors and displays toast notifications
    - Loading interceptor — triggers spinner during HTTP calls
  - **interfaces:** TypeScript interfaces for all API response models
  - **services:** API communication and business logic layer

- **layouts:** Shared layout wrapper components
  - **Auth layout** — wraps login and register pages
  - **Main layout** — wraps all authenticated pages with navbar and footer
  - **Navbar** — top navigation bar with links, cart count badge, and user menu

- **pages:** All application views organized by access level
  - **auth:** Public authentication pages (login, register, forgot password)
  - **guest:** Pages accessible without login (home, products, product details)
  - **protected:** Pages that require authentication (cart, wishlist, orders, profile, checkout)

- **shared:** Reusable elements shared across the entire app
  - **components:** Shared UI components split into two layers
    - **business:** Feature-aware components tied to app logic (product card, cart item, order card)
    - **ui:** Pure presentational components with no business logic (button, input, spinner, modal)
  - **directives:** Custom Angular directives for DOM behavior
  - **pipes:** Custom Angular pipes for data transformation in templates
