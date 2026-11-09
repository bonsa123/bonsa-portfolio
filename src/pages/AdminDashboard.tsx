import { useState, useEffect, useRef, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  X,
  Save,
  ExternalLink,
  Github,
  Image as ImageIcon,
  AlertTriangle,
  Mail,
  BookOpenText,
  Briefcase,
  LayoutDashboard,
  MessageSquareText,
  UserCircle,
  MapPin,
  Globe,
  ArrowUpRight,
  Upload,
  Camera,
  Layers3,
  Settings2,
  GraduationCap,
  Award,
  Check,
} from 'lucide-react'
import axios from 'axios'
import Button from '../components/ui/Button'
import { Certificate, ContactMessage, EducationEntry, PortfolioContent, Project, SkillCategory } from '../types'
import { defaultPortfolioContent } from '../data/portfolio'
import fallbackPhoto from '../assets/bonsa.jpg'

/* ── Photo Upload widget ──────────────────────────────── */
function PhotoUpload({
  onUploaded,
  currentPhotoUrl,
  endpoint = '/api/upload-photo',
  title = 'Profile Photo',
  fallbackPhotoUrl = '',
}: {
  onUploaded: (photoUrl: string) => void | Promise<void>
  currentPhotoUrl: string
  endpoint?: string
  title?: string
  fallbackPhotoUrl?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(currentPhotoUrl || fallbackPhotoUrl)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')

  // keep preview in sync when parent fetches fresh data
  useEffect(() => {
    setPreview(currentPhotoUrl || fallbackPhotoUrl)
  }, [currentPhotoUrl, fallbackPhotoUrl])

  const handleFile = async (file: File) => {
    if (!file) return
    setErr('')
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('photo', file)
      // Axios must set the multipart boundary so the server can parse the upload.
      const { data } = await axios.post<{ photoUrl: string }>(endpoint, fd)
      if (!data.photoUrl) throw new Error('The server did not return a photo URL.')
      setPreview(data.photoUrl)
      await onUploaded(data.photoUrl)
    } catch (error) {
      const responseMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      setErr(responseMessage || (error instanceof Error ? error.message : 'Photo upload failed.'))
      setPreview(currentPhotoUrl || fallbackPhotoUrl)
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center text-center sm:text-left">
      {/* Current photo preview */}
      <div className="relative flex-shrink-0">
        <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-2xl border-2 border-accent/30 bg-slate-800">
          {preview ? (
            <img src={preview} alt={title} className="h-full w-full object-cover object-top" />
          ) : (
            <ImageIcon size={26} className="text-slate-500" aria-hidden="true" />
          )}
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors"
          aria-label="Change photo"
        >
          <Camera size={14} className="text-white" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        className="flex-1 w-full"
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <p className="font-display text-sm font-semibold text-white mb-1">{title}</p>
        <p className="text-xs text-slate-400 mb-3">JPEG, PNG or WEBP · max 5 MB</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-xs sm:text-sm text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
        >
          <Upload size={14} />
          {uploading ? 'Uploading…' : 'Choose photo'}
        </button>

        <p className="text-[11px] sm:text-xs text-slate-500 mt-2">or drag & drop onto the preview</p>

        {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={onInputChange}
        />
      </div>
    </div>
  )
}

type TabKey = 'overview' | 'profile' | 'content' | 'projects' | 'skills' | 'education' | 'certificates' | 'messages'

type ProfileFormState = {
  name: string
  title: string
  subtitle: string
  intro: string
  email: string
  phone: string
  location: string
  github: string
  linkedin: string
  instagram: string
  youtube: string
  telegram: string
}

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  description: '',
  image: '',
  technologies: [],
  liveUrl: '',
  sourceUrl: '',
  featured: false,
}

const emptyProfile: ProfileFormState = {
  name: '',
  title: '',
  subtitle: '',
  intro: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  instagram: '',
  youtube: '',
  telegram: '',
}

type ContentFormState = Omit<PortfolioContent, 'aboutParagraphs'> & {
  aboutParagraphsText: string
}

const toContentForm = (content: PortfolioContent): ContentFormState => ({
  ...content,
  aboutParagraphsText: content.aboutParagraphs.join('\n\n'),
})

const fromContentForm = (content: ContentFormState): PortfolioContent => {
  const { aboutParagraphsText, ...values } = content
  return {
    ...values,
    aboutParagraphs: aboutParagraphsText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean),
  }
}

