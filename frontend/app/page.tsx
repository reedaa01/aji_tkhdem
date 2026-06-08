import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, User, BarChart2, ArrowRight, CheckCircle } from 'lucide-react';

const FEATURES = [
  {
    icon: User,
    title: 'Portfolio Builder',
    description: 'Create a stunning portfolio with your skills, experience, and projects. Upload your CV and avatar.',
  },
  {
    icon: Briefcase,
    title: 'Live Job Listings',
    description: 'Browse thousands of remote jobs fetched live from top job boards. Filter by role or category.',
  },
  {
    icon: BarChart2,
    title: 'Application Tracker',
    description: 'Track every job you apply to. Update statuses from applied → interview → offer.',
  },
];

const BENEFITS = [
  'JWT-secured authentication',
  'Upload CV (PDF) and avatar',
  'Real-time remote job listings',
  'Application status pipeline',
  'Skills & experience management',
  'Project showcase gallery',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/Logo.png" alt="Aji Tkhdem" width={120} height={38} className="object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition hover:bg-gray-100"
              style={{ color: '#6B7280' }}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg transition nav-get-started"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <span
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: '#E8F2FB', color: '#1F6FAF' }}
        >
          🚀 Your all-in-one career platform
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: '#2C4A6D' }}>
          Build your portfolio.<br />
          <span style={{ color: '#F26A21' }}>Land your dream job.</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: '#6B7280' }}>
          Aji Tkhdem helps you showcase your skills, discover remote opportunities, and track every application — all from one beautiful dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl text-base cta-primary"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition text-base"
            style={{ backgroundColor: '#F2F4F7', color: '#2C4A6D' }}
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20" style={{ backgroundColor: '#F2F4F7' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#2C4A6D' }}>
            Everything you need to get hired
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition" style={{ borderColor: '#E5E7EB' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#E8F2FB' }}>
                  <Icon className="w-6 h-6" style={{ color: '#1F6FAF' }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: '#2C4A6D' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#2C4A6D' }}>
              Built for modern job seekers
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: '#6B7280' }}>
              A production-ready SaaS platform that gives you the tools to stand out — from a beautiful portfolio to a smart application tracker.
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm" style={{ color: '#2C4A6D' }}>
                  <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#F26A21' }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl p-8 border" style={{ background: 'linear-gradient(135deg, #E8F2FB 0%, #FEF0E7 100%)', borderColor: '#BFDBF7' }}>
            <div className="space-y-4">
              {[
                { status: 'applied', label: 'Senior React Developer — Vercel', color: '#1F6FAF' },
                { status: 'interview', label: 'Full-Stack Engineer — Stripe', color: '#F26A21' },
                { status: 'offer', label: 'Backend Engineer — GitHub', color: '#16a34a' },
              ].map(({ status, label, color }) => (
                <div key={status} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#2C4A6D' }}>{label}</p>
                    <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#1F6FAF' }}>
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your next job?</h2>
          <p className="mb-8" style={{ color: '#BFDBF7' }}>Join Aji Tkhdem and take control of your career journey today.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 font-semibold px-8 py-3 rounded-xl text-base cta-secondary"
          >
            Create free account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: '#E5E7EB' }}>
        <div className="max-w-6xl mx-auto px-6 text-center text-sm" style={{ color: '#6B7280' }}>
          © {new Date().getFullYear()} Aji Tkhdem. Built with Next.js &amp; Node.js.
        </div>
      </footer>
    </div>
  );
}
