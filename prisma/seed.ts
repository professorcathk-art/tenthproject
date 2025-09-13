import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample categories
  const categories = [
    { name: 'Technology', description: 'Programming, AI, Web Development', icon: '💻', color: '#3B82F6' },
    { name: 'Business', description: 'Marketing, Finance, Strategy', icon: '💼', color: '#10B981' },
    { name: 'Design', description: 'UI/UX, Graphic Design, Branding', icon: '🎨', color: '#F59E0B' },
    { name: 'Academic', description: 'Research, Analysis, Writing', icon: '📚', color: '#8B5CF6' },
    { name: 'Language', description: 'English, Communication, Writing', icon: '🗣️', color: '#EF4444' },
    { name: 'Creative', description: 'Art, Music, Photography', icon: '🎭', color: '#EC4899' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Create sample mentors
  const hashedPassword = await bcrypt.hash('password123', 12)

  const mentors = [
    {
      name: 'Alex Chen',
      email: 'alex@example.com',
      bio: 'Full-stack developer with 8+ years of experience in AI and web development. I love teaching and helping students build real-world projects.',
      specialties: ['AI Development', 'Web Development', 'JavaScript', 'Python'],
      experience: '8+ years in software development',
      qualifications: ['Computer Science Degree', 'AWS Certified', 'Google Cloud Certified'],
      languages: ['English', 'Mandarin'],
      hourlyRate: 75,
      isVerified: true,
      rating: 4.9,
      totalReviews: 234,
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      bio: 'Mobile app developer specializing in React Native and Flutter. I help students create cross-platform apps that users love.',
      specialties: ['React Native', 'Flutter', 'Mobile Development', 'UI/UX'],
      experience: '6+ years in mobile development',
      qualifications: ['Computer Science Degree', 'React Native Certified'],
      languages: ['English'],
      hourlyRate: 65,
      isVerified: true,
      rating: 4.8,
      totalReviews: 156,
    },
    {
      name: 'Michael Rodriguez',
      email: 'michael@example.com',
      bio: 'Data scientist and analyst with expertise in Python, machine learning, and business intelligence. I make data accessible and actionable.',
      specialties: ['Data Analysis', 'Python', 'Machine Learning', 'Business Intelligence'],
      experience: '7+ years in data science',
      qualifications: ['Statistics PhD', 'Data Science Certification'],
      languages: ['English', 'Spanish'],
      hourlyRate: 80,
      isVerified: true,
      rating: 4.7,
      totalReviews: 189,
    },
    {
      name: 'Emma Thompson',
      email: 'emma@example.com',
      bio: 'UX/UI designer with a passion for creating intuitive and beautiful user experiences. I help students think like designers.',
      specialties: ['UX Design', 'UI Design', 'Figma', 'User Research'],
      experience: '5+ years in design',
      qualifications: ['Design Degree', 'Google UX Certificate'],
      languages: ['English'],
      hourlyRate: 70,
      isVerified: true,
      rating: 4.9,
      totalReviews: 167,
    },
  ]

  for (const mentorData of mentors) {
    const user = await prisma.user.upsert({
      where: { email: mentorData.email },
      update: {},
      create: {
        name: mentorData.name,
        email: mentorData.email,
        password: hashedPassword,
        role: 'MENTOR',
        mentorProfile: {
          create: {
            bio: mentorData.bio,
            specialties: mentorData.specialties,
            experience: mentorData.experience,
            qualifications: mentorData.qualifications,
            languages: mentorData.languages,
            hourlyRate: mentorData.hourlyRate,
            isVerified: mentorData.isVerified,
            rating: mentorData.rating,
            totalReviews: mentorData.totalReviews,
            teachingMethods: ['Online Video', 'Screen Sharing', 'Code Review'],
          },
        },
      },
    })
  }

  // Create sample students
  const students = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      bio: 'Computer science student passionate about AI and machine learning.',
      interests: ['AI', 'Machine Learning', 'Web Development'],
      goals: 'Build a career in AI development',
      level: 'intermediate',
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      bio: 'Marketing professional looking to transition into tech.',
      interests: ['Data Analysis', 'Business Intelligence', 'Marketing'],
      goals: 'Learn data analysis skills for career growth',
      level: 'beginner',
    },
  ]

  for (const studentData of students) {
    await prisma.user.upsert({
      where: { email: studentData.email },
      update: {},
      create: {
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        role: 'STUDENT',
        studentProfile: {
          create: {
            bio: studentData.bio,
            interests: studentData.interests,
            goals: studentData.goals,
            level: studentData.level,
            languages: ['English'],
          },
        },
      },
    })
  }

  // Get created users for project creation
  const mentorUsers = await prisma.user.findMany({
    where: { role: 'MENTOR' },
    include: { mentorProfile: true },
  })

  // Create sample projects
  const projects = [
    {
      title: 'AI Website Development & Monetization',
      description: 'Learn to build and monetize AI-powered websites from scratch. This comprehensive project covers frontend development with React, AI integration using OpenAI APIs, backend development with Node.js, and business strategies for monetization. You\'ll build a complete SaaS application and learn how to deploy it to production.',
      shortDescription: 'Build and monetize AI-powered websites from scratch',
      category: 'TECHNOLOGY',
      subcategory: 'Web Development',
      difficulty: 'INTERMEDIATE',
      duration: 8,
      price: 299,
      objectives: [
        'Build a responsive React frontend',
        'Integrate AI APIs for functionality',
        'Create a Node.js backend',
        'Implement user authentication',
        'Deploy to production',
        'Learn monetization strategies'
      ],
      prerequisites: [
        'Basic JavaScript knowledge',
        'Understanding of React fundamentals',
        'Basic HTML/CSS skills'
      ],
      tools: [
        'React',
        'Node.js',
        'OpenAI API',
        'MongoDB',
        'Stripe',
        'Vercel'
      ],
      deliverables: [
        'Complete AI-powered website',
        'Source code repository',
        'Deployment guide',
        'Monetization strategy document'
      ],
      mentorEmail: 'alex@example.com',
    },
    {
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native. Learn state management with Redux, navigation with React Navigation, and app store deployment. This project will take you from beginner to building production-ready mobile apps.',
      shortDescription: 'Build cross-platform mobile apps with React Native',
      category: 'TECHNOLOGY',
      subcategory: 'Mobile Development',
      difficulty: 'BEGINNER',
      duration: 6,
      price: 199,
      objectives: [
        'Set up React Native development environment',
        'Learn component-based architecture',
        'Implement state management',
        'Add navigation between screens',
        'Integrate with APIs',
        'Deploy to app stores'
      ],
      prerequisites: [
        'Basic JavaScript knowledge',
        'Understanding of React concepts',
        'Mobile device for testing'
      ],
      tools: [
        'React Native',
        'Redux',
        'React Navigation',
        'Expo',
        'Firebase'
      ],
      deliverables: [
        'Complete mobile application',
        'Source code repository',
        'App store deployment',
        'Development documentation'
      ],
      mentorEmail: 'sarah@example.com',
    },
    {
      title: 'Data Analysis & Visualization Masterclass',
      description: 'Master data analysis using Python, pandas, and visualization tools. Work with real datasets and create compelling visualizations that tell a story. Learn statistical analysis, data cleaning, and how to present insights effectively.',
      shortDescription: 'Master data analysis with Python and visualization tools',
      category: 'BUSINESS',
      subcategory: 'Data Analysis',
      difficulty: 'INTERMEDIATE',
      duration: 4,
      price: 149,
      objectives: [
        'Learn Python for data analysis',
        'Master pandas for data manipulation',
        'Create compelling visualizations',
        'Perform statistical analysis',
        'Clean and preprocess data',
        'Present insights effectively'
      ],
      prerequisites: [
        'Basic Python knowledge',
        'Understanding of statistics',
        'Excel or spreadsheet experience'
      ],
      tools: [
        'Python',
        'Pandas',
        'Matplotlib',
        'Seaborn',
        'Jupyter Notebooks',
        'Tableau'
      ],
      deliverables: [
        'Data analysis project',
        'Visualization portfolio',
        'Analysis report',
        'Python scripts and notebooks'
      ],
      mentorEmail: 'michael@example.com',
    },
    {
      title: 'UX/UI Design Masterclass',
      description: 'Learn user experience and interface design principles. Create wireframes, prototypes, and design systems. This project covers the complete design process from research to final implementation.',
      shortDescription: 'Master UX/UI design from research to implementation',
      category: 'DESIGN',
      subcategory: 'UX/UI Design',
      difficulty: 'BEGINNER',
      duration: 5,
      price: 179,
      objectives: [
        'Learn design thinking principles',
        'Conduct user research',
        'Create wireframes and prototypes',
        'Design user interfaces',
        'Build design systems',
        'Present design solutions'
      ],
      prerequisites: [
        'Basic computer skills',
        'Interest in design',
        'Access to design software'
      ],
      tools: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'InVision',
        'Principle'
      ],
      deliverables: [
        'Complete design project',
        'Design system',
        'Prototype',
        'Design portfolio'
      ],
      mentorEmail: 'emma@example.com',
    },
  ]

  for (const projectData of projects) {
    const mentor = mentorUsers.find((u: any) => u.email === projectData.mentorEmail)
    if (mentor && mentor.mentorProfile) {
      await prisma.project.create({
        data: {
          title: projectData.title,
          description: projectData.description,
          shortDescription: projectData.shortDescription,
          category: projectData.category as "TECHNOLOGY" | "BUSINESS" | "DESIGN" | "ACADEMIC" | "LANGUAGE" | "CREATIVE" | "OTHER",
          subcategory: projectData.subcategory,
          difficulty: projectData.difficulty as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
          duration: projectData.duration,
          price: projectData.price,
          objectives: projectData.objectives,
          prerequisites: projectData.prerequisites,
          tools: projectData.tools,
          deliverables: projectData.deliverables,
          mentorId: mentor.mentorProfile.id,
          images: [],
          isActive: true,
          isFeatured: true,
          maxStudents: 10,
        },
      })
    }
  }

  // Set system configuration
  await prisma.systemConfig.upsert({
    where: { key: 'COMMISSION_RATE' },
    update: { value: '0.085' },
    create: {
      key: 'COMMISSION_RATE',
      value: '0.085'
    }
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