const contentFieldGroups: {
  title: string
  description: string
  fields: { key: keyof ContentFormState; label: string; multiline?: boolean }[]
}[] = [
  {
    title: 'Hero and navigation',
    description: 'Control the landing page status, floating cards, buttons, and navigation labels.',
    fields: [
      { key: 'heroGreeting', label: 'Name introduction prefix' },
      { key: 'heroScrollLabel', label: 'Scroll indicator label' },
      { key: 'heroAvailability', label: 'Availability badge' },
      { key: 'heroExperienceLabel', label: 'Experience card label' },
      { key: 'heroExperienceValue', label: 'Experience card value' },
      { key: 'heroExperienceSubtext', label: 'Experience card detail' },
      { key: 'heroStackLabel', label: 'Technology card label' },
      { key: 'heroStackValue', label: 'Technology card value' },
      { key: 'heroStackSubtext', label: 'Technology card detail' },
      { key: 'heroProjectsButton', label: 'Projects button' },
      { key: 'heroContactButton', label: 'Contact button' },
      { key: 'navAbout', label: 'About navigation label' },
      { key: 'navSkills', label: 'Skills navigation label' },
      { key: 'navProjects', label: 'Projects navigation label' },
      { key: 'navEducation', label: 'Education navigation label' },
      { key: 'navContact', label: 'Contact navigation label' },
      { key: 'navHireButton', label: 'Hire button label' },
    ],
  },
  {
    title: 'About section',
    description: 'Write one paragraph per block, separated with a blank line.',
    fields: [
      { key: 'aboutEyebrow', label: 'Section eyebrow' },
      { key: 'aboutTitle', label: 'Section title' },
      { key: 'aboutSubtitle', label: 'Section subtitle' },
      { key: 'aboutParagraphsText', label: 'About paragraphs', multiline: true },
      { key: 'learningLabel', label: 'Learning callout label' },
      { key: 'learningText', label: 'Learning callout text', multiline: true },
      { key: 'aboutLocationLabel', label: 'Location highlight label' },
      { key: 'aboutStatusLabel', label: 'Status highlight label' },
    ],
  },
  {
    title: 'Section headings',
    description: 'Edit the heading and description shown above each portfolio section.',
    fields: [
      { key: 'skillsEyebrow', label: 'Skills eyebrow' },
      { key: 'skillsTitle', label: 'Skills title' },
      { key: 'skillsSubtitle', label: 'Skills subtitle' },
      { key: 'projectsEyebrow', label: 'Projects eyebrow' },
      { key: 'projectsTitle', label: 'Projects title' },
      { key: 'projectsSubtitle', label: 'Projects subtitle' },
      { key: 'educationEyebrow', label: 'Education eyebrow' },
      { key: 'educationTitle', label: 'Education title' },
      { key: 'educationSubtitle', label: 'Education subtitle' },
      { key: 'educationTimelineNote', label: 'Education timeline note' },
    ],
  },
  {
    title: 'Contact section',
    description: 'Manage the contact section introduction, form copy, and response messages.',
    fields: [
      { key: 'contactEyebrow', label: 'Section eyebrow' },
      { key: 'contactTitle', label: 'Section title' },
      { key: 'contactSubtitle', label: 'Section subtitle', multiline: true },
      { key: 'contactIntro', label: 'Contact introduction', multiline: true },
      { key: 'contactEmailInfoLabel', label: 'Email information label' },
      { key: 'contactPhoneLabel', label: 'Phone information label' },
      { key: 'contactEmailButton', label: 'Email button' },
      { key: 'contactSocialDivider', label: 'Social links divider label' },
      { key: 'contactFormEyebrow', label: 'Message form eyebrow' },
      { key: 'contactFormTitle', label: 'Message form title' },
      { key: 'contactNameLabel', label: 'Name field label' },
      { key: 'contactEmailLabel', label: 'Email field label' },
      { key: 'contactSubjectLabel', label: 'Subject field label' },
      { key: 'contactMessageLabel', label: 'Message field label' },
      { key: 'contactNamePlaceholder', label: 'Name field placeholder' },
      { key: 'contactEmailPlaceholder', label: 'Email field placeholder' },
      { key: 'contactSubjectPlaceholder', label: 'Subject field placeholder' },
      { key: 'contactMessagePlaceholder', label: 'Message field placeholder' },
      { key: 'contactSubmitButton', label: 'Submit button' },
      { key: 'contactLoadingLabel', label: 'Submitting button label' },
      { key: 'contactSuccessMessage', label: 'Success message' },
      { key: 'contactErrorMessage', label: 'Error message' },
    ],
  },
  {
    title: 'Footer',
    description: 'Set the public footer link text and copyright closing.',
    fields: [
      { key: 'footerBackToTopLabel', label: 'Back to top label' },
      { key: 'footerRightsReservedLabel', label: 'Copyright closing text' },
    ],
  },
]

function ProjectModal({
  project,
  onSave,
  onClose,
}: {
  project?: Project
  onSave: (data: Omit<Project, 'id'>) => void
  onClose: () => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<Omit<Project, 'id'>>(
    project ? { ...project } : { ...emptyProject },
  )
  const [techInput, setTechInput] = useState(project?.technologies.join(', ') ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')

  const uploadImage = async (file?: File) => {
    if (!file) return
    setImageError('')
    setImageUploading(true)
    try {
      const body = new FormData()
      body.append('photo', file)
      const { data } = await axios.post<{ photoUrl: string }>('/api/upload-image', body)
      setForm((current) => ({ ...current, image: data.photoUrl }))
    } catch (error) {
      const responseMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined
      setImageError(responseMessage || 'Image upload failed.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      technologies: techInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between z-10">
          <h2 className="font-display font-bold text-primary text-base sm:text-lg">
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-elevated"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Project Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="My Awesome Project"
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Description *
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="A short description of what this project does..."
              rows={3}
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="w-full bg-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  void uploadImage(event.target.files?.[0])
                  event.target.value = ''
                }}
              />
              <Button type="button" variant="outline" size="sm" disabled={imageUploading} onClick={() => imageInputRef.current?.click()}>
                <Upload size={14} />
                {imageUploading ? 'Uploading…' : 'Upload image'}
              </Button>
              <span className="text-[11px] sm:text-xs text-muted">JPEG, PNG, WEBP · max 5MB</span>
            </div>
            {imageError && <p className="text-xs text-red-400">{imageError}</p>}
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="mt-2 w-full aspect-video object-cover rounded-lg border border-border"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Technologies (comma separated)
            </label>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="React, TypeScript, Node.js"
              className="w-full bg-elevated border border-border rounded-xl px-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Live URL
            </label>
            <div className="relative">
              <ExternalLink size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={form.liveUrl}
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                placeholder="https://myproject.com"
                className="w-full bg-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-mono text-xs text-muted uppercase tracking-wide">
              Source Code URL
            </label>
            <div className="relative">
              <Github size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-elevated border border-border rounded-xl pl-9 pr-4 py-2.5 text-primary placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors duration-200 ${form.featured ? 'bg-accent' : 'bg-border'}`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.featured ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </div>
            <span className="text-secondary text-sm">Featured project</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="md" className="flex-1">
              <Save size={15} />
              {project ? 'Save Changes' : 'Add Project'}
            </Button>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfile)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('')
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([])
  const [education, setEducation] = useState<EducationEntry[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [certificateForm, setCertificateForm] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    image: '',
    skills: '',
  })
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null)
  const [deleteCertConfirm, setDeleteCertConfirm] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryIcon, setNewCategoryIcon] = useState('Code2')
  const [newSkillDrafts, setNewSkillDrafts] = useState<Record<number, string>>({})
  const [categoryDrafts, setCategoryDrafts] = useState<Record<number, { label: string; icon: string }>>({})
  const [educationForm, setEducationForm] = useState({
    institution: '',
    degree: '',
    period: '',
    description: '',
    highlights: '',
  })
  const [editingEducationId, setEditingEducationId] = useState<number | null>(null)
  const [contentForm, setContentForm] = useState<ContentFormState>(toContentForm(defaultPortfolioContent))
  const [savingContent, setSavingContent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteMessageConfirm, setDeleteMessageConfirm] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const navigate = useNavigate()
  const adminMonogram = profileForm.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('') || 'P'

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects')
      setProjects(Array.isArray(res.data) ? res.data : [])
    } catch {
      setProjects([])
      showMessage('error', 'Could not load projects. Check the API connection.')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/contact')
      setMessages(res.data || [])
    } catch {
      setMessages([])
      showMessage('error', 'Could not load messages. Check the API connection.')
    } finally {
      setLoadingMessages(false)
    }
  }

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('/api/profile')
      const social = data.social || {}
      setProfileForm({
        name: data.name || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        intro: data.intro || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        github: data.github ?? social.github ?? '',
        linkedin: data.linkedin ?? social.linkedin ?? '',
        instagram: data.instagram ?? social.instagram ?? '',
        youtube: data.youtube ?? social.youtube ?? '',
        telegram: data.telegram ?? social.telegram ?? '',
      })
      setProfilePhotoUrl(data.photoUrl || '')
    } catch {
      showMessage('error', 'Could not load profile settings.')
    }
  }

  const fetchSkillData = async () => {
    try {
      const { data } = await axios.get('/api/skill-categories')
      setSkillCategories(data || [])
    } catch {
      setSkillCategories([])
      showMessage('error', 'Could not load skills. Check the API connection.')
    }
  }

  const fetchEducationData = async () => {
    try {
      const { data } = await axios.get('/api/education')
      setEducation(data || [])
    } catch {
      setEducation([])
      showMessage('error', 'Could not load education. Check the API connection.')
    }
  }

  const fetchCertificates = async () => {
    try {
      const { data } = await axios.get('/api/certificates')
      setCertificates(Array.isArray(data) ? data : [])
    } catch {
      setCertificates([])
    }
  }

  const fetchContent = async () => {
    try {
      const { data } = await axios.get<PortfolioContent>('/api/content')
      setContentForm(toContentForm({ ...defaultPortfolioContent, ...data }))
    } catch {
      showMessage('error', 'Could not load portfolio content.')
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchMessages()
    fetchProfile()
    fetchSkillData()
    fetchEducationData()
    fetchCertificates()
    fetchContent()
  }, [])

  const handleSaveCertificate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const payload = {
        title: certificateForm.title,
        issuer: certificateForm.issuer,
        issueDate: certificateForm.issueDate,
        credentialUrl: certificateForm.credentialUrl,
        credentialId: certificateForm.credentialId,
        image: certificateForm.image,
        skills: certificateForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }
      if (editingCertificateId) {
        await axios.put(`/api/certificates/${editingCertificateId}`, payload)
        showMessage('success', 'Certificate updated successfully.')
      } else {
        await axios.post('/api/certificates', payload)
        showMessage('success', 'Certificate added successfully.')
      }
      setCertificateForm({
        title: '',
        issuer: '',
        issueDate: '',
        credentialUrl: '',
        credentialId: '',
        image: '',
        skills: '',
      })
      setEditingCertificateId(null)
      fetchCertificates()
    } catch {
      showMessage('error', 'Failed to save certificate.')
    }
  }

  const handleEditCertificate = (item: Certificate) => {
    setEditingCertificateId(item.id)
    setCertificateForm({
      title: item.title,
      issuer: item.issuer,
      issueDate: item.issueDate,
      credentialUrl: item.credentialUrl || '',
      credentialId: item.credentialId || '',
      image: item.image || '',
      skills: (item.skills || []).join(', '),
    })
  }

  const handleDeleteCertificate = async (id: string) => {
    try {
      await axios.delete(`/api/certificates/${id}`)
      setDeleteCertConfirm(null)
      showMessage('success', 'Certificate deleted successfully.')
      fetchCertificates()
    } catch {
      showMessage('error', 'Failed to delete certificate.')
    }
  }

  const handleSaveProject = async (data: Omit<Project, 'id'>) => {
    try {
      if (editingProject) {
        await axios.put(`/api/projects/${editingProject.id}`, data)
        showMessage('success', 'Project updated successfully.')
      } else {
        await axios.post('/api/projects', data)
        showMessage('success', 'Project added successfully.')
      }
      fetchProjects()
      setModalOpen(false)
      setEditingProject(undefined)
    } catch {
      showMessage('error', 'Failed to save. Make sure the server is running.')
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await axios.delete(`/api/projects/${id}`)
      showMessage('success', 'Project deleted.')
      fetchProjects()
    } catch {
      showMessage('error', 'Failed to delete project.')
    }
    setDeleteConfirm(null)
  }

  const handleDeleteMessage = async (id: string) => {
    try {
      await axios.delete(`/api/contact/${id}`)
      await fetchMessages()
      showMessage('success', 'Contact message removed.')
    } catch {
      showMessage('error', 'Failed to remove contact message.')
    } finally {
      setDeleteMessageConfirm(null)
    }
  }

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const { data } = await axios.put('/api/profile', profileForm)
      const social = data.social || {}
      setProfileForm({
        name: data.name || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        intro: data.intro || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        github: data.github ?? social.github ?? '',
        linkedin: data.linkedin ?? social.linkedin ?? '',
        instagram: data.instagram ?? social.instagram ?? '',
        youtube: data.youtube ?? social.youtube ?? '',
        telegram: data.telegram ?? social.telegram ?? '',
      })
      showMessage('success', 'Profile updated successfully.')
    } catch {
      showMessage('error', 'Profile could not be updated.')
    }
  }

  const handleContentSave = async (e: FormEvent) => {
    e.preventDefault()
    setSavingContent(true)
    try {
      const { data } = await axios.put<PortfolioContent>('/api/content', fromContentForm(contentForm))
      setContentForm(toContentForm(data))
      showMessage('success', 'Portfolio content updated.')
    } catch {
      showMessage('error', 'Portfolio content could not be saved.')
    } finally {
      setSavingContent(false)
    }
  }

  const handleAboutPhotoUpload = async (photoUrl: string) => {
    const { data: savedContent } = await axios.get<PortfolioContent>('/api/content')
    const { data } = await axios.put<PortfolioContent>('/api/content', {
      ...savedContent,
      aboutPhotoUrl: photoUrl,
    })
    setContentForm((current) => ({ ...current, aboutPhotoUrl: data.aboutPhotoUrl }))
    showMessage('success', 'About photo uploaded and saved.')
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showMessage('error', 'Category name is required.')
      return
    }

    try {
      await axios.post('/api/skill-categories', {
        name: newCategoryName,
        icon: newCategoryIcon,
      })
      setNewCategoryName('')
      setNewCategoryIcon('Code2')
      fetchSkillData()
      showMessage('success', 'Skill category added.')
    } catch {
      showMessage('error', 'Failed to add skill category.')
    }
  }

  const handleAddSkill = async (categoryId: number) => {
    const skillName = (newSkillDrafts[categoryId] || '').trim()
    if (!skillName) {
      showMessage('error', 'Skill name is required.')
      return
    }

    try {
      await axios.post('/api/skills', { categoryId, name: skillName })
      setNewSkillDrafts((current) => ({ ...current, [categoryId]: '' }))
      fetchSkillData()
      showMessage('success', 'Skill added.')
    } catch {
      showMessage('error', 'Failed to add skill.')
    }
  }

  const handleSaveCategory = async (category: SkillCategory) => {
    const categoryId = Number(category.id)
    const draft = categoryDrafts[categoryId] || { label: category.label, icon: category.icon }
    if (!draft.label.trim()) {
      showMessage('error', 'Category name is required.')
      return
    }

    try {
      await axios.put(`/api/skill-categories/${categoryId}`, { name: draft.label, icon: draft.icon })
      setCategoryDrafts((current) => {
        const next = { ...current }
        delete next[categoryId]
        return next
      })
      await fetchSkillData()
      showMessage('success', 'Skill category updated.')
    } catch {
      showMessage('error', 'Failed to update skill category.')
    }
  }

  const handleDeleteCategory = async (categoryId: number | string) => {
    try {
      await axios.delete(`/api/skill-categories/${categoryId}`)
      await fetchSkillData()
      showMessage('success', 'Skill category and its skills removed.')
    } catch {
      showMessage('error', 'Failed to delete skill category.')
    }
  }

  const handleDeleteSkill = async (skillId: number) => {
    try {
      await axios.delete(`/api/skills/${skillId}`)
      await fetchSkillData()
      showMessage('success', 'Skill removed.')
    } catch {
      showMessage('error', 'Failed to remove skill.')
    }
  }

  const handleSaveEducation = async (e: FormEvent) => {
    e.preventDefault()
    if (!educationForm.institution || !educationForm.degree || !educationForm.period) {
      showMessage('error', 'Institution, degree, and period are required.')
      return
    }

    try {
      const educationPayload = {
        institution: educationForm.institution,
        degree: educationForm.degree,
        period: educationForm.period,
        description: educationForm.description,
        highlights: educationForm.highlights
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }
      if (editingEducationId === null) {
        await axios.post('/api/education', educationPayload)
      } else {
        await axios.put(`/api/education/${editingEducationId}`, educationPayload)
      }
      setEducationForm({
        institution: '',
        degree: '',
        period: '',
        description: '',
        highlights: '',
      })
      const wasEditing = editingEducationId !== null
      setEditingEducationId(null)
      await fetchEducationData()
      showMessage('success', wasEditing ? 'Education entry updated.' : 'Education entry created.')
    } catch {
      showMessage('error', 'Failed to save education entry.')
    }
  }

  const handleEditEducation = (item: EducationEntry) => {
    setEditingEducationId(Number(item.id))
    setEducationForm({
      institution: item.institution,
      degree: item.degree,
      period: item.period,
      description: item.description,
      highlights: item.highlights.join(', '),
    })
  }

  const handleDeleteEducation = async (id: number | string) => {
    try {
      await axios.delete(`/api/education/${id}`)
      fetchEducationData()
      showMessage('success', 'Education entry removed.')
    } catch {
      showMessage('error', 'Failed to remove education entry.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/admin')
  }

  const stats = [
    {
      label: 'Projects',
      value: projects.length,
      subtext: 'Portfolio entries',
      tone: 'text-accent',
      icon: Briefcase,
    },
    {
      label: 'Featured',
      value: projects.filter((project) => project.featured).length,
      subtext: 'Highlighted work',
      tone: 'text-emerald-400',
      icon: ArrowUpRight,
    },
    {
      label: 'Messages',
      value: messages.length,
      subtext: 'New contact leads',
      tone: 'text-violet-400',
      icon: MessageSquareText,
    },
    {
      label: 'Skills',
      value: skillCategories.reduce((total, category) => total + category.skills.length, 0),
      subtext: 'Managed skills',
      tone: 'text-cyan-400',
      icon: Layers3,
    },
    {
      label: 'Education',
      value: education.length,
      subtext: 'Timeline entries',
      tone: 'text-amber-400',
      icon: GraduationCap,
    },
    {
      label: 'Certificates',
      value: certificates.length,
      subtext: 'Verified credentials',
      tone: 'text-emerald-400',
      icon: Award,
    },
  ]

  const tabs: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'profile', label: 'Profile', icon: UserCircle },
    { key: 'content', label: 'Page content', icon: Settings2 },
    { key: 'projects', label: 'Projects', icon: Briefcase },
    { key: 'skills', label: 'Skills', icon: Layers3 },
    { key: 'education', label: 'Education', icon: GraduationCap },
    { key: 'certificates', label: 'Certificates', icon: Award },
    { key: 'messages', label: 'Messages', icon: MessageSquareText },
  ]

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-display text-lg font-bold">
              {adminMonogram}
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-white">{profileForm.name || 'Portfolio'}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  activeTab === key
                    ? 'bg-accent/10 border border-accent/25 text-accent'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}

            <a href="/" className="mt-4 block rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
              View portfolio
            </a>
          </nav>

          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-accent/30 hover:text-white"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-md">
            <div className="flex items-center justify-between px-3.5 py-3 sm:px-6 md:px-8 sm:py-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent font-display text-sm font-bold shrink-0">
                  {adminMonogram}
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-400">Admin Control</p>
                  <h1 className="font-display text-base sm:text-2xl font-bold text-white truncate">
                    {tabs.find((tab) => tab.key === activeTab)?.label}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors"
                  title="View live portfolio"
                >
                  <ExternalLink size={13} className="text-accent" />
                  <span className="hidden xs:inline">View Site</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-accent hover:bg-accent/15 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Tab Navigation Bar */}
            <nav className="md:hidden flex gap-1.5 overflow-x-auto border-t border-white/5 bg-slate-950 px-3 py-2 scrollbar-none" aria-label="Dashboard sections">
              {tabs.map(({ key, label, icon: Icon }) => {
                const isSelected = activeTab === key
                const count =
                  key === 'messages' ? messages.length :
                  key === 'projects' ? projects.length :
                  key === 'certificates' ? certificates.length : undefined

                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    aria-current={isSelected ? 'page' : undefined}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-accent text-white shadow-sm shadow-accent/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={12} className={isSelected ? 'text-white' : 'text-slate-400'} />
                    <span>{label}</span>
                    {count !== undefined && count > 0 && (
                      <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </header>

          <main className="mx-auto max-w-7xl px-3.5 py-5 sm:px-6 md:px-8 sm:py-8">
            {message && (
              <div
                className={`mb-4 sm:mb-6 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm ${
                  message.type === 'success'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/10 text-red-300'
                }`}
              >
                {message.type === 'error' && <AlertTriangle size={15} />}
                {message.text}
              </div>
            )}

            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-4">
                  {stats.map(({ label, value, subtext, tone, icon: Icon }) => (
                    <div key={label} className="rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/70 p-3 sm:p-5">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-slate-400">{label}</p>
                        <Icon size={13} className="text-slate-300 sm:w-4 sm:h-4" />
                      </div>
                      <div className="mt-2 sm:mt-4 flex items-end justify-between gap-1">
                        <span className={`text-xl sm:text-3xl font-bold ${tone}`}>{value}</span>
                        <span className="text-[9.5px] sm:text-xs text-slate-400 truncate">{subtext}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Quick Action Buttons */}
                <div className="mt-3 sm:mt-6 grid grid-cols-2 gap-2 sm:hidden">
                  <button
                    onClick={() => {
                      setEditingProject(undefined)
                      setModalOpen(true)
                    }}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-accent/40 bg-accent/15 text-accent text-xs font-medium"
                  >
                    <Plus size={14} />
                    New Project
                  </button>
                  <button
                    onClick={() => setActiveTab('certificates')}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400 text-xs font-medium"
                  >
                    <Award size={14} />
                    Add Certificate
                  </button>
                </div>

                <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-white">Projects</h2>
                      <p className="text-sm text-slate-400">Manage your public portfolio projects</p>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingProject(undefined)
                        setModalOpen(true)
                      }}
                    >
                      <Plus size={16} />
                      Add Project
                    </Button>
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-slate-400">Loading...</div>
                  ) : (
                    <div className="space-y-4">
                      {projects.length === 0 && (
                        <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">No projects yet. Add one to show it on the public portfolio.</p>
                      )}
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-start"
                        >
                          <div className="h-20 w-full overflow-hidden rounded-xl bg-slate-800 md:w-24">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-500">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
                              {project.featured && (
                                <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">{project.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.technologies.slice(0, 4).map((technology) => (
                                <span
                                  key={technology}
                                  className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300"
                                >
                                  {technology}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
                            {deleteConfirm === project.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-300">Delete?</span>
                                <button onClick={() => handleDeleteProject(project.id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/20">
                                  Yes
                                </button>
                                <button onClick={() => setDeleteConfirm(null)} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingProject(project)
                                    setModalOpen(true)
                                  }}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-accent/30 hover:text-accent"
                                  aria-label="Edit project"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(project.id)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-500/30 hover:text-red-300"
                                  aria-label="Delete project"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-semibold text-white">Profile Settings</h2>
                  <p className="text-sm text-slate-400">Update the public identity, intro and contact links.</p>
                </div>

                {/* ── Photo Upload ────────────────────────────────── */}
                <PhotoUpload
                  onUploaded={(photoUrl) => {
                    setProfilePhotoUrl(photoUrl)
                    showMessage('success', 'Photo updated!')
                  }}
                  currentPhotoUrl={profilePhotoUrl}
                  fallbackPhotoUrl={fallbackPhoto}
                />

                <form onSubmit={handleProfileSave} className="grid gap-4 md:grid-cols-2 mt-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Name</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Title</label>
                    <input value={profileForm.title} onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Subtitle</label>
                    <input value={profileForm.subtitle} onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Intro</label>
                    <textarea value={profileForm.intro} onChange={(e) => setProfileForm({ ...profileForm, intro: e.target.value })} rows={4} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Email</label>
                    <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Phone</label>
                    <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Location</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">GitHub</label>
                    <div className="relative">
                      <Github size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={profileForm.github} onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">LinkedIn</label>
                    <input value={profileForm.linkedin} onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Instagram</label>
                    <input value={profileForm.instagram} onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">YouTube</label>
                    <input value={profileForm.youtube} onChange={(e) => setProfileForm({ ...profileForm, youtube: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block font-mono text-xs text-muted uppercase tracking-wide">Telegram</label>
                    <div className="relative">
                      <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input value={profileForm.telegram} onChange={(e) => setProfileForm({ ...profileForm, telegram: e.target.value })} className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white" />
                    </div>
                  </div>

                  <div className="md:col-span-2 flex justify-end pt-2">
                    <Button type="submit">
                      <Save size={15} />
                      Save profile
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'content' && (
              <form onSubmit={handleContentSave} className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                  <div className="mb-6">
                    <h2 className="font-display text-2xl font-semibold text-white">Portfolio page content</h2>
                    <p className="mt-1 text-sm text-slate-400">Edit the words visitors see across the hero, navigation, and every section.</p>
                  </div>
                  <div className="space-y-6">
                    {contentFieldGroups.map((group) => (
                      <section key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:p-5">
                        <div className="mb-4">
                          <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">{group.description}</p>
                        </div>
                        {group.title === 'About section' && (
                          <div className="mb-5">
                            <PhotoUpload
                              title="About section photo"
                              endpoint="/api/upload-image"
                              currentPhotoUrl={contentForm.aboutPhotoUrl}
                              fallbackPhotoUrl={profilePhotoUrl}
                              onUploaded={handleAboutPhotoUpload}
                            />
                          </div>
                        )}
                        <div className="grid gap-4 md:grid-cols-2">
                          {group.fields.map((field) => (
                            <label key={field.key} className={`space-y-1.5 ${field.multiline ? 'md:col-span-2' : ''}`}>
                              <span className="block font-mono text-xs text-slate-400 uppercase tracking-wide">{field.label}</span>
                              {field.multiline ? (
                                <textarea
                                  value={contentForm[field.key]}
                                  onChange={(event) => setContentForm((current) => ({ ...current, [field.key]: event.target.value }))}
                                  rows={field.key === 'aboutParagraphsText' ? 8 : 3}
                                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white resize-y"
                                />
                              ) : (
                                <input
                                  value={contentForm[field.key]}
                                  onChange={(event) => setContentForm((current) => ({ ...current, [field.key]: event.target.value }))}
                                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white"
                                />
                              )}
                            </label>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={savingContent}>
                      <Save size={15} />
                      {savingContent ? 'Saving…' : 'Save page content'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'projects' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-white">Project Manager</h2>
                    <p className="text-sm text-slate-400">Create, update, and feature your work.</p>
                  </div>
                  <Button onClick={() => { setEditingProject(undefined); setModalOpen(true) }}>
                    <Plus size={16} />
                    New Project
                  </Button>
                </div>

                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="h-24 w-full overflow-hidden rounded-xl bg-slate-800 md:w-32">
                          {project.image ? (
                            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-500"><ImageIcon size={22} /></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
                            {project.featured && <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-accent">Featured</span>}
                          </div>
                          <p className="mt-2 text-sm text-slate-300">{project.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <span key={`${project.id}-${tech}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-300">{tech}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 md:flex-col md:items-end">
                          <button onClick={() => { setEditingProject(project); setModalOpen(true) }} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-accent/30 hover:text-accent">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleDeleteProject(project.id)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-500/30 hover:text-red-300">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-white">Contact Messages</h2>
                    <p className="text-sm text-slate-400">Latest leads from your portfolio contact form</p>
                  </div>
                </div>

                {loadingMessages ? (
                  <div className="py-10 text-center text-slate-400">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/50 px-5 py-10 text-center text-slate-400">
                    No messages yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((messageItem) => (
                      <div key={messageItem.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-display text-lg font-semibold text-white">{messageItem.name}</p>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{messageItem.email}</p>
                          </div>
                          <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={12} />
                            {new Date(messageItem.createdAt).toLocaleString()}
                          </div>
                          {deleteMessageConfirm === messageItem.id ? (
                            <div className="inline-flex items-center gap-2">
                              <span className="text-xs text-red-300">Delete message?</span>
                              <button type="button" onClick={() => void handleDeleteMessage(messageItem.id)} className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-2 text-xs text-red-300 hover:bg-red-500/20">Confirm</button>
                              <button type="button" onClick={() => setDeleteMessageConfirm(null)} className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs text-slate-300">Cancel</button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteMessageConfirm(messageItem.id)}
                              className="inline-flex items-center gap-2 self-start rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-300 hover:bg-red-500/10 md:self-auto"
                              aria-label={`Delete message from ${messageItem.name}`}
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{messageItem.subject || 'General Inquiry'}</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{messageItem.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'skills' && (
              <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-semibold text-white">Skills manager</h2>
                  <p className="text-sm text-slate-400">Add, rename, organize, and remove public skill categories and skills.</p>
                </div>
                <form
                  className="mb-6 flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault()
                    void handleAddCategory()
                  }}
                >
                  <input required value={newCategoryName} onChange={(event) => setNewCategoryName(event.target.value)} placeholder="New category name" className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white" />
                  <select value={newCategoryIcon} onChange={(event) => setNewCategoryIcon(event.target.value)} className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white">
                    {['Code2', 'Monitor', 'Server', 'Database', 'Wrench'].map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                  <Button type="submit"><Plus size={15} />Add category</Button>
                </form>
                {skillCategories.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">No skill categories yet.</p>
                ) : (
                  <div className="space-y-4">
                    {skillCategories.map((category) => {
                      const categoryId = Number(category.id)
                      const draft = categoryDrafts[categoryId] || { label: category.label, icon: category.icon }
                      return (
                        <article key={category.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <input aria-label="Category name" value={draft.label} onChange={(event) => setCategoryDrafts((current) => ({ ...current, [categoryId]: { ...draft, label: event.target.value } }))} className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-white" />
                            <select aria-label="Category icon" value={draft.icon} onChange={(event) => setCategoryDrafts((current) => ({ ...current, [categoryId]: { ...draft, icon: event.target.value } }))} className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-white">
                              {['Code2', 'Monitor', 'Server', 'Database', 'Wrench'].map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                            </select>
                            <button type="button" onClick={() => void handleSaveCategory(category)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/30 px-3 py-2 text-sm text-accent hover:bg-accent/10"><Check size={15} />Save</button>
                            <button type="button" onClick={() => void handleDeleteCategory(category.id)} className="inline-flex items-center justify-center rounded-xl border border-red-500/30 px-3 py-2 text-red-300 hover:bg-red-500/10" aria-label={`Delete ${category.label} category`}><Trash2 size={15} /></button>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {category.skills.map((skill, index) => (
                              <span key={`${category.id}-${skill}`} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 pl-3 pr-1 py-1 text-xs text-slate-300">
                                {skill}
                                {category.skillIds?.[index] !== undefined && (
                                  <button type="button" onClick={() => void handleDeleteSkill(category.skillIds![index])} className="rounded-full p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-300" aria-label={`Remove ${skill}`}><X size={12} /></button>
                                )}
                              </span>
                            ))}
                          </div>
                          <form
                            className="mt-4 flex gap-2"
                            onSubmit={(event) => {
                              event.preventDefault()
                              void handleAddSkill(categoryId)
                            }}
                          >
                            <input value={newSkillDrafts[categoryId] ?? ''} onChange={(event) => setNewSkillDrafts((current) => ({ ...current, [categoryId]: event.target.value }))} placeholder={`Add skill to ${category.label}`} className="flex-1 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-white" />
                            <Button type="submit"><Plus size={14} />Add skill</Button>
                          </form>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'education' && (
              <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5">
                  <h2 className="font-display text-2xl font-semibold text-white">Education manager</h2>
                  <p className="text-sm text-slate-400">Manage the education timeline displayed on the portfolio.</p>
                </div>
                <form onSubmit={handleSaveEducation} className="grid gap-3 md:grid-cols-2">
                  <input required value={educationForm.institution} onChange={(event) => setEducationForm({ ...educationForm, institution: event.target.value })} placeholder="Institution" className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white" />
                  <input required value={educationForm.degree} onChange={(event) => setEducationForm({ ...educationForm, degree: event.target.value })} placeholder="Degree" className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white" />
                  <input required value={educationForm.period} onChange={(event) => setEducationForm({ ...educationForm, period: event.target.value })} placeholder="Period" className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white" />
                  <input value={educationForm.highlights} onChange={(event) => setEducationForm({ ...educationForm, highlights: event.target.value })} placeholder="Highlights, comma separated" className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white" />
                  <textarea value={educationForm.description} onChange={(event) => setEducationForm({ ...educationForm, description: event.target.value })} placeholder="Description" rows={3} className="md:col-span-2 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white resize-y" />
                  <div className="md:col-span-2 flex justify-end gap-2">
                    {editingEducationId !== null && <Button type="button" variant="ghost" onClick={() => { setEditingEducationId(null); setEducationForm({ institution: '', degree: '', period: '', description: '', highlights: '' }) }}>Cancel edit</Button>}
                    <Button type="submit"><BookOpenText size={15} />{editingEducationId === null ? 'Add education' : 'Save education'}</Button>
                  </div>
                </form>
                <div className="mt-6 space-y-3">
                  {education.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">No education entries yet.</p>
                  ) : education.map((item) => (
                    <article key={item.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-base font-semibold text-white">{item.institution}</p>
                          <p className="text-sm text-slate-300">{item.degree}</p>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.period}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditEducation(item)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-accent/30 hover:text-accent" aria-label={`Edit ${item.institution}`}><Pencil size={15} /></button>
                          <button type="button" onClick={() => void handleDeleteEducation(item.id)} className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-500/30 hover:text-red-300" aria-label={`Delete ${item.institution}`}><Trash2 size={15} /></button>
                        </div>
                      </div>
                      {item.description && <p className="mt-2 text-sm text-slate-300">{item.description}</p>}
                      {item.highlights.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.highlights.map((highlight) => <span key={`${item.id}-${highlight}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-300">{highlight}</span>)}</div>}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'certificates' && (
              <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-white">Certificates manager</h2>
                    <p className="text-sm text-slate-400">Manage verified certifications and credentials shown on your portfolio.</p>
                  </div>
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent">
                    {certificates.length} {certificates.length === 1 ? 'Credential' : 'Credentials'}
                  </span>
                </div>

                <form onSubmit={handleSaveCertificate} className="grid gap-3 md:grid-cols-2">
                  <input
                    required
                    value={certificateForm.title}
                    onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                    placeholder="Certificate Title (e.g. Meta Front-End Developer)"
                    className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <input
                    required
                    value={certificateForm.issuer}
                    onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                    placeholder="Issuing Organization (e.g. Coursera / Meta, freeCodeCamp)"
                    className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <input
                    required
                    value={certificateForm.issueDate}
                    onChange={(e) => setCertificateForm({ ...certificateForm, issueDate: e.target.value })}
                    placeholder="Issue Date (e.g. 2024, May 2024)"
                    className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <input
                    value={certificateForm.credentialId}
                    onChange={(e) => setCertificateForm({ ...certificateForm, credentialId: e.target.value })}
                    placeholder="Credential ID (optional)"
                    className="bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <input
                    value={certificateForm.credentialUrl}
                    onChange={(e) => setCertificateForm({ ...certificateForm, credentialUrl: e.target.value })}
                    placeholder="Verification / Credential URL (https://...)"
                    className="md:col-span-2 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <input
                    value={certificateForm.skills}
                    onChange={(e) => setCertificateForm({ ...certificateForm, skills: e.target.value })}
                    placeholder="Skills covered, comma separated (e.g. React, JavaScript, SQL)"
                    className="md:col-span-2 bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  />
                  <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                    {editingCertificateId !== null && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingCertificateId(null)
                          setCertificateForm({
                            title: '',
                            issuer: '',
                            issueDate: '',
                            credentialUrl: '',
                            credentialId: '',
                            image: '',
                            skills: '',
                          })
                        }}
                      >
                        Cancel edit
                      </Button>
                    )}
                    <Button type="submit">
                      <Award size={15} />
                      {editingCertificateId === null ? 'Add Certificate' : 'Save Certificate'}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 space-y-3">
                  {certificates.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                      <Award size={32} className="mx-auto mb-2 opacity-40 text-accent" />
                      <p>No certificates added yet.</p>
                      <p className="text-xs text-slate-500 mt-1">Use the form above to add your first certificate.</p>
                    </div>
                  ) : (
                    certificates.map((item) => (
                      <article key={item.id} className="rounded-xl border border-white/10 bg-slate-950/50 p-4 transition-all hover:border-accent/30">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-base font-semibold text-white">{item.title}</span>
                              <span className="font-mono text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                                {item.issueDate}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">
                              Issued by <span className="text-accent">{item.issuer}</span>
                            </p>
                            {item.credentialId && (
                              <p className="font-mono text-xs text-slate-400">Credential ID: {item.credentialId}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {deleteCertConfirm === item.id ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs text-red-300">Delete?</span>
                                <button
                                  type="button"
                                  onClick={() => void handleDeleteCertificate(item.id)}
                                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-300 hover:bg-red-500/20"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteCertConfirm(null)}
                                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <>
                                {item.credentialUrl && (
                                  <a
                                    href={item.credentialUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-accent/30 hover:text-accent"
                                    title="View verification link"
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleEditCertificate(item)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-accent/30 hover:text-accent"
                                  aria-label={`Edit ${item.title}`}
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteCertConfirm(item.id)}
                                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 hover:border-red-500/30 hover:text-red-300"
                                  aria-label={`Delete ${item.title}`}
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {item.skills && item.skills.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.skills.map((skill) => (
                              <span
                                key={`${item.id}-${skill}`}
                                className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {modalOpen && (
        <ProjectModal
          project={editingProject}
          onSave={handleSaveProject}
          onClose={() => {
            setModalOpen(false)
            setEditingProject(undefined)
          }}
        />
      )}
    </div>
  )
}
