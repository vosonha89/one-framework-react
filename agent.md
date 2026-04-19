# Agent Guide for one-framework-react

This document provides strict guidelines and best practices for agents and developers working with this project.

---

## 1. Project Architecture Overview

- **Framework**: React 19 + TypeScript + Vite
- **Design**: Strict OOP, Dependency Injection (tsyringe), modular structure
- **Patterns**: Component-Hook-State-Model, Service layer, Common utilities

---

## 2. Strict Rules & Best Practices

- **TypeScript**: Use strict mode. No `any` types except for framework integration.
- **Access Modifiers**: All class members must use `public`, `private`, or `protected`. Use `readonly` where appropriate.
- **OOP Principles**: Use inheritance, abstraction, and encapsulation. All business logic should be in classes.
- **Comments**: Every class, method, and complex logic must have clear JSDoc comments.
- **Structure**: Follow the folder structure strictly:
  - `src/views/`: Pages (View, Hook, State, Model, SCSS)
  - `src/common/`: Shared components, hooks, services, types, constants
  - `src/services/`: Business logic, API integration
  - `src/assets/`: Static assets (e.g., language files)
  - `src/types/`: Shared types

---

## 3. How to Create Components

- **Location**: `src/views/YourView/`
- **Files**:
  - `YourView.tsx`: UI component
  - `YourView.hook.tsx`: Business logic (React hooks)
  - `YourView.state.ts`: State class (extends `ComponentState`)
  - `YourView.model.ts`: Model class (extends `BaseModel`)
  - `YourView.scss`: Styles
- **Pattern**: Use hooks for logic, state for data, model for validation.
- **Example**:
  ```typescript
  // YourView.state.ts
  export class YourViewState extends ComponentState {
    public model = new YourViewModel();
    public modelPropName = 'model';
    public async init(): Promise<void> { /* ... */ }
  }
  ```

---

## 4. How to Create Services

- **Location**: `src/services/`
- **Pattern**: Extend `BaseService`, use DI via `@injectable()`
- **API URLs**: Define in `apiUrl` object
- **Error Handling**: Use `AppError` and `SystemError`
- **Request/Response**: Use dedicated request/response objects
- **Example**:
  ```typescript
  @injectable()
  export class ExampleService extends BaseService {
    public apiUrl = { example: '/api/example' };
    public async getData(): Promise<DataType> { /* ... */ }
  }
  ```

---

## 5. How to Create Common Utilities

- **Components**: Place in `src/common/components/`
- **Hooks**: Place in `src/common/hooks/`
- **Services**: Place in `src/common/services/`
- **Types/Constants**: Place in `src/common/types/` and `src/common/constants/`
- **Example**:
  ```typescript
  // src/common/hooks/useExample.ts
  function useExample() { /* ... */ }
  export default useExample;
  ```

---

## 6. Understanding the Project

- **Component-State-Model-Hook**: Each view is split into UI, logic, state, and model for maintainability.
- **Service Layer**: All API and business logic is in services, injected via DI.
- **Validation**: Models handle validation and error reporting.
- **Strict Typing**: All code must use explicit types and interfaces.

---

## 7. Rules Summary

- Use TypeScript everywhere, no implicit `any`.
- All classes and members must have access modifiers.
- All business logic must be in classes, not in components.
- Comment all classes, methods, and complex logic.
- Follow folder and file naming conventions.
- Use OOP and DI patterns strictly.

---

## 8. Development Workflow

**For every task:**

1. **Format**: Use Prettier or your formatter.
2. **Lint**: Run `npm run lint` (must pass with no errors).
3. **Test**: (Add tests if available; recommended to use Jest or Vitest).
4. **Build**: Run `npm run build:prod` (must succeed).

**Example:**
```bash
npm run lint
npm run build:prod
```

---

## 9. Code Example Templates

### Component State Example
```typescript
export class ExampleState extends ComponentState {
  public model = new ExampleModel();
  public modelPropName = 'model';
  public async init(): Promise<void> { /* ... */ }
}
```

### Service Example
```typescript
@injectable()
export class ExampleService extends BaseService {
  public apiUrl = { example: '/api/example' };
  public async getData(): Promise<DataType> { /* ... */ }
}
```

### Model Example
```typescript
export class ExampleModel extends BaseModel {
  public field: string = '';
  public isValid(): boolean { /* ... */ }
}
```

---

## 10. Task Checklist for Agents

- [ ] Follow strict structure and naming conventions
- [ ] Use TypeScript and OOP principles
- [ ] Add access modifiers and comments
- [ ] Format, lint, test, and build before submitting changes