# 🚀 First Group Services (FGS) - Admin Dashboard

A comprehensive, role-based admin dashboard built with Next.js 15, TypeScript, and Tailwind CSS. This application provides a complete solution for managing users, inventory, leads, investments, and shipments across different user roles.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [User Roles & Permissions](#-user-roles--permissions)
- [API Integration](#-api-integration)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role Authentication**: Support for 5 different user roles
- **JWT Token Management**: Secure token-based authentication
- **Role-based Route Protection**: Middleware-based access control
- **Password Reset**: Email-based password recovery system

### 👥 User Management
- **User Registration & Login**: Complete user lifecycle management
- **Role-based Dashboards**: Tailored interfaces for each user type
- **Profile Management**: User profile editing and avatar upload
- **Account Status Management**: Active/Inactive user states

### 📊 Dashboard Features
- **Real-time Analytics**: Charts and metrics for business insights
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching capability
- **Interactive Tables**: Sortable, searchable, and paginated data tables

### 🏢 Role-Specific Features

#### **Super Admin & Admin**
- User management and role assignment
- Inventory management and tracking
- Lead management and assignment
- System-wide notifications
- Analytics and reporting

#### **Investor**
- Investment opportunities browsing
- Portfolio management
- Profit tracking and analytics
- Investment history

#### **Salesperson**
- Lead management and tracking
- Customer relationship management
- Sales analytics and reporting
- Commission tracking

#### **Broker**
- Shipment opportunities management
- Quote submission and tracking
- Broker-specific analytics
- Shipment status monitoring

#### **Employee**
- Task management and tracking
- Inventory task assignments
- Performance metrics
- Work progress monitoring

## 🛠 Tech Stack

### **Frontend Framework**
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development

### **Styling & UI**
- **Tailwind CSS 4.0**: Utility-first CSS framework
- **Custom Design System**: Consistent component library
- **Responsive Design**: Mobile-first approach
- **Dark Mode Support**: Theme switching capability

### **State Management**
- **Redux Toolkit**: Predictable state management
- **RTK Query**: Powerful data fetching and caching
- **Redux Persist**: State persistence across sessions

### **Form Management**
- **Formik**: Form state management
- **Yup**: Schema validation
- **React Hook Form**: Alternative form handling

### **UI Components**
- **Custom Component Library**: Reusable UI components
- **Material-UI Icons**: Icon library
- **React Icons**: Additional icon support
- **ApexCharts**: Interactive charts and graphs

### **Additional Libraries**
- **Date-fns**: Date manipulation utilities
- **React Toastify**: Toast notifications
- **Next.js Top Loader**: Progress indicators
- **React Dropzone**: File upload handling
- **FullCalendar**: Calendar component
- **Leaflet**: Interactive maps

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** (for version control)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fgs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://binarybrix.com/first_group_services/public/api/

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# Database (if applicable)
DATABASE_URL=your-database-url

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Upload
NEXT_PUBLIC_UPLOAD_URL=your-upload-service-url
```

## 📁 Project Structure

```
fgs/
├── public/                 # Static assets
│   ├── images/            # Image assets
│   │   ├── brand/         # Brand logos
│   │   ├── user/          # User avatars
│   │   └── icons/         # Icon assets
│   └── favicon.ico        # Site favicon
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (admin)/       # Admin route group
│   │   │   └── dashboard/ # Admin dashboard pages
│   │   ├── (broker)/      # Broker route group
│   │   ├── (employee)/    # Employee route group
│   │   ├── (investor)/    # Investor route group
│   │   ├── (salesperson)/ # Salesperson route group
│   │   ├── (full-width-pages)/ # Full-width layouts
│   │   │   └── (auth)/    # Authentication pages
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable components
│   │   ├── ui/            # Base UI components
│   │   │   ├── button/    # Button components
│   │   │   ├── table/     # Table components
│   │   │   ├── modal/     # Modal components
│   │   │   └── form/      # Form components
│   │   ├── auth/          # Authentication components
│   │   ├── charts/        # Chart components
│   │   ├── tables/        # Table components
│   │   └── layout/        # Layout components
│   ├── store/             # Redux store
│   │   ├── services/      # API services
│   │   │   ├── api.ts     # RTK Query API
│   │   │   └── userSlice.ts # User state management
│   │   └── index.ts       # Store configuration
│   ├── hooks/             # Custom React hooks
│   ├── context/           # React context providers
│   ├── lib/               # Utility functions
│   ├── icons/             # SVG icons
│   └── middleware.ts      # Next.js middleware
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.ts         # Next.js configuration
└── README.md              # Project documentation
```

## 👥 User Roles & Permissions

### **Super Admin**
- Full system access
- User management (create, edit, delete)
- Role assignment
- System configuration

### **Admin**
- User management (view, edit)
- Inventory management
- Lead management
- Analytics access

### **Investor**
- View investment opportunities
- Manage personal investments
- Access investment analytics
- Portfolio tracking

### **Salesperson**
- Lead management
- Customer relationship management
- Sales analytics
- Commission tracking

### **Broker**
- Shipment opportunities
- Quote management
- Broker analytics
- Shipment tracking

### **Employee**
- Task management
- Inventory tasks
- Performance tracking
- Work progress

## 🔌 API Integration

The application uses RTK Query for API integration with the following endpoints:

### **Authentication**
- `POST /user/login` - User login
- `POST /user/register` - User registration
- `POST /user/logout` - User logout
- `POST /forgot-password` - Password reset request
- `POST /reset-password` - Password reset

### **User Management**
- `GET /users` - Get all users (paginated)
- `GET /user/{id}` - Get single user
- `DELETE /user/{id}` - Delete user

### **Inventory Management**
- `GET /get/inventories` - Get all inventories
- `POST /inventory` - Create inventory
- `PUT /inventory/{id}` - Update inventory
- `DELETE /inventory/{id}` - Delete inventory

### **Lead Management**
- `GET /leads` - Get all leads
- `POST /leads` - Create lead
- `PUT /leads/{id}` - Update lead
- `DELETE /leads/{id}` - Delete lead

## 🛠 Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### **Code Style Guidelines**

- **TypeScript**: Use strict mode with proper type definitions
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **State Management**: Redux Toolkit for global state
- **Forms**: Formik with Yup validation
- **Error Handling**: Try-catch blocks with proper error boundaries

### **Component Development**

```typescript
// Example component structure
import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function Component({ className, children }: ComponentProps) {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  );
}
```

### **API Integration Pattern**

```typescript
// Example RTK Query usage
import { useGetUsersQuery, useCreateUserMutation } from '@/store/services/api';

export function UserList() {
  const { data, isLoading, error } = useGetUsersQuery({ page: 1, perPage: 10 });
  const [createUser] = useCreateUserMutation();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      {data?.users?.data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## 🏗 Building for Production

### **Build Process**

1. **Install dependencies**
   ```bash
   npm ci
   ```

2. **Build the application**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   npm start
   ```

### **Environment Variables for Production**

Ensure all required environment variables are set in your production environment:

```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api/
```

### **Performance Optimization**

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Use `@next/bundle-analyzer` for bundle analysis
- **Caching**: Implement proper caching strategies

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run type-check
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### **Commit Message Convention**

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build process or auxiliary tool changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the repository
- **Email**: Contact the development team

## 🔄 Version History

- **v2.0.1** - Current version with Next.js 15 and enhanced features
- **v2.0.0** - Major refactor with App Router and TypeScript
- **v1.0.0** - Initial release

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**