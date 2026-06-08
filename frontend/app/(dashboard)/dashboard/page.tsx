'use client';
import { useEffect, useState } from 'react';
import { applicationService } from '@/lib/services';
import { ApplicationStats, JobApplication } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { STATUS_STYLES } from '@/lib/utils';
import { Briefcase, TrendingUp, Award, XCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STAT_CARDS = [
  { key: 'total', label: 'Total Applied', icon: FileText, color: '#2C4A6D', bg: '#E8F2FB' },
  { key: 'interview', label: 'Interviews', icon: TrendingUp, color: '#92400e', bg: '#FEF3C7' },
  { key: 'offer', label: 'Offers', icon: Award, color: '#065f46', bg: '#D1FAE5' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: '#991b1b', bg: '#FEE2E2' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recent, setRecent] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          applicationService.getStats(),
          applicationService.getAll(),
        ]);
        setStats(statsRes.data.data);
        setRecent(appsRes.data.data.slice(0, 5));
      } catch {
        // silently fail on dashboard
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>
          Good day, {user?.full_name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>Here&apos;s your career overview at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
          <Card key={key} padding="sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>
                  {stats ? stats[key as keyof ApplicationStats] : 0}
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/jobs">
          <Card className="group hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F2FB' }}>
                  <Briefcase className="w-6 h-6" style={{ color: '#1F6FAF' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2C4A6D' }}>Browse Jobs</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Discover remote opportunities</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 transition" style={{ color: '#6B7280' }} />
            </div>
          </Card>
        </Link>
        <Link href="/portfolio">
          <Card className="group hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FEF0E7' }}>
                  <FileText className="w-6 h-6" style={{ color: '#F26A21' }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#2C4A6D' }}>Edit Portfolio</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>Update skills &amp; experience</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 transition" style={{ color: '#6B7280' }} />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent applications */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: '#2C4A6D' }}>Recent Applications</h2>
          <Link href="/applications" className="text-sm font-medium hover:underline" style={{ color: '#1F6FAF' }}>
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-10 h-10 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="text-sm" style={{ color: '#6B7280' }}>No applications yet.</p>
            <Link href="/jobs" className="text-sm font-medium hover:underline mt-1 inline-block" style={{ color: '#1F6FAF' }}>
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#F2F4F7' }}>
            {recent.map((app) => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#2C4A6D' }}>{app.job_title}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{app.company_name}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap" style={STATUS_STYLES[app.status]}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
