'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';
import { LayoutDashboard, User, Briefcase, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/portfolio',    label: 'Portfolio',    icon: User },
  { href: '/jobs',         label: 'Find Jobs',    icon: Briefcase },
  { href: '/applications', label: 'Applications', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); router.push('/login'); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">      {/* ── Logo ───────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-[#E5E7EB]">        <Link href="/dashboard" className="flex items-center">
          <Image src="/Logo.png" alt="Aji Tkhdem" width={100} height={32} className="object-contain flex-shrink-0" />
        </Link>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-[#E8F2FB] text-[#1F6FAF]'
                  : 'text-[#6B7280] hover:bg-[#F2F4F7] hover:text-[#2C4A6D]'
              )}
            >
              <Icon
                className={cn('w-4 h-4 flex-shrink-0', active ? 'text-[#1F6FAF]' : 'text-[#6B7280]')}
              />
              {label}
              {/* Active indicator bar */}
              {active && (
                <span className="ml-auto w-1.5 h-4 rounded-full bg-[#F26A21]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User ───────────────────────────────────────────────────────── */}
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg bg-[#F2F4F7]">
          <div className="w-8 h-8 bg-[#1F6FAF] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user ? getInitials(user.full_name) : 'U'}
            </span>
          </div>
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2C4A6D] truncate">{user?.full_name}</p>
            <p className="text-xs text-[#6B7280] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-red-50 hover:text-red-600 transition-all mt-1"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[#E5E7EB] h-screen sticky top-0 shadow-sm">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-[#E5E7EB]"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen
          ? <X className="w-5 h-5 text-[#2C4A6D]" />
          : <Menu className="w-5 h-5 text-[#2C4A6D]" />}
      </button>

      {/* Mobile panel */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-[#2C4A6D]/40" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 z-50 w-64 h-screen shadow-xl border-r border-[#E5E7EB]">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
