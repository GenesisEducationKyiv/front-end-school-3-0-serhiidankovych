# ADR 001: Refactor to Feature-Based Architecture

The current project uses a mostly flat file structure, where components, hooks, and types are placed in shared directories such as `/components`, `/hooks`, and `/types`. Additionally, there's an architectural inconsistency: for example, the `/components/tracks` directory includes code related to the `tracks` feature, which is shared with the audio player - violating clear feature boundaries.

Key issues with the current setup:

- **Low cohesion**: Logic and UI for a single feature are spread across unrelated folders.
- **High coupling**: Components may unintentionally depend on unrelated global modules.
- **Difficult navigation**: Finding and updating related code requires jumping between directories.
- **Poor scalability**: Adding new features increases the complexity and risk of regressions due to tightly coupled code.

This structure hinders maintainability, slows development, and makes onboarding new developers harder.

## **Decision**

We will refactor the project to adopt a feature-based modular architecture, inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md) and aligned with [Next.js App Router](https://nextjs.org/docs/app/getting-started/project-structure) conventions.

Key changes:

- **Feature Encapsulation**: Organize domain-specific logic, UI components, hooks, and types within `features/<feature-name>/` directories.
- **Colocation**: Place related files (e.g., hooks, types, schemas) within their respective feature folders to enhance cohesion.
- **Routing Alignment**: Utilize Next.js App Router by placing route components under `app/<route>/page.tsx`. These components will serve as entry points, delegating business logic and UI rendering to the corresponding feature modules.
- **Shared Components**: Maintain truly reusable UI elements in a centralized `components/` directory.

## **Rationale**

Adopting a feature-based architecture increases **cohesion** by grouping related files together, and reduces **coupling** by isolating features. This results in:

- Easier **onboarding** for new contributors.
- Safer and faster **refactoring**, due to reduced side effects.
- Improved **testability** and maintainability.
- Better **scalability**, enabling parallel development by multiple teams or developers.

### Alternatives Considered

| Architecture                    | What We Take From It                                                 | Why We Rejected It                                                                     |
| ------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Domain-Driven Design (DDD)**  | Clear boundaries between features, consistent naming within features | Too complex for our team size, requires extensive domain modeling knowledge            |
| **Layered Architecture**        | Separation of UI and business logic, organized data access           | Forces spreading single features across multiple folders, hard to follow feature flows |
| **Clean Architecture**          | Business logic independent from UI, clear interfaces                 | Over-engineered for React apps, simple changes require touching many files             |
| **Keep Current Flat Structure** | Simple to start with                                                 | Gets messy as project grows, hard to find related files, high risk of bugs             |

## **Status**

**[Proposed]**

## **Consequences**

**Positive:**

- Improves maintainability through better organization.
- Makes the codebase easier to understand and navigate.
- Reduces the risk of cross-feature bugs.
- Encourages modular development practices.

**Negative:**

- Requires substantial initial refactoring effort.
- Needs ongoing discipline and consistency to enforce feature boundaries.
