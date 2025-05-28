# ADR 001: Refactor to Feature-Based Architecture

The current project uses a mostly flat file structure, where components, hooks, and types are placed in shared directories such as `/components`, `/hooks`, and `/types`. Additionally, there's an architectural inconsistency: for example, the `/components/tracks` directory includes code related to the `tracks` feature, which is shared with the audio player - violating clear feature boundaries.

Key issues with the current setup:

- **Low cohesion**: Logic and UI for a single feature are spread across unrelated folders.
- **High coupling**: Components may unintentionally depend on unrelated global modules.
- **Difficult navigation**: Finding and updating related code requires jumping between directories.
- **Poor scalability**: Adding new features increases the complexity and risk of regressions due to tightly coupled code.

This structure hinders maintainability, slows development, and makes onboarding new developers harder.

## **Decision**

**We will refactor the project to a feature-based modular architecture**, where each feature or domain encapsulates its related logic, UI components, and hooks. This approach draws inspiration from [Bulletproof React](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md).

Key changes:

- Move all domain-specific logic into `features/<feature-name>/`.
- Colocate related hooks, types, schemas, and UI components within their respective feature folders.
- Keep truly reusable UI elements in a central `components/` directory.

## **Rationale**

Adopting a feature-based architecture increases **cohesion** by grouping related files together, and reduces **coupling** by isolating features. This results in:

- Easier **onboarding** for new contributors.
- Safer and faster **refactoring**, due to reduced side effects.
- Improved **testability** and maintainability.
- Better **scalability**, enabling parallel development by multiple teams or developers.

### Alternatives Considered

- **Keep the current flat structure**: Would continue to degrade maintainability and increase technical debt over time.

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
