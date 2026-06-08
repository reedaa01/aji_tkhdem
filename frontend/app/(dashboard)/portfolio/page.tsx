'use client';
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { portfolioService, skillService, experienceService, projectService } from '@/lib/services';
import { Portfolio, Skill, Experience, Project } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { formatDate, SKILL_LEVEL_STYLES } from '@/lib/utils';
import { Upload, Plus, Pencil, Trash2, Camera, FileText, ExternalLink, Github } from 'lucide-react';
import { useForm } from 'react-hook-form';

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const API_BASE = ''; // uploads served via Next.js rewrite proxy /uploads/*

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<Portfolio>({});
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  // Skill modal
  const [skillModal, setSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({ name: '', level: 'intermediate' });

  // Experience modal
  const [expModal, setExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<Partial<Experience>>({});

  // Project modal
  const [projModal, setProjModal] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);
  const [projForm, setProjForm] = useState<Partial<Project>>({});

  const avatarRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await portfolioService.getMyPortfolio();
      const { portfolio: p, skills: s, experience: e, projects: pr } = res.data.data;
      setPortfolio(p);
      setSkills(s);
      setExperience(e);
      setProjects(pr);
    } catch {
      toast.error('Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await portfolioService.upsert(portfolio);
      setPortfolio(res.data.data);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const res = await portfolioService.uploadAvatar(file);
      setPortfolio((p) => ({ ...p, avatar_url: res.data.avatar_url }));
      toast.success('Avatar updated!');
    } catch {
      toast.error('Avatar upload failed.');
    }
  };

  const handleCVUpload = async (file: File) => {
    try {
      const res = await portfolioService.uploadCV(file);
      setPortfolio((p) => ({ ...p, cv_url: res.data.cv_url }));
      toast.success('CV uploaded!');
    } catch {
      toast.error('CV upload failed.');
    }
  };

  // ─── Skills ────────────────────────────────────────────────────────────────
  const openSkillModal = (skill?: Skill) => {
    setEditingSkill(skill || null);
    setSkillForm({ name: skill?.name || '', level: skill?.level || 'intermediate' });
    setSkillModal(true);
  };

  const saveSkill = async () => {
    try {
      if (editingSkill) {
        await skillService.update(editingSkill.id, skillForm);
      } else {
        await skillService.create(skillForm);
      }
      const res = await skillService.getAll();
      setSkills(res.data.data);
      setSkillModal(false);
      toast.success(editingSkill ? 'Skill updated!' : 'Skill added!');
    } catch {
      toast.error('Failed to save skill.');
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await skillService.delete(id);
      setSkills((s) => s.filter((sk) => sk.id !== id));
      toast.success('Skill deleted.');
    } catch {
      toast.error('Failed to delete skill.');
    }
  };

  // ─── Experience ────────────────────────────────────────────────────────────
  const openExpModal = (exp?: Experience) => {
    setEditingExp(exp || null);
    setExpForm(exp || {});
    setExpModal(true);
  };

  const saveExperience = async () => {
    try {
      if (editingExp) {
        await experienceService.update(editingExp.id, expForm);
      } else {
        await experienceService.create(expForm);
      }
      const res = await experienceService.getAll();
      setExperience(res.data.data);
      setExpModal(false);
      toast.success(editingExp ? 'Experience updated!' : 'Experience added!');
    } catch {
      toast.error('Failed to save experience.');
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      await experienceService.delete(id);
      setExperience((e) => e.filter((ex) => ex.id !== id));
      toast.success('Experience deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  // ─── Projects ──────────────────────────────────────────────────────────────
  const openProjModal = (proj?: Project) => {
    setEditingProj(proj || null);
    setProjForm(proj || {});
    setProjModal(true);
  };

  const saveProject = async () => {
    try {
      if (editingProj) {
        await projectService.update(editingProj.id, projForm);
      } else {
        await projectService.create(projForm);
      }
      const res = await projectService.getAll();
      setProjects(res.data.data);
      setProjModal(false);
      toast.success(editingProj ? 'Project updated!' : 'Project added!');
    } catch {
      toast.error('Failed to save project.');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      await projectService.delete(id);
      setProjects((p) => p.filter((pr) => pr.id !== id));
      toast.success('Project deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#2C4A6D' }}>My Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>Manage your public profile, skills, and projects.</p>
      </div>

      {/* ─── Profile Card ──────────────────────────────────────────────────── */}
      <Card>
        <div className="flex items-start gap-6 mb-6">          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#E8F2FB' }}>
              {portfolio.avatar_url ? (
                <img src={`${API_BASE}${portfolio.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8" style={{ color: '#1F6FAF' }} />
              )}
            </div>
            <button
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center shadow transition"
              style={{ backgroundColor: '#1F6FAF' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2C4A6D')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1F6FAF')}
            >
              <Upload className="w-3.5 h-3.5 text-white" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
          </div>

          {/* CV Upload */}
          <div className="flex-1">
            <h2 className="font-semibold mb-1" style={{ color: '#2C4A6D' }}>Profile Picture &amp; CV</h2>
            <p className="text-sm mb-3" style={{ color: '#6B7280' }}>Upload your avatar and CV (PDF only, max 5MB).</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => cvRef.current?.click()}>
                <FileText className="w-3.5 h-3.5" />
                {portfolio.cv_url ? 'Replace CV' : 'Upload CV'}
              </Button>
              {portfolio.cv_url && (
                <a
                  href={`${API_BASE}${portfolio.cv_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm flex items-center gap-1 hover:underline"
                  style={{ color: '#1F6FAF' }}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View CV
                </a>
              )}
              <input ref={cvRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && handleCVUpload(e.target.files[0])} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="grid md:grid-cols-2 gap-5">
          <Input label="Headline" placeholder="e.g. Full-Stack Developer" value={portfolio.headline || ''} onChange={(e) => setPortfolio({ ...portfolio, headline: e.target.value })} />
          <Input label="Phone" placeholder="+1 234 567 890" value={portfolio.phone || ''} onChange={(e) => setPortfolio({ ...portfolio, phone: e.target.value })} />
          <Input label="Location" placeholder="e.g. Casablanca, Morocco" value={portfolio.location || ''} onChange={(e) => setPortfolio({ ...portfolio, location: e.target.value })} />
          <Input label="Website" type="url" placeholder="https://yoursite.com" value={portfolio.website || ''} onChange={(e) => setPortfolio({ ...portfolio, website: e.target.value })} />
          <Input label="GitHub" type="url" placeholder="https://github.com/username" value={portfolio.github || ''} onChange={(e) => setPortfolio({ ...portfolio, github: e.target.value })} />
          <Input label="LinkedIn" type="url" placeholder="https://linkedin.com/in/username" value={portfolio.linkedin || ''} onChange={(e) => setPortfolio({ ...portfolio, linkedin: e.target.value })} />
          <div className="md:col-span-2">
            <Textarea label="Bio" placeholder="Tell the world about yourself..." value={portfolio.bio || ''} onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })} rows={4} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" isLoading={saving}>Save Profile</Button>
          </div>
        </form>
      </Card>

      {/* ─── Skills ────────────────────────────────────────────────────────── */}
      <Card>        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: '#2C4A6D' }}>Skills</h2>
          <Button size="sm" onClick={() => openSkillModal()}>
            <Plus className="w-4 h-4" /> Add Skill
          </Button>
        </div>
        {skills.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#9CA3AF' }}>No skills added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 border rounded-full px-3 py-1.5" style={{ backgroundColor: '#F2F4F7', borderColor: '#E5E7EB' }}>
                <span className="text-sm font-medium" style={{ color: '#2C4A6D' }}>{skill.name}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={SKILL_LEVEL_STYLES[skill.level]}>{skill.level}</span>
                <button onClick={() => openSkillModal(skill)} className="transition" style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1F6FAF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                ><Pencil className="w-3 h-3" /></button>
                <button onClick={() => deleteSkill(skill.id)} className="transition" style={{ color: '#9CA3AF' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                ><Trash2 className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Experience ────────────────────────────────────────────────────── */}
      <Card>        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: '#2C4A6D' }}>Experience</h2>
          <Button size="sm" onClick={() => openExpModal()}>
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        </div>
        {experience.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#9CA3AF' }}>No experience added yet.</p>
        ) : (
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="flex gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F2F4F7' }}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold" style={{ color: '#2C4A6D' }}>{exp.position}</p>
                  <p className="text-sm font-medium" style={{ color: '#F26A21' }}>{exp.company}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>
                    {formatDate(exp.start_date)} — {exp.is_current ? 'Present' : formatDate(exp.end_date || '')}
                  </p>
                  {exp.description && <p className="text-sm mt-2 leading-relaxed" style={{ color: '#6B7280' }}>{exp.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openExpModal(exp)} className="p-1.5 rounded-lg transition" style={{ color: '#9CA3AF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#1F6FAF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
                  ><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteExperience(exp.id)} className="p-1.5 rounded-lg transition" style={{ color: '#9CA3AF' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
                  ><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Projects ──────────────────────────────────────────────────────── */}
      <Card>        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold" style={{ color: '#2C4A6D' }}>Projects</h2>
          <Button size="sm" onClick={() => openProjModal()}>
            <Plus className="w-4 h-4" /> Add Project
          </Button>
        </div>
        {projects.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#9CA3AF' }}>No projects added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div key={proj.id} className="rounded-xl overflow-hidden border" style={{ backgroundColor: '#F2F4F7', borderColor: '#E5E7EB' }}>
                {proj.image_url && (
                  <img src={`${API_BASE}${proj.image_url}`} alt={proj.title} className="w-full h-36 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold" style={{ color: '#2C4A6D' }}>{proj.title}</p>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => openProjModal(proj)} className="p-1 transition" style={{ color: '#9CA3AF' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1F6FAF')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                      ><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteProject(proj.id)} className="p-1 transition" style={{ color: '#9CA3AF' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                      ><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {proj.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: '#6B7280' }}>{proj.description}</p>}
                  {proj.tech_stack && (
                    <p className="text-xs mt-2 font-medium" style={{ color: '#1F6FAF' }}>{proj.tech_stack}</p>
                  )}
                  <div className="flex gap-3 mt-3">
                    {proj.project_url && (
                      <a href={proj.project_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#6B7280' }}>
                        <ExternalLink className="w-3 h-3" />Live
                      </a>
                    )}
                    {proj.github_url && (
                      <a href={proj.github_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: '#6B7280' }}>
                        <Github className="w-3 h-3" />Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ─── Skill Modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={skillModal} onClose={() => setSkillModal(false)} title={editingSkill ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <Input label="Skill Name" placeholder="e.g. React, Node.js" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
          <Select label="Level" options={SKILL_LEVELS} value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setSkillModal(false)}>Cancel</Button>
            <Button onClick={saveSkill}>{editingSkill ? 'Update' : 'Add'} Skill</Button>
          </div>
        </div>
      </Modal>

      {/* ─── Experience Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={expModal} onClose={() => setExpModal(false)} title={editingExp ? 'Edit Experience' : 'Add Experience'}>
        <div className="space-y-4">
          <Input label="Company" placeholder="e.g. Google" value={expForm.company || ''} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })} />
          <Input label="Position" placeholder="e.g. Software Engineer" value={expForm.position || ''} onChange={(e) => setExpForm({ ...expForm, position: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={expForm.start_date || ''} onChange={(e) => setExpForm({ ...expForm, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={expForm.end_date || ''} onChange={(e) => setExpForm({ ...expForm, end_date: e.target.value })} disabled={!!expForm.is_current} />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#2C4A6D' }}>
            <input type="checkbox" checked={!!expForm.is_current} onChange={(e) => setExpForm({ ...expForm, is_current: e.target.checked, end_date: '' })} className="rounded" />
            Currently working here
          </label>
          <Textarea label="Description" placeholder="Describe your responsibilities..." value={expForm.description || ''} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setExpModal(false)}>Cancel</Button>
            <Button onClick={saveExperience}>{editingExp ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </Modal>

      {/* ─── Project Modal ─────────────────────────────────────────────────── */}
      <Modal isOpen={projModal} onClose={() => setProjModal(false)} title={editingProj ? 'Edit Project' : 'Add Project'}>
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. My Awesome App" value={projForm.title || ''} onChange={(e) => setProjForm({ ...projForm, title: e.target.value })} />
          <Textarea label="Description" placeholder="What does this project do?" value={projForm.description || ''} onChange={(e) => setProjForm({ ...projForm, description: e.target.value })} />
          <Input label="Tech Stack" placeholder="e.g. React, Node.js, MySQL" value={projForm.tech_stack || ''} onChange={(e) => setProjForm({ ...projForm, tech_stack: e.target.value })} />
          <Input label="Live URL" type="url" placeholder="https://myapp.com" value={projForm.project_url || ''} onChange={(e) => setProjForm({ ...projForm, project_url: e.target.value })} />
          <Input label="GitHub URL" type="url" placeholder="https://github.com/..." value={projForm.github_url || ''} onChange={(e) => setProjForm({ ...projForm, github_url: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setProjModal(false)}>Cancel</Button>
            <Button onClick={saveProject}>{editingProj ? 'Update' : 'Add'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
