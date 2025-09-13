import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Industry Expert Mentors',
    description: 'Learn from professionals with 5+ years of real-world experience in top companies like Google, Microsoft, Amazon, and leading startups.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Real-World Projects',
    description: 'Build actual applications, websites, and solutions that you can showcase in your portfolio and resume. No toy projects - only real work.',
    icon: RocketLaunchIcon,
  },
  {
    name: '1-on-1 Mentorship',
    description: 'Get personalized guidance, code reviews, and career advice from experienced professionals who care about your success.',
    icon: UserGroupIcon,
  },
]

const stats = [
  { name: 'Expert Mentors', value: '100+' },
  { name: 'Real Projects', value: '200+' },
  { name: 'Students Helped', value: '2,500+' },
  { name: 'Success Rate', value: '98%' },
]

const testimonials = [
  {
    body: 'The AI website development project completely changed my career trajectory. I went from knowing nothing to building my own SaaS in just 8 weeks.',
    author: {
      name: 'Sarah Chen',
      handle: 'sarahchen',
      role: 'Software Developer',
    },
  },
  {
    body: 'Learning data analysis through real business projects gave me the confidence to switch careers. The mentor was incredibly supportive.',
    author: {
      name: 'Michael Rodriguez',
      handle: 'mike_rod',
      role: 'Data Analyst',
    },
  },
  {
    body: 'The design mentorship program helped me build a portfolio that landed me my dream job at a top design agency.',
    author: {
      name: 'Emma Thompson',
      handle: 'emma_designs',
      role: 'UX Designer',
    },
  },
]

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navigation />
      
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-20 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl whitespace-nowrap">
              Learn Through Real Projects
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Master in-demand skills through hands-on projects with industry experts from top companies. 
              Build your portfolio, gain real-world experience, and accelerate your career growth with personalized mentorship.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/projects"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Browse Projects
              </Link>
              <Link href="/mentors" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                Find Mentors <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-20 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-indigo-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-indigo-200">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Why Choose TenthProject</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Learn from Industry Experts
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Skip the theory, start building. Our mentors are industry professionals from Fortune 500 companies and successful startups who will guide you through real projects that matter in today&apos;s job market.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Success Stories
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
              {testimonials.map((testimonial, testimonialIdx) => (
                <div key={testimonialIdx} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                  <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                    <blockquote className="text-gray-900">
                      <p>&ldquo;{testimonial.body}&rdquo;</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                        <div className="text-gray-600">{testimonial.author.role}</div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-indigo-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Build Your Future?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
              Join our community of learners and start building real projects with expert mentors today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/signup"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </Link>
              <Link href="/projects" className="text-sm font-semibold leading-6 text-white hover:text-indigo-200">
                Browse projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-gray-400 hover:text-gray-500">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-gray-500">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-500">
              Terms
            </Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2024 TenthProject. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}