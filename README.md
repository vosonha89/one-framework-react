# React + TypeScript + Vite
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react?ref=badge_shield)

## Project Overview

This project is a React 19 + TypeScript application bootstrapped with Vite. It uses dependency injection (tsyringe), protected routes, and multi-language support.

## Getting Started

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/vosonha89/one-framework-react.git
cd one-framework-react
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables

Copy the example file and update values as needed:

\`\`\`bash
cp .env.example .env
\`\`\`

### 4. Run the development server

\`\`\`bash
npm run dev
\`\`\`

### 5. Build for production

\`\`\`bash
npm run build:prod
\`\`\`

## Environment Variables

See [.env.example](./.env.example) for all required variables:

- \`VITE_APP_API_URL\`: API base URL
- \`VITE_APP_VERSION\`: Application version
- \`VITE_APP_TITLE\`: Application name
- \`VITE_APP_ENV\`: Environment (development/production/uat)
- \`VITE_IMAGENOSSL\`: Non-SSL image domain
- \`VITE_IMAGESSL\`: SSL image domain

## Architecture

- **src/**: Main source code
  - **common/**: Shared hooks, services, constants, components
  - **views/**: Page components (Home, Login)
  - **services/**: Business logic (e.g., AuthService)
  - **assets/language/**: i18n files
- **ProtectedRoute**: Handles authentication for protected routes
- **DI**: Uses tsyringe for dependency injection

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fvosonha89%2Fone-framework-react?ref=badge_large)