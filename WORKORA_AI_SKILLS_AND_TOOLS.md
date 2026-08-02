# Workora AI Skills and Tools Index

This file is the working guide for AI models operating on the Workora platform.

It tells the model:
- where the skill library lives
- which skills are installed for this project
- which tools are available from the Antigravity skills repository
- what each skill should be used for

If you are an AI reading this file, use the installed skills before making assumptions.

## 1. Source Library

- Antigravity skills repository: `C:\Users\lewis\Desktop\antigravity-skills-repo`
- Codex skills directory: `C:\Users\lewis\.codex\skills`

The skills in this file were selected from the Antigravity library and copied into the Codex skills directory for this Workora workspace.

## 2. What Workora Needs Skills For

Workora is a full platform with:
- a Next.js web app
- a Fastify/Postgres backend
- a Flutter mobile app
- uploads and media
- trust and reputation logic
- search and discovery
- messaging
- AI assistance
- analytics and operations

The skill set below is curated for those needs.

## 3. Installed Skills

### Planning and product
- `concise-planning`
- `product-manager-toolkit`
- `competitive-landscape`

### UI, frontend, and mobile
- `frontend-design`
- `mobile-developer`
- `flutter-expert`
- `architecture-patterns`
- `web-performance-optimization`
- `performance-engineer`

### Backend, API, and database
- `backend-dev-guidelines`
- `nodejs-best-practices`
- `api-design-principles`
- `database-design`
- `postgres-best-practices`

### Security and auth
- `auth-implementation-patterns`
- `backend-security-coder`
- `frontend-security-coder`
- `security-auditor`

### Testing and debugging
- `test-driven-development`
- `browser-automation`
- `e2e-testing-patterns`
- `lint-and-validate`
- `systematic-debugging`

### AI and assistant features
- `llm-app-patterns`
- `prompt-engineering`
- `rag-implementation`

### Ops, deployment, and observability
- `analytics-tracking`
- `deployment-procedures`
- `docker-expert`
- `observability-engineer`

### Existing local Codex skills already present
- `.system`
- `emil-design-eng`
- `impeccable`
- `taste-skill`

## 4. When To Use Each Skill

### Product and planning
- Use `concise-planning` to turn an idea into an implementation checklist.
- Use `product-manager-toolkit` to define priorities, milestones, and acceptance criteria.
- Use `competitive-landscape` to compare Workora against Angi, Instagram-style apps, and local service marketplaces.

### Web and mobile UI
- Use `frontend-design` for visual direction, layout, interaction, and polish.
- Use `mobile-developer` when building mobile-first app flows.
- Use `flutter-expert` for Flutter architecture, widgets, navigation, state, and platform concerns.
- Use `architecture-patterns` when deciding how app layers should be organized.
- Use `web-performance-optimization` and `performance-engineer` when the web app feels slow or heavy.

### Backend and API work
- Use `backend-dev-guidelines` for Node.js backend structure and code quality.
- Use `nodejs-best-practices` for modern server-side patterns.
- Use `api-design-principles` for route shape, naming, payload design, and consistency.
- Use `database-design` when adding or changing schema.
- Use `postgres-best-practices` when tuning queries, indexes, or data access patterns.

### Security and auth
- Use `auth-implementation-patterns` for JWT, session, and identity design.
- Use `backend-security-coder` when writing protected backend routes.
- Use `frontend-security-coder` when handling client-side security concerns.
- Use `security-auditor` when reviewing auth, uploads, permissions, or exposure risks.

### Testing and debugging
- Use `test-driven-development` before implementing complex behavior.
- Use `browser-automation` for browser-based validation.
- Use `e2e-testing-patterns` for end-to-end coverage.
- Use `lint-and-validate` to clean up quality issues.
- Use `systematic-debugging` when investigating broken flows or runtime failures.

### AI features
- Use `llm-app-patterns` for production AI UX and architecture.
- Use `prompt-engineering` for better model instructions and AI behavior.
- Use `rag-implementation` if Workora AI needs retrieval over platform data.

### Operations and growth
- Use `analytics-tracking` for product analytics and event design.
- Use `deployment-procedures` for safe rollout steps.
- Use `docker-expert` for containerization and local environment work.
- Use `observability-engineer` for logs, metrics, tracing, and alerting.

## 5. Workora Build Order With Skills

Use the skills in this order for the main build path:

1. `concise-planning`
2. `product-manager-toolkit`
3. `architecture-patterns`
4. `auth-implementation-patterns`
5. `backend-dev-guidelines`
6. `database-design`
7. `postgres-best-practices`
8. `frontend-design`
9. `mobile-developer`
10. `flutter-expert`
11. `test-driven-development`
12. `browser-automation`
13. `security-auditor`
14. `llm-app-patterns`
15. `analytics-tracking`
16. `observability-engineer`

## 6. Antigravity Tools Available From The Repo

The tools live under:
- `C:\Users\lewis\Desktop\antigravity-skills-repo\tools`

Use them when a task benefits from specialized tooling.

### Tools most relevant to Workora

- `Agent Browser`
  - Use for browser-based UI testing, screenshots, and interaction validation.
  - Best for checking the web app, responsive states, and UI regressions.

- `Hyperframes`
  - Use for generating videos.
  - Useful for pitch videos, product walkthroughs, and social content.

- `Claude Video`
  - Use for trimming or editing video assets.
  - Useful for demo reels and marketing assets.

- `Open Design`
  - Use for design patterns and visual references.
  - Useful for keeping the platform visually intentional.

### Tool usage rule
- Skills guide the reasoning.
- Tools help verify, render, automate, or generate assets.
- Do not treat tools as a replacement for backend, frontend, or mobile implementation.

## 7. How AI Should Use This File

When working on Workora, the AI should:
- read this file first
- select the smallest skill set that fits the current task
- prefer the installed skills before inventing new process steps
- use the repo tools when testing or creating media
- keep web, backend, and mobile aligned
- avoid demo-only behavior

## 8. Platform-Specific Skill Mapping

### If the task is web UI
Use:
- `frontend-design`
- `web-performance-optimization`
- `performance-engineer`
- `test-driven-development`
- `browser-automation`

### If the task is mobile app UI
Use:
- `mobile-developer`
- `flutter-expert`
- `frontend-design`
- `architecture-patterns`

### If the task is backend API or data
Use:
- `backend-dev-guidelines`
- `nodejs-best-practices`
- `api-design-principles`
- `database-design`
- `postgres-best-practices`

### If the task is auth, trust, or permissions
Use:
- `auth-implementation-patterns`
- `backend-security-coder`
- `security-auditor`

### If the task is AI assistant features
Use:
- `llm-app-patterns`
- `prompt-engineering`
- `rag-implementation`

### If the task is product planning or pitch work
Use:
- `concise-planning`
- `product-manager-toolkit`
- `competitive-landscape`

## 9. Current Workora Reality

These are the main facts the AI should remember:

- The web app is already buildable.
- The Flutter app is currently a scaffold and still needs the real Workora shell.
- The backend still needs hardening around auth, migrations, and query performance.
- Workora is being positioned as Instagram-style business discovery with Angi-style trust and AI assistance.

## 10. Final Reminder

This file exists so future AI models know:
- the skill library is installed
- where it came from
- which skills to use for which tasks
- which repository tools are available for verification and content generation

If you change the platform direction, update this file too.

