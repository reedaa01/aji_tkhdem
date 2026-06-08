'use client';
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { jobService, applicationService } from '@/lib/services';
import { Job } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Textarea from '@/components/ui/Textarea';
import { Search, MapPin, Briefcase, ExternalLink, Send, Tag } from 'lucide-react';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'software-dev', label: 'Software Development' },
  { value: 'devops', label: 'DevOps / SysAdmin' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'product', label: 'Product' },
  { value: 'data', label: 'Data' },
  { value: 'qa', label: 'QA' },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModal, setApplyModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load already-applied job IDs to show correct state
    applicationService.getAll().then((res) => {
      const ids = new Set<string>(res.data.data.map((a: any) => a.job_id));
      setAppliedIds(ids);
    }).catch(() => {});
    fetchJobs();
  }, []);

  const fetchJobs = useCallback(async (q?: string, cat?: string) => {
    setLoading(true);
    try {
      const res = await jobService.getJobs({
        search: q ?? search,
        category: cat ?? category,
        limit: 30,
      });
      setJobs(res.data.data);
    } catch {
      toast.error('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(search, category);
  };

  const openApplyModal = (job: Job) => {
    setSelectedJob(job);
    setNotes('');
    setApplyModal(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await applicationService.apply({
        job_id: selectedJob.id,
        job_title: selectedJob.title,
        company_name: selectedJob.company,
        job_url: selectedJob.url,
        location: selectedJob.location,
        job_type: selectedJob.type,
        notes,
      });
      setAppliedIds((prev) => new Set(prev).add(selectedJob.id));
      setApplyModal(false);
      toast.success(`Applied to ${selectedJob.title} at ${selectedJob.company}! 🎉`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>Find Jobs</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Browse live remote job listings and apply directly.</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search jobs (e.g. React, Python...)"
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2"
          style={{ borderColor: '#E5E7EB', color: '#2C4A6D', outlineColor: '#1F6FAF' }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <Button type="submit">Search</Button>
      </form>

      {/* Job count */}
      {!loading && (
        <p className="text-sm" style={{ color: '#6B7280' }}>
          Showing <span className="font-semibold" style={{ color: '#2C4A6D' }}>{jobs.length}</span> jobs
        </p>
      )}

      {/* Jobs grid */}
      {loading ? (
        <div className="py-20"><Spinner /></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
          <p style={{ color: '#6B7280' }}>No jobs found. Try a different search.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition group" padding="sm">
              <div className="flex gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ backgroundColor: '#F2F4F7' }}>
                  {job.logo ? (
                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-1" />
                  ) : (
                    <Briefcase className="w-5 h-5" style={{ color: '#6B7280' }} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate transition" style={{ color: '#2C4A6D' }}>
                    {job.title}
                  </p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{job.company}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#9CA3AF' }}>
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    {job.type && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#E8F2FB', color: '#1F6FAF' }}>
                        {job.type}
                      </span>
                    )}
                  </div>
                  {job.tags?.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {job.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F2F4F7', color: '#6B7280' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {job.salary && (
                    <p className="text-xs font-medium mt-2" style={{ color: '#16a34a' }}>{job.salary}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: '#F2F4F7' }}>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition"
                  style={{ color: '#6B7280' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Job
                </a>
                <div className="flex-1" />
                {appliedIds.has(job.id) ? (
                  <span className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: '#16a34a', backgroundColor: '#D1FAE5' }}>
                    ✓ Applied
                  </span>
                ) : (
                  <Button size="sm" onClick={() => openApplyModal(job)}>
                    <Send className="w-3.5 h-3.5" /> Apply
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <Modal isOpen={applyModal} onClose={() => setApplyModal(false)} title="Confirm Application">
        {selectedJob && (
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#F2F4F7' }}>
              <p className="font-semibold" style={{ color: '#2C4A6D' }}>{selectedJob.title}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{selectedJob.company}</p>
              <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{selectedJob.location}</p>
            </div>
            <Textarea
              label="Notes (optional)"
              placeholder="Any notes about this application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setApplyModal(false)}>Cancel</Button>
              <Button isLoading={applying} onClick={handleApply}>
                <Send className="w-4 h-4" /> Confirm Apply
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
