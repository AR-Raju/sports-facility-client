# 🏟️ Sports Facility Booking Platform

A comprehensive full-stack web application for booking sports facilities, built with **Next.js 15**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. This platform provides separate dashboards for users and administrators with complete facility management, booking system, and payment integration.

![Sports Facility Booking Platform](https://via.placeholder.com/1200x600/3B82F6/FFFFFF?text=Sports+Facility+Booking+Platform)

## 🌟 Features Overview

### 🔐 **Authentication & Authorization**

- **User Registration & Login** with JWT-based authentication
- **Role-based Access Control** (User/Admin)
- **Protected Routes** with middleware
- **Session Management** with automatic token refresh
- **Password Security** with bcrypt hashing

### 🏢 **Facility Management**

- **Public Facility Browsing** with search and filters
- **Detailed Facility Pages** with images and descriptions
- **Admin Facility CRUD** operations
- **Image Upload** integration with ImageBB
- **Facility Categories** and pricing management

### 📅 **Booking System**

- **Real-time Availability** checking
- **Interactive Booking** interface
- **Booking Confirmation** and management
- **Cancellation System** with policies
- **Booking History** and status tracking

### 👤 **User Dashboard**

- **My Bookings** - View and manage all bookings
- **Payment History** - Track all transactions
- **Profile Management** - Update personal information
- **Settings** - Notification and privacy preferences

### 👨‍💼 **Admin Dashboard**

- **Analytics Dashboard** - Revenue, bookings, and usage statistics
- **User Management** - View, suspend, and manage users
- **Facility Management** - Add, edit, and delete facilities
- **Booking Management** - Oversee all bookings
- **System Settings** - Configure platform settings

### 💳 **Payment Integration**

- **SSLCommerz Integration** for secure payments
- **Payment History** tracking
- **Receipt Generation** and download
- **Refund Management** system

### 📱 **Responsive Design**

- **Mobile-First** approach
- **Tablet & Desktop** optimized
- **Dark/Light Mode** support
- **Accessibility** compliant (WCAG 2.1)

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Charts**: Recharts

### **Backend** (Separate Repository)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + ImageBB
- **Payment**: SSLCommerz
- **Validation**: Zod

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Backend API running (see backend repository)
- ImageBB API key for image uploads

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd sports-facility-booking-frontend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install

# or

yarn install

# or

pnpm install
\`\`\`

### 3. Environment Setup

Create a \`.env.local\` file in the root directory:

\`\`\`env

# API Configuration

NEXT_PUBLIC_API_URL=https://sports-facility-backend-fawn.vercel.app/api

# ImageBB Configuration

NEXT_PUBLIC_IMAGEBB_API_KEY=your_imagebb_api_key_here

# App Configuration

NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev

# or

yarn dev

# or

pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication pages
│ │ ├── login/
│ │ └── register/
│ ├── dashboard/ # Dashboard pages
│ │ ├── admin/ # Admin dashboard
│ │ │ ├── analytics/
│ │ │ ├── bookings/
│ │ │ ├── facilities/
│ │ │ ├── settings/
│ │ │ └── users/
│ │ └── user/ # User dashboard
│ │ ├── bookings/
│ │ ├── payments/
│ │ ├── profile/
│ │ └── settings/
│ ├── facilities/ # Public facility pages
│ ├── booking/ # Booking pages
│ ├── about/ # About page
│ ├── contact/ # Contact page
│ └── globals.css # Global styles
├── components/ # Reusable components
│ ├── ui/ # shadcn/ui components
│ ├── layout/ # Layout components
│ ├── dashboard/ # Dashboard components
│ ├── home/ # Homepage components
│ └── providers/ # Context providers
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
├── services/ # API service functions
├── store/ # Redux store configuration
│ └── slices/ # Redux slices
├── types/ # TypeScript type definitions
└── middleware.ts # Next.js middleware
\`\`\`

## 🎯 Key Features Explained

### **Authentication Flow**

1. **Registration**: Users register with email, password, and personal details
2. **Login**: JWT tokens are issued and stored securely
3. **Route Protection**: Middleware protects dashboard routes
4. **Role-based Access**: Different interfaces for users and admins

### **Booking Process**

1. **Browse Facilities**: Users explore available facilities
2. **Check Availability**: Real-time availability checking
3. **Make Booking**: Select date, time, and confirm booking
4. **Payment**: Secure payment processing with SSLCommerz
5. **Confirmation**: Booking confirmation and receipt generation

### **Admin Management**

1. **Dashboard Overview**: Key metrics and statistics
2. **Facility Management**: Add, edit, delete facilities with images
3. **User Management**: View, suspend, activate user accounts
4. **Booking Oversight**: Monitor and manage all bookings
5. **Analytics**: Revenue tracking and usage analytics

## 🔧 Configuration

### **Environment Variables**

| Variable                        | Description                 | Required |
| ------------------------------- | --------------------------- | -------- |
| \`NEXT_PUBLIC_API_URL\`         | Backend API base URL        | Yes      |
| \`NEXT_PUBLIC_IMAGEBB_API_KEY\` | ImageBB API key for uploads | Yes      |
| \`NEXT_PUBLIC_APP_URL\`         | Frontend app URL            | Yes      |

### **API Integration**

The frontend integrates with the backend API through:

- **Axios HTTP Client** with interceptors
- **Redux Toolkit Query** for state management
- **Automatic Token Management** in requests
- **Error Handling** with user-friendly messages

## 🎨 UI/UX Features

### **Design System**

- **Consistent Color Palette** with CSS variables
- **Typography Scale** with proper hierarchy
- **Spacing System** using Tailwind CSS
- **Component Library** with shadcn/ui

### **User Experience**

- **Loading States** for all async operations
- **Error Boundaries** for graceful error handling
- **Toast Notifications** for user feedback
- **Form Validation** with real-time feedback
- **Responsive Navigation** with mobile menu

### **Accessibility**

- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **Focus Management** for modals and forms
- **Color Contrast** compliance
- **Alt Text** for all images

## 📊 State Management

### **Redux Store Structure**

\`\`\`typescript
{
auth: {
user: User | null,
token: string | null,
isLoading: boolean,
error: string | null
},
facilities: {
items: Facility[],
currentFacility: Facility | null,
isLoading: boolean,
error: string | null
},
bookings: {
userBookings: Booking[],
allBookings: Booking[],
isLoading: boolean,
error: string | null
},
users: {
items: User[],
isLoading: boolean,
error: string | null
},
admin: {
stats: AdminStats,
isLoading: boolean,
error: string | null
}
}
\`\`\`

## 🔒 Security Features

### **Frontend Security**

- **XSS Protection** with proper input sanitization
- **CSRF Protection** with SameSite cookies
- **Secure Token Storage** in httpOnly cookies
- **Route Protection** with middleware
- **Input Validation** with Zod schemas

### **API Security**

- **JWT Authentication** with access/refresh tokens
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for cross-origin requests
- **Input Validation** on all endpoints
- **Error Handling** without sensitive data exposure

## 🧪 Testing

### **Testing Strategy**

\`\`\`bash

# Run unit tests

npm run test

# Run integration tests

npm run test:integration

# Run e2e tests

npm run test:e2e

# Generate coverage report

npm run test:coverage
\`\`\`

### **Testing Tools**

- **Jest** for unit testing
- **React Testing Library** for component testing
- **Cypress** for end-to-end testing
- **MSW** for API mocking

## 🚀 Deployment

### **Vercel Deployment** (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### **Manual Deployment**

\`\`\`bash

# Build the application

npm run build

# Start production server

npm start
\`\`\`

### **Docker Deployment**

\`\`\`bash

# Build Docker image

docker build -t sports-booking-frontend .

# Run container

docker run -p 3000:3000 sports-booking-frontend
\`\`\`

## 📈 Performance Optimization

### **Next.js Optimizations**

- **App Router** for improved performance
- **Server Components** where applicable
- **Image Optimization** with next/image
- **Code Splitting** automatic with Next.js
- **Static Generation** for public pages

### **Bundle Optimization**

- **Tree Shaking** to remove unused code
- **Dynamic Imports** for code splitting
- **Webpack Bundle Analyzer** for size analysis
- **Compression** with gzip/brotli

## 🤝 Contributing

### **Development Workflow**

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/amazing-feature\`
3. Make your changes and commit: \`git commit -m 'Add amazing feature'\`
4. Push to the branch: \`git push origin feature/amazing-feature\`
5. Open a Pull Request

### **Code Standards**

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

### **Pull Request Guidelines**

- Ensure all tests pass
- Update documentation if needed
- Follow the existing code style
- Add tests for new features

## 📞 Support & Documentation

### **Getting Help**

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: Comprehensive guides and API docs
- **Examples**: Sample implementations and use cases

### **Useful Links**

- [Backend Repository](https://github.com/AR-Raju/sports-facility-backend)
- [API Documentation](https://github.com/AR-Raju/sports-facility-backend)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Redux Toolkit** for state management

---

**Made with ❤️ by [Asikur Rahman]**

For more information, visit our [website](your-website-url) or contact us at [email](mailto:rahman99.asikur@gmail.com).
