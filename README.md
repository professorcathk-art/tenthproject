# TenthProject - Project-Based Learning Platform

A comprehensive platform connecting students with expert mentors through hands-on, real-world projects. Learn practical skills while building your portfolio.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup/signin for students and mentors
- **Project Browsing**: Search, filter, and discover projects by category and difficulty
- **Mentor Profiles**: Detailed mentor profiles with ratings and specialties
- **Dashboard**: Personalized dashboards for students and mentors
- **Wishlist**: Save favorite projects for later
- **Responsive Design**: Works seamlessly on desktop and mobile

### Student Features
- Browse and search projects
- View detailed project information
- Add projects to wishlist
- Track learning progress
- Connect with mentors

### Mentor Features
- Create and manage projects
- Set pricing and availability
- Track student progress
- Manage profile and credentials

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **UI Components**: Headless UI, Heroicons
- **State Management**: React Hooks
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
cd tenthproject
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.template .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tenthproject?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
```

### 3. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
tenthproject/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── projects/          # Project pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   └── lib/                   # Utilities and configurations
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

## 🗄️ Database Schema

The platform uses a comprehensive database schema with the following main entities:

- **Users**: Students and mentors with role-based access
- **Projects**: Learning projects with categories, difficulty levels, and pricing
- **Enrollments**: Student-project relationships with progress tracking
- **Reviews**: Rating and feedback system
- **Messages**: Communication between users
- **Wishlist**: Saved projects for students

## 🔐 Authentication

The platform supports multiple authentication methods:

- **Credentials**: Email/password authentication
- **Google OAuth**: Social login (optional)
- **Role-based Access**: Separate flows for students and mentors

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean, professional design
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: Prepared for theme switching
- **Loading States**: Smooth user experience

## 🚧 Development Roadmap

### Completed ✅
- [x] Project setup and configuration
- [x] Database schema design
- [x] Authentication system
- [x] Basic project browsing
- [x] User dashboards

### In Progress 🚧
- [ ] Mentor dashboard features
- [ ] Payment integration
- [ ] Real-time messaging
- [ ] Review system
- [ ] Admin panel

### Planned 📋
- [ ] Advanced search and filtering
- [ ] Video call integration
- [ ] Mobile app
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@tenthproject.com or join our Discord community.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM
- All the open-source contributors who made this possible

---

**TenthProject** - Learn through real projects, build real skills. 🚀