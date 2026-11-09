export interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  liveUrl: string
  sourceUrl: string
  featured: boolean
  category?: string
  longDescription?: string
  highlights?: string[]
  challenges?: string
  role?: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export interface AdminCredentials {
  password: string
}

export interface SkillCategory {
  id: number | string
  label: string
  icon: string
  skills: string[]
  skillIds?: number[]
}

export interface EducationEntry {
  id: number | string
  institution: string
  degree: string
  period: string
  description: string
  highlights: string[]
}

export interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialUrl?: string
  credentialId?: string
  image?: string
  skills?: string[]
}

export interface PortfolioContent {
  heroGreeting: string
  heroScrollLabel: string
  heroAvailability: string
  heroExperienceLabel: string
  heroExperienceValue: string
  heroExperienceSubtext: string
  heroStackLabel: string
  heroStackValue: string
  heroStackSubtext: string
  heroProjectsButton: string
  heroContactButton: string
  navAbout: string
  navSkills: string
  navProjects: string
  navEducation: string
  navContact: string
  navHireButton: string
  aboutEyebrow: string
  aboutTitle: string
  aboutSubtitle: string
  aboutPhotoUrl: string
  aboutParagraphs: string[]
  learningLabel: string
  learningText: string
  aboutLocationLabel: string
  aboutStatusLabel: string
  skillsEyebrow: string
  skillsTitle: string
  skillsSubtitle: string
  projectsEyebrow: string
  projectsTitle: string
  projectsSubtitle: string
  educationEyebrow: string
  educationTitle: string
  educationSubtitle: string
  educationTimelineNote: string
  contactEyebrow: string
  contactTitle: string
  contactSubtitle: string
  contactIntro: string
  contactEmailInfoLabel: string
  contactPhoneLabel: string
  contactEmailButton: string
  contactSocialDivider: string
  contactFormEyebrow: string
  contactFormTitle: string
  contactNameLabel: string
  contactEmailLabel: string
  contactSubjectLabel: string
  contactMessageLabel: string
  contactNamePlaceholder: string
  contactEmailPlaceholder: string
  contactSubjectPlaceholder: string
  contactMessagePlaceholder: string
  contactLoadingLabel: string
  contactSubmitButton: string
  contactSuccessMessage: string
  contactErrorMessage: string
  footerBackToTopLabel: string
  footerRightsReservedLabel: string
}
