# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Cognito App

A proof of concept React application to learn authentication with AWS Cognito, featuring task management and role-based access control (RBAC).

## Features

- **Authentication**: Secure login using AWS Cognito
- **Task Management**: Create, edit, and manage tasks
- **Role-Based Access Control**: Different UI and functionality for admin and user roles
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, and ShadCN UI components

## Role-Based Functionality

This application implements role-based access control using Cognito groups. The UI adapts based on the user's assigned groups:

### Admin Role (`admin` group)
- **Full access** to all tasks in the system
- Can **create, edit, and delete** any task
- Access to **admin-specific features**:
  - System analytics and statistics
  - User management controls
  - Admin settings panel
  - All task management operations

### User Role (`user` group)
- **Limited access** to assigned tasks only
- Can **view and update status** of their tasks
- **Cannot create, edit, or delete** tasks
- **Restricted UI** showing only relevant functionality

## Testing Role-Based Features

### Setting up Cognito Groups

1. **Create Groups in AWS Cognito Console**:
   - Go to your Cognito User Pool
   - Navigate to "Groups" section
   - Create two groups: `admin` and `user`

2. **Assign Users to Groups**:
   - Go to "Users" section
   - Select a user
   - Click "Add to group"
   - Choose either `admin` or `user` group

### Testing Different Roles

1. **Test as Admin**:
   - Login with a user assigned to the `admin` group
   - You should see:
     - Red admin badge in the navbar
     - "Admin Dashboard" title
     - Full task management capabilities
     - Admin-specific navigation buttons

2. **Test as User**:
   - Login with a user assigned to the `user` group
   - You should see:
     - Blue user badge in the navbar
     - "User Dashboard" title
     - Limited task view (subset of tasks)
     - No create/edit/delete buttons
     - Info card explaining permissions

### JWT Token Groups

The application extracts user groups from the Cognito JWT ID token. The groups are available in the `cognito:groups` claim:

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "cognito:groups": ["admin"]  // or ["user"] or ["admin", "user"]
}
```

## Development

### Prerequisites

- Node.js 18+
- AWS Cognito User Pool configured
- Environment variables set up

### Environment Variables

Create a `.env` file with your Cognito configuration:

```env
VITE_AUTHORITY=https://your-cognito-domain.auth.region.amazoncognito.com
VITE_CLIENT_ID=your-app-client-id
VITE_REDIRECT_URI=http://localhost:5173
```

### Running the Application

```bash
npm install
npm run dev
```

### Building for Production

```bash
npm run build
```

## Technical Implementation

### Role Detection

The application uses a custom hook `useUserRole()` that:
1. Decodes the JWT ID token from Cognito
2. Extracts the `cognito:groups` claim
3. Provides utility functions for role checking

### UI Adaptation

Components conditionally render based on user role:
- **Navbar**: Shows role badge and groups
- **Dashboard**: Different content for admin vs user
- **Tasks Page**: Role-based permissions and filtering
- **Task Cards**: Conditional edit/delete buttons

### Security Notes

- Client-side role checking is for UI purposes only
- Always implement server-side authorization for API endpoints
- JWT tokens should be validated server-side in production

## Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom hooks including useUserRole
├── lib/                # Utility functions including auth-utils
├── pages/              # Page components with role-based logic
├── types/              # TypeScript type definitions
└── router.tsx          # Application routing
```

## Contributing

This is a learning project for AWS Cognito integration. Feel free to experiment and extend the functionality!
