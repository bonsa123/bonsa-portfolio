import { useState, useEffect } from 'react'
import axios from 'axios'
import { Certificate, EducationEntry, PortfolioContent, Project, SkillCategory } from '../types'
import { defaultProjects, defaultPortfolioContent, personalInfo, skillCategories, education, defaultCertificates } from '../data/portfolio'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [profile, setProfile] = useState(personalInfo)
  const [skills, setSkills] = useState<SkillCategory[]>(skillCategories)
  const [educationData, setEducationData] = useState<EducationEntry[]>(education)
  const [certificates, setCertificates] = useState<Certificate[]>(defaultCertificates)
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    const profileRequest = axios.get('/api/profile')
      .then(({ data }) => {
        if (data) {
          setProfile({
            ...personalInfo,
            ...data,
            about: Array.isArray(data.about) ? data.about : personalInfo.about,
            social: {
              ...personalInfo.social,
              ...(data.social || {}),
            },
            photoUrl: data.photoUrl || '',
            resumeUrl: data.resumeUrl || personalInfo.resumeUrl,
          })
        }
      })
      .catch(() => {
        // Keep the local profile if the API is unavailable.
      })
      .finally(() => setProfileLoading(false))

    const portfolioRequest = Promise.allSettled([
      axios.get('/api/projects'),
      axios.get('/api/skill-categories'),
      axios.get('/api/education'),
      axios.get('/api/certificates'),
      axios.get('/api/content'),
    ])
      .then(([projectsRes, skillsRes, educationRes, certificatesRes, contentRes]) => {
        if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value.data)) {
          setProjects(projectsRes.value.data)
        }

        if (skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value.data)) {
          setSkills(skillsRes.value.data)
        }

        if (educationRes.status === 'fulfilled' && Array.isArray(educationRes.value.data)) {
          setEducationData(educationRes.value.data)
        }

        if (certificatesRes.status === 'fulfilled' && Array.isArray(certificatesRes.value.data)) {
          setCertificates(certificatesRes.value.data)
        }

        if (contentRes.status === 'fulfilled' && contentRes.value.data) {
          setContent({
            ...defaultPortfolioContent,
            ...contentRes.value.data,
            aboutParagraphs: Array.isArray(contentRes.value.data.aboutParagraphs)
              ? contentRes.value.data.aboutParagraphs
              : defaultPortfolioContent.aboutParagraphs,
          })
        }
      })
      .catch(() => {
        // Fallback to static local data if the API is not available
      })
      .finally(() => setLoading(false))

    void Promise.all([profileRequest, portfolioRequest])
  }, [])

  return { projects, profile, skillCategories: skills, education: educationData, certificates, content, loading, profileLoading }
}
