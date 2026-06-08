'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { applicationService } from '@/lib/services';
import { JobApplication, ApplicationStatus } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Spinner from '@/components/ui/Spinner';
import { STATUS_STYLES } from '@/lib/utils';
import { Briefcase, ExternalLink, Trash2, Pencil, Filter } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

const FILTER_OPTIONS = [
  { value: '', label: 'All Statuses' },
  ...STATUS_OPTIONS,
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filtered, setFiltered] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('applied');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (filterStatus) {
      setFiltered(applications.filter((a) => a.status === filterStatus));
    } else {
      setFiltered(applications);
    }
  }, [filterStatus, applications]);

  const fetchApplications = async () => {
    try {
      const res = await applicationService.getAll();
      setApplications(res.data.data);
      setFiltered(res.data.data);
    } catch {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app);
    setEditStatus(app.status);
    setEditNotes(app.notes || '');
    setEditModal(true);
  };

  const saveStatus = async () => {
    if (!editingApp) return;
    setSaving(true);
    try {
      await applicationService.updateStatus(editingApp.id, editStatus, editNotes);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === editingApp.id ? { ...a, status: editStatus, notes: editNotes } : a
        )
      );
      setEditModal(false);
      toast.success('Status updated!');
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setSaving(false);
    }
  };

  const deleteApplication = async (id: number) => {
    if (!confirm('Remove this application?')) return;
    try {
      await applicationService.delete(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success('Application removed.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>My Applications</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Track and manage all your job applications.</p>
      </div>

      {/* Pipeline summary */}
      <div className="flex gap-3 flex-wrap">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const count = applications.filter((a) => a.status === value).length;
          const isActive = filterStatus === value;
          return (
            <button
              key={value}
              onClick={() => setFilterStatus(isActive ? '' : value)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition"
              style={{
                borderColor: isActive ? '#1F6FAF' : '#E5E7EB',
                backgroundColor: isActive ? '#E8F2FB' : '#ffffff',
                color: isActive ? '#1F6FAF' : '#6B7280',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    value === 'applied' ? '#1F6FAF' :
                    value === 'interview' ? '#F26A21' :
                    value === 'offer' ? '#16a34a' :
                    value === 'rejected' ? '#dc2626' : '#9CA3AF',
                }}
              />
              {label}
              <span className="rounded-full px-1.5 py-0.5" style={{ backgroundColor: '#F2F4F7', color: '#6B7280' }}>{count}</span>
            </button>
          );
        })}
        {filterStatus && (
          <button
            onClick={() => setFilterStatus('')}
            className="text-xs px-2 transition"
            style={{ color: '#9CA3AF' }}
          >
            Clear filter ×
          </button>
        )}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p className="font-medium" style={{ color: '#6B7280' }}>
              {filterStatus ? `No "${filterStatus}" applications.` : 'No applications yet.'}
            </p>
            {!filterStatus && (
              <a href="/jobs" className="text-sm hover:underline mt-1 inline-block" style={{ color: '#1F6FAF' }}>
                Browse jobs to apply →
              </a>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card key={app.id} padding="sm" className="transition">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F2F4F7' }}>
                  <Briefcase className="w-5 h-5" style={{ color: '#6B7280' }} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-semibold" style={{ color: '#2C4A6D' }}>{app.job_title}</p>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize" style={STATUS_STYLES[app.status]}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{app.company_name}</p>
                  {app.location && (
                    <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{app.location} · {app.job_type}</p>
                  )}
                  {app.notes && (
                    <p className="text-xs mt-1.5 rounded-lg px-2.5 py-1.5 italic" style={{ color: '#6B7280', backgroundColor: '#F2F4F7' }}>
                      {app.notes}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-xs" style={{ color: '#9CA3AF' }}>Applied</p>
                  <p className="text-xs font-medium" style={{ color: '#2C4A6D' }}>
                    {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {app.job_url && (
                    <a
                      href={app.job_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg transition"
                      style={{ color: '#9CA3AF' }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => openEditModal(app)}
                    className="p-1.5 rounded-lg transition"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F2FB'; e.currentTarget.style.color = '#1F6FAF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteApplication(app.id)}
                    className="p-1.5 rounded-lg transition"
                    style={{ color: '#9CA3AF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Status Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Update Application">
        {editingApp && (
          <div className="space-y-4">
            <div className="rounded-xl p-3" style={{ backgroundColor: '#F2F4F7' }}>
              <p className="font-medium" style={{ color: '#2C4A6D' }}>{editingApp.job_title}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{editingApp.company_name}</p>
            </div>
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
            />
            <Textarea
              label="Notes"
              placeholder="Add notes about this application..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
              <Button isLoading={saving} onClick={saveStatus}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
