import express from 'express'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'
import Busboy from 'busboy'
import pool from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads')

// Ensure uploads dir exists at startup
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

dotenv.config()

const PORT = Number(process.env.PORT || 3001)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bonsa@admin2024'
const DEFAULT_CONTENT = {
  heroGreeting: "Hi, I'm",
  heroScrollLabel: 'Scroll',
  heroAvailability: 'Open to opportunities',
  heroExperienceLabel: 'Experience',
  heroExperienceValue: '2+ Years',
  heroExperienceSubtext: 'Building software',
  heroStackLabel: 'Stack',
  heroStackValue: 'Full-Stack',
  heroStackSubtext: 'React · Node · PHP',
  heroProjectsButton: 'View Projects',
  heroContactButton: 'Hire Me',
  navAbout: 'About',
  navSkills: 'Skills',
  navProjects: 'Projects',
  navEducation: 'Education',
  navContact: 'Contact',
  navHireButton: 'Hire me',
  aboutEyebrow: '01 — About',
  aboutTitle: 'A little about me',
  aboutSubtitle: 'Who I am and what drives me.',
  aboutPhotoUrl: '',
  aboutParagraphs: [
    "I'm currently pursuing my Bachelor's degree in Computer Science at Haramaya University, where I'm developing a strong foundation in programming, algorithms, data structures, and software engineering principles.",
    'I enjoy building real-world applications that solve meaningful problems. My main project, the Gindo Student Registration System, gave me hands-on experience with full-stack web development using PHP and MySQL.',
    "I'm continuously expanding my skills across multiple programming languages and technologies. I believe in writing clean, maintainable code and learning something new every day.",
  ],
  learningLabel: 'Currently learning',
  learningText:
    'Deepening my understanding of full-stack web development, exploring React and Node.js, and improving my database design skills.',
  aboutLocationLabel: 'Based in',
  aboutStatusLabel: 'Status',
  skillsEyebrow: '02 — Skills',
  skillsTitle: 'Technical Skills',
  skillsSubtitle: 'Technologies and tools I work with.',
  projectsEyebrow: '03 — Projects',
  projectsTitle: 'Featured Projects',
  projectsSubtitle: "Things I've built and worked on.",
  educationEyebrow: '04 — Education',
  educationTitle: 'Education & Background',
  educationSubtitle: 'My academic journey so far.',
  educationTimelineNote: 'More experience coming soon...',
  contactEyebrow: '05 — Contact',
  contactTitle: 'Get In Touch',
  contactSubtitle: "I'm open to internships, collaboration, and new opportunities.",
  contactIntro:
    'Whether you have a project in mind, want to collaborate, or just want to say hello — feel free to reach out.',
  contactEmailInfoLabel: 'Email',
  contactPhoneLabel: 'Phone',
  contactEmailButton: 'Send me an email',
  contactSocialDivider: 'or find me on',
  contactFormEyebrow: 'Send a message',
  contactFormTitle: "Let's build something",
  contactNameLabel: 'Name',
  contactEmailLabel: 'Email',
  contactSubjectLabel: 'Subject',
  contactMessageLabel: 'Message',
  contactNamePlaceholder: 'Your name',
  contactEmailPlaceholder: 'you@example.com',
  contactSubjectPlaceholder: 'Project inquiry',
  contactMessagePlaceholder: 'Tell me about your idea, project, or opportunity...',
  contactLoadingLabel: 'Sending...',
  contactSubmitButton: 'Send message',
  contactSuccessMessage: 'Your message was sent successfully.',
  contactErrorMessage: 'Something went wrong. Please try again.',
  footerBackToTopLabel: 'Back to top',
  footerRightsReservedLabel: 'All rights reserved.',
}
const DEFAULT_PROJECTS = [
  {
    title: 'Gindo Student Registration System',
    description:
      'A full-stack web application for managing student registrations, built with PHP and MySQL. Features include student enrollment, course management, and administrative tools.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    technologies: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
    liveUrl: '',
    sourceUrl: '',
    featured: true,
  },
]

const DEFAULT_CERTIFICATES = [
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Coursera / Meta',
    issueDate: '2024',
    credentialUrl: 'https://coursera.org',
    credentialId: 'META-FE-892401',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    skills: ['React', 'JavaScript', 'HTML5 & CSS3', 'UI/UX Design', 'Version Control'],
  },
  {
    title: 'Problem Solving & SQL Certification',
    issuer: 'HackerRank',
    issueDate: '2023',
    credentialUrl: 'https://hackerrank.com',
    credentialId: 'HR-SQL-PS-55421',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    skills: ['SQL', 'Relational Databases', 'Algorithms', 'Data Structures'],
  },
  {
    title: 'Responsive Web Design & Full Stack Foundations',
    issuer: 'freeCodeCamp',
    issueDate: '2023',
    credentialUrl: 'https://freecodecamp.org',
    credentialId: 'FCC-RWD-77189',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    skills: ['Web Design', 'Responsive CSS', 'Flexbox/Grid', 'Accessibility'],
  },
]

function normalizeTechnologies(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean)
    }
  }
  return []
}

function mapProjectRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image || '',
    technologies: normalizeTechnologies(row.technologies),
    liveUrl: row.live_url || '',
    sourceUrl: row.source_url || '',
    featured: Boolean(row.featured),
  }
}

function mapContactRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject || 'General Inquiry',
    message: row.message,
    createdAt: row.created_at,
  }
}

function mapProfileRow(row) {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    subtitle: row.subtitle,
    intro: row.intro,
    email: row.email,
    phone: row.phone,
    location: row.location,
    social: {
      github: row.github || '',
      linkedin: row.linkedin || '',
      instagram: row.instagram || '',
      youtube: row.youtube || '',
      telegram: row.telegram || '',
    },
    photoUrl: row.photo_url || '',
    about: [
      "I'm currently pursuing my Bachelor's degree in Computer Science at Haramaya University, where I'm developing a strong foundation in programming, algorithms, data structures, and software engineering principles.",
      'I enjoy building real-world applications that solve meaningful problems. My main project, the Gindo Student Registration System, gave me hands-on experience with full-stack web development using PHP and MySQL.',
      "I'm continuously expanding my skills across multiple programming languages and technologies. I believe in writing clean, maintainable code and learning something new every day.",
    ],
  }
}

function mapSkillCategoryRow(row, skills = []) {
  return {
    id: row.id,
    label: row.name,
    icon: row.icon,
    skills: skills.map((skill) => skill.name),
    skillIds: skills.map((skill) => skill.id),
  }
}

function mapPortfolioContent(value) {
  let content = value
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content)
    } catch (error) {
      console.error('Failed to parse portfolio content:', error)
      content = {}
    }
  }
  return {
    ...DEFAULT_CONTENT,
    ...(content && typeof content === 'object' && !Array.isArray(content) ? content : {}),
    aboutParagraphs: Array.isArray(content?.aboutParagraphs)
      ? content.aboutParagraphs.filter((paragraph) => typeof paragraph === 'string')
      : DEFAULT_CONTENT.aboutParagraphs,
  }
}

function mapEducationRow(row) {
  return {
    id: row.id,
    institution: row.institution,
    degree: row.degree,
    period: row.period,
    description: row.description || '',
    highlights: JSON.parse(row.highlights || '[]'),
  }
}

function mapCertificateRow(row) {
  let skills = []
  if (row.skills) {
    if (Array.isArray(row.skills)) {
      skills = row.skills
    } else {
      try {
        skills = JSON.parse(row.skills)
      } catch {
        skills = String(row.skills).split(',').map((s) => s.trim()).filter(Boolean)
      }
    }
  }

  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialUrl: row.credential_url || '',
    credentialId: row.credential_id || '',
    image: row.image || '',
    skills,
  }
}

async function ensureDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255) NOT NULL,
      intro TEXT NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      github VARCHAR(255),
      linkedin VARCHAR(255),
      instagram VARCHAR(255),
      youtube VARCHAR(255),
      telegram VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS skill_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES skill_categories(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image VARCHAR(500),
      technologies JSON,
      live_url VARCHAR(500),
      source_url VARCHAR(500),
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS education (
      id INT AUTO_INCREMENT PRIMARY KEY,
      institution VARCHAR(255) NOT NULL,
      degree VARCHAR(255) NOT NULL,
      period VARCHAR(100) NOT NULL,
      description TEXT,
      highlights JSON,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contact_messages (
      id CHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS portfolio_content (
      id TINYINT PRIMARY KEY,
      content JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS certificates (
      id CHAR(36) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      issuer VARCHAR(255) NOT NULL,
      issue_date VARCHAR(100) NOT NULL,
      credential_url VARCHAR(500),
      credential_id VARCHAR(255),
      image VARCHAR(500),
      skills JSON,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
  ]

  for (const statement of statements) {
    await pool.query(statement)
  }

  const [contentInsert] = await pool.query(
    'INSERT IGNORE INTO portfolio_content (id, content) VALUES (1, ?)',
    [JSON.stringify(DEFAULT_CONTENT)],
  )

  if (contentInsert.affectedRows > 0) {
    for (const project of DEFAULT_PROJECTS) {
      await pool.query(
        `INSERT INTO projects (id, title, description, image, technologies, live_url, source_url, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          project.title,
          project.description,
          project.image,
          JSON.stringify(project.technologies),
          project.liveUrl,
          project.sourceUrl,
          project.featured,
        ],
      )
    }
  }

  // Idempotent migration: add photo_url column to profile if it doesn't exist
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'profile' AND COLUMN_NAME = 'photo_url'`
  )
  if (cols.length === 0) {
    await pool.query(`ALTER TABLE profile ADD COLUMN photo_url VARCHAR(500) DEFAULT NULL`)
  }

  const [rows] = await pool.query('SELECT id FROM admin_users WHERE username = ? LIMIT 1', ['admin'])
  if (rows.length === 0) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await pool.query('INSERT INTO admin_users (username, password) VALUES (?, ?)', ['admin', hashedPassword])
  }

  const [profileRows] = await pool.query('SELECT id FROM profile LIMIT 1')
  if (profileRows.length === 0) {
    await pool.query(
      `INSERT INTO profile (name, title, subtitle, intro, email, phone, location, github, linkedin, instagram, youtube, telegram)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Bonsa Muluneh',
        'Computer Science Student',
        'Aspiring Software Developer',
        "I'm a Computer Science student at Haramaya University, passionate about software development, web technologies, databases, and building practical solutions to real-world problems.",
        'bonsamuluneh@gmail.com',
        '+251929495184',
        'Ethiopia',
        'https://github.com/bonsa123',
        'https://www.linkedin.com/in/bonsa-muluneh-214335422/',
        'https://www.instagram.com/bosono12/',
        'https://www.youtube.com/@BonsaMuluneh',
        'https://t.me/Gonna_be_better',
      ],
    )
  }

  const [categoryRows] = await pool.query('SELECT id FROM skill_categories LIMIT 1')
  if (categoryRows.length === 0) {
    const defaults = [
      ['Programming Languages', 'Code2'],
      ['Frontend Development', 'Monitor'],
      ['Backend Development', 'Server'],
      ['Databases', 'Database'],
      ['Tools & Other', 'Wrench'],
    ]

    for (const [name, icon] of defaults) {
      const [result] = await pool.query('INSERT INTO skill_categories (name, icon, sort_order) VALUES (?, ?, ?)', [name, icon, 0])
      const categoryId = result.insertId

      const skillsForCategory = {
        'Programming Languages': ['Python', 'PHP', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#'],
        'Frontend Development': ['React', 'HTML5', 'CSS3', 'Tailwind CSS'],
        'Backend Development': ['Node.js', 'PHP', 'REST APIs', 'OOP'],
        'Databases': ['MySQL', 'SQL', 'NoSQL', 'Database Design'],
        'Tools & Other': ['Git', 'GitHub', 'VS Code', 'XAMPP', 'Linux'],
      }[name] || []

      for (let i = 0; i < skillsForCategory.length; i++) {
        await pool.query('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)', [categoryId, skillsForCategory[i], i])
      }
    }
  }

  const [educationRows] = await pool.query('SELECT id FROM education LIMIT 1')
  if (educationRows.length === 0) {
    await pool.query(
      `INSERT INTO education (institution, degree, period, description, highlights, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Haramaya University',
        'Bachelor of Science in Computer Science',
        '2022 — 2026 (Expected)',
        'Studying core CS fundamentals including algorithms, data structures, software engineering, databases, and operating systems.',
        JSON.stringify(['Software Engineering', 'Database Systems', 'Data Structures & Algorithms', 'Web Development', 'Object-Oriented Programming']),
        0,
      ],
    )
  }

  const [certRows] = await pool.query('SELECT id FROM certificates LIMIT 1')
  if (certRows.length === 0) {
    for (const cert of DEFAULT_CERTIFICATES) {
      await pool.query(
        `INSERT INTO certificates (id, title, issuer, issue_date, credential_url, credential_id, image, skills, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          cert.title,
          cert.issuer,
          cert.issueDate,
          cert.credentialUrl,
          cert.credentialId,
          cert.image,
          JSON.stringify(cert.skills),
          0,
        ],
      )
    }
  }
}

const app = express()
// NOTE: express.json() is intentionally NOT global — it's applied per-route below,
// so that the multipart /api/upload-photo route receives raw stream from req.
app.use('/uploads', express.static(UPLOADS_DIR))

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// JSON body parser for all routes EXCEPT multipart uploads
app.use((req, res, next) => {
  if (req.path === '/api/upload-photo') return next()
  express.json()(req, res, next)
})

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Portfolio API is running' })
})

app.post('/api/admin/login', async (req, res) => {
  const { password } = req.body || {}

  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' })
  }

  try {
    const [rows] = await pool.query('SELECT password FROM admin_users WHERE username = ? LIMIT 1', ['admin'])

    if (!rows || rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid password' })
    }

    const isValid = await bcrypt.compare(password, rows[0].password)
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' })
    }

    return res.json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' })
  }
})

app.get('/api/profile', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1')
    if (!rows.length) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json(mapProfileRow(rows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to load profile' })
  }
})

app.put('/api/profile', async (req, res) => {
  const { name, title, subtitle, intro, email, phone, location, github, linkedin, instagram, youtube, telegram } = req.body || {}

  try {
    const [rows] = await pool.query('SELECT * FROM profile ORDER BY id DESC LIMIT 1')
    if (!rows.length) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    await pool.query(
      `UPDATE profile SET
        name = ?, title = ?, subtitle = ?, intro = ?, email = ?, phone = ?, location = ?,
        github = ?, linkedin = ?, instagram = ?, youtube = ?, telegram = ?
       WHERE id = ?`,
      [
        name ?? rows[0].name,
        title ?? rows[0].title,
        subtitle ?? rows[0].subtitle,
        intro ?? rows[0].intro,
        email ?? rows[0].email,
        phone ?? rows[0].phone,
        location ?? rows[0].location,
        github ?? rows[0].github,
        linkedin ?? rows[0].linkedin,
        instagram ?? rows[0].instagram,
        youtube ?? rows[0].youtube,
        telegram ?? rows[0].telegram,
        rows[0].id,
      ],
    )

    const [updatedRows] = await pool.query('SELECT * FROM profile WHERE id = ? LIMIT 1', [rows[0].id])
    res.json(mapProfileRow(updatedRows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' })
  }
})

app.get('/api/content', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT content FROM portfolio_content WHERE id = 1 LIMIT 1')
    res.json(mapPortfolioContent(rows[0]?.content))
  } catch (error) {
    console.error('Failed to load portfolio content:', error)
    res.status(500).json({ message: 'Failed to load portfolio content' })
  }
})

app.put('/api/content', async (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ message: 'Portfolio content must be an object.' })
  }

  const content = mapPortfolioContent(req.body)
  try {
    await pool.query(
      'INSERT INTO portfolio_content (id, content) VALUES (1, ?) ON DUPLICATE KEY UPDATE content = VALUES(content)',
      [JSON.stringify(content)],
    )
    res.json(content)
  } catch (error) {
    console.error('Failed to save portfolio content:', error)
    res.status(500).json({ message: 'Failed to save portfolio content' })
  }
})

// Upload profile photo — busboy-based, Express 5 compatible
const handleImageUpload = (req, res, updateProfile) => {
  const contentType = req.headers['content-type'] || ''
  if (!contentType.includes('multipart/form-data')) {
    return res.status(400).json({ message: 'Expected multipart/form-data' })
  }

  let fileCount = 0
  let rejected = false
  let uploadError = null
  let savedPath = ''
  let savedFilename = ''
  const fileWrites = []

  try {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: 5 * 1024 * 1024, files: 1 } })

    bb.on('file', (fieldname, stream, info) => {
      fileCount += 1
      const { filename, mimeType } = info
      const mimeToExt = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
        'image/gif': '.gif',
      }
      const extToExt = { '.jpg': '.jpg', '.jpeg': '.jpg', '.png': '.png', '.webp': '.webp', '.gif': '.gif' }
      const ext = mimeToExt[mimeType.toLowerCase()]
        || (mimeType === 'application/octet-stream' ? extToExt[path.extname(filename || '').toLowerCase()] : null)

      if (fieldname !== 'photo' || fileCount > 1 || !ext) {
        rejected = true
        stream.resume()
        return
      }

      savedFilename = `photo-${randomUUID()}${ext}`
      savedPath = path.join(UPLOADS_DIR, savedFilename)
      stream.on('limit', () => { rejected = true })
      fileWrites.push(
        pipeline(stream, fs.createWriteStream(savedPath, { flags: 'wx' }))
          .then(() => {
            if (stream.truncated) rejected = true
          })
          .catch((error) => { uploadError = error }),
      )
    })

    bb.on('finish', async () => {
      try {
        await Promise.all(fileWrites)
        if (uploadError) throw uploadError
        if (rejected || fileCount !== 1 || !savedFilename) {
          if (savedPath) await fs.promises.unlink(savedPath).catch((error) => {
            if (error.code !== 'ENOENT') console.error('Failed to remove rejected photo upload:', error)
          })
          return res.status(400).json({ message: 'Upload one valid image file under 5 MB' })
        }

        const photoUrl = `/uploads/${savedFilename}`
        if (updateProfile) {
          const [rows] = await pool.query('SELECT id FROM profile ORDER BY id DESC LIMIT 1')
          if (!rows.length) {
            await fs.promises.unlink(savedPath)
            return res.status(404).json({ message: 'Profile not found' })
          }
          await pool.query('UPDATE profile SET photo_url = ? WHERE id = ?', [photoUrl, rows[0].id])
        }
        res.json({ photoUrl })
      } catch (error) {
        console.error('Photo upload failed:', error)
        if (savedPath) await fs.promises.unlink(savedPath).catch((cleanupError) => {
          if (cleanupError.code !== 'ENOENT') console.error('Failed to remove incomplete photo upload:', cleanupError)
        })
        if (!res.headersSent) res.status(500).json({ message: 'Failed to save uploaded photo' })
      }
    })

    bb.on('error', (err) => {
      console.error('Could not parse photo upload:', err)
      if (!res.headersSent) res.status(400).json({ message: 'Could not process photo upload' })
    })
    bb.on('filesLimit', () => { rejected = true })

    req.pipe(bb)
  } catch (err) {
    res.status(500).json({ message: 'Failed to process upload' })
  }
}

app.post('/api/upload-photo', (req, res) => handleImageUpload(req, res, true))
app.post('/api/upload-image', (req, res) => handleImageUpload(req, res, false))

app.get('/api/skill-categories', async (req, res) => {
  try {
    const [categoryRows] = await pool.query('SELECT * FROM skill_categories ORDER BY sort_order ASC, id ASC')
    const categories = []

    for (const categoryRow of categoryRows) {
      const [skillsRows] = await pool.query('SELECT * FROM skills WHERE category_id = ? ORDER BY sort_order ASC, id ASC', [categoryRow.id])
      categories.push(mapSkillCategoryRow(categoryRow, skillsRows))
    }

    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Failed to load skills' })
  }
})

app.post('/api/skill-categories', async (req, res) => {
  const { name, icon } = req.body || {}
  if (!name || !icon) {
    return res.status(400).json({ message: 'Category name and icon are required.' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO skill_categories (name, icon, sort_order) VALUES (?, ?, ?)',
      [String(name).trim(), String(icon).trim(), 0],
    )
    const [rows] = await pool.query('SELECT * FROM skill_categories WHERE id = ? LIMIT 1', [result.insertId])
    res.status(201).json(mapSkillCategoryRow(rows[0], []))
  } catch (error) {
    res.status(500).json({ message: 'Failed to create skill category' })
  }
})

app.put('/api/skill-categories/:id', async (req, res) => {
  const { name, icon } = req.body || {}
  if (!name || !icon) {
    return res.status(400).json({ message: 'Category name and icon are required.' })
  }

  try {
    const [result] = await pool.query(
      'UPDATE skill_categories SET name = ?, icon = ? WHERE id = ?',
      [String(name).trim(), String(icon).trim(), req.params.id],
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill category not found' })
    }
    const [rows] = await pool.query('SELECT * FROM skill_categories WHERE id = ? LIMIT 1', [req.params.id])
    const [skills] = await pool.query(
      'SELECT * FROM skills WHERE category_id = ? ORDER BY sort_order ASC, id ASC',
      [req.params.id],
    )
    res.json(mapSkillCategoryRow(rows[0], skills))
  } catch (error) {
    console.error('Failed to update skill category:', error)
    res.status(500).json({ message: 'Failed to update skill category' })
  }
})

app.delete('/api/skill-categories/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM skill_categories WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill category not found' })
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to delete skill category:', error)
    res.status(500).json({ message: 'Failed to delete skill category' })
  }
})

app.post('/api/skills', async (req, res) => {
  const { categoryId, name } = req.body || {}
  if (!categoryId || !name) {
    return res.status(400).json({ message: 'Category and skill name are required.' })
  }

  try {
    const [result] = await pool.query('INSERT INTO skills (category_id, name, sort_order) VALUES (?, ?, ?)', [categoryId, String(name).trim(), 0])
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ? LIMIT 1', [result.insertId])
    res.status(201).json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Failed to add skill' })
  }
})

app.delete('/api/skills/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM skills WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Skill not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill' })
  }
})

app.get('/api/education', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM education ORDER BY sort_order ASC, id ASC')
    res.json(rows.map(mapEducationRow))
  } catch (error) {
    res.status(500).json({ message: 'Failed to load education' })
  }
})

app.post('/api/education', async (req, res) => {
  const { institution, degree, period, description, highlights } = req.body || {}
  if (!institution || !degree || !period) {
    return res.status(400).json({ message: 'Institution, degree, and period are required.' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO education (institution, degree, period, description, highlights, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [String(institution).trim(), String(degree).trim(), String(period).trim(), String(description || ''), JSON.stringify(highlights || []), 0],
    )
    const [rows] = await pool.query('SELECT * FROM education WHERE id = ? LIMIT 1', [result.insertId])
    res.status(201).json(mapEducationRow(rows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to create education entry' })
  }
})

app.put('/api/education/:id', async (req, res) => {
  const { institution, degree, period, description, highlights } = req.body || {}

  try {
    const [rows] = await pool.query('SELECT * FROM education WHERE id = ? LIMIT 1', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Education entry not found' })
    }

    await pool.query(
      'UPDATE education SET institution = ?, degree = ?, period = ?, description = ?, highlights = ? WHERE id = ?',
      [
        institution ?? rows[0].institution,
        degree ?? rows[0].degree,
        period ?? rows[0].period,
        description ?? rows[0].description,
        highlights !== undefined ? JSON.stringify(highlights) : rows[0].highlights,
        req.params.id,
      ],
    )

    const [updatedRows] = await pool.query('SELECT * FROM education WHERE id = ? LIMIT 1', [req.params.id])
    res.json(mapEducationRow(updatedRows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to update education entry' })
  }
})

app.delete('/api/education/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM education WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Education entry not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete education entry' })
  }
})

app.get('/api/certificates', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificates ORDER BY sort_order ASC, created_at DESC')
    res.json(rows.map(mapCertificateRow))
  } catch (error) {
    res.status(500).json({ message: 'Failed to load certificates' })
  }
})

app.post('/api/certificates', async (req, res) => {
  const { title, issuer, issueDate, credentialUrl = '', credentialId = '', image = '', skills = [] } = req.body || {}
  if (!title || !issuer) {
    return res.status(400).json({ message: 'Title and issuer are required.' })
  }

  const id = randomUUID()
  try {
    const skillsJson = JSON.stringify(
      Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()).filter(Boolean),
    )
    await pool.query(
      `INSERT INTO certificates (id, title, issuer, issue_date, credential_url, credential_id, image, skills, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        String(title).trim(),
        String(issuer).trim(),
        String(issueDate || '').trim(),
        String(credentialUrl || '').trim(),
        String(credentialId || '').trim(),
        String(image || '').trim(),
        skillsJson,
        0,
      ],
    )
    const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ? LIMIT 1', [id])
    res.status(201).json(mapCertificateRow(rows[0]))
  } catch (error) {
    console.error('Failed to create certificate:', error)
    res.status(500).json({ message: 'Failed to create certificate' })
  }
})

app.put('/api/certificates/:id', async (req, res) => {
  const { title, issuer, issueDate, credentialUrl, credentialId, image, skills } = req.body || {}
  try {
    const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ? LIMIT 1', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Certificate not found' })
    }

    const current = rows[0]
    const skillsJson =
      skills !== undefined
        ? JSON.stringify(
            Array.isArray(skills) ? skills : String(skills).split(',').map((s) => s.trim()).filter(Boolean),
          )
        : current.skills

    await pool.query(
      `UPDATE certificates SET
        title = ?, issuer = ?, issue_date = ?, credential_url = ?, credential_id = ?, image = ?, skills = ?
       WHERE id = ?`,
      [
        title ?? current.title,
        issuer ?? current.issuer,
        issueDate ?? current.issue_date,
        credentialUrl ?? current.credential_url,
        credentialId ?? current.credential_id,
        image ?? current.image,
        skillsJson,
        req.params.id,
      ],
    )
    const [updatedRows] = await pool.query('SELECT * FROM certificates WHERE id = ? LIMIT 1', [req.params.id])
    res.json(mapCertificateRow(updatedRows[0]))
  } catch (error) {
    console.error('Failed to update certificate:', error)
    res.status(500).json({ message: 'Failed to update certificate' })
  }
})

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM certificates WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Certificate not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete certificate' })
  }
})

app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, image, technologies, live_url, source_url, featured FROM projects ORDER BY created_at DESC',
    )
    res.json(rows.map(mapProjectRow))
  } catch (error) {
    res.status(500).json({ message: 'Failed to load projects' })
  }
})

app.post('/api/projects', async (req, res) => {
  const { title, description, image = '', technologies = [], liveUrl = '', sourceUrl = '', featured = false } = req.body || {}

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' })
  }

  const id = randomUUID()

  try {
    await pool.query(
      'INSERT INTO projects (id, title, description, image, technologies, live_url, source_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, String(title).trim(), String(description).trim(), String(image), JSON.stringify(technologies), String(liveUrl), String(sourceUrl), Boolean(featured)],
    )

    const [rows] = await pool.query('SELECT id, title, description, image, technologies, live_url, source_url, featured FROM projects WHERE id = ? LIMIT 1', [id])
    res.status(201).json(mapProjectRow(rows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project' })
  }
})

app.put('/api/projects/:id', async (req, res) => {
  const { title, description, image, technologies, liveUrl, sourceUrl, featured } = req.body || {}

  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ? LIMIT 1', [req.params.id])
    if (!rows.length) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const current = rows[0]
    await pool.query(
      'UPDATE projects SET title = ?, description = ?, image = ?, technologies = ?, live_url = ?, source_url = ?, featured = ? WHERE id = ?',
      [
        title ?? current.title,
        description ?? current.description,
        image ?? current.image,
        technologies !== undefined ? JSON.stringify(technologies) : current.technologies,
        liveUrl ?? current.live_url,
        sourceUrl ?? current.source_url,
        featured ?? current.featured,
        req.params.id,
      ],
    )

    const [updatedRows] = await pool.query('SELECT id, title, description, image, technologies, live_url, source_url, featured FROM projects WHERE id = ? LIMIT 1', [req.params.id])
    res.json(mapProjectRow(updatedRows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project' })
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project' })
  }
})

app.get('/api/contact', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC')
    res.json(rows.map(mapContactRow))
  } catch (error) {
    res.status(500).json({ message: 'Failed to load contact messages' })
  }
})

app.delete('/api/contact/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact message not found' })
    }
    res.json({ success: true })
  } catch (error) {
    console.error('Failed to delete contact message:', error)
    res.status(500).json({ message: 'Failed to delete contact message' })
  }
})

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' })
  }

  const id = randomUUID()

  try {
    await pool.query(
      'INSERT INTO contact_messages (id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [id, String(name).trim(), String(email).trim(), String(subject || 'General Inquiry').trim(), String(message).trim()],
    )

    const [rows] = await pool.query('SELECT * FROM contact_messages WHERE id = ? LIMIT 1', [id])
    res.status(201).json(mapContactRow(rows[0]))
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' })
  }
})

// Serve static frontend build if present (for single-service deployment)
const DIST_DIR = path.join(__dirname, '..', 'dist')
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next()
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

ensureDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Portfolio API running on port ${PORT}`)
      console.log(`   Admin password: ${ADMIN_PASSWORD}\n`)
    })
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  })
    console.error('Failed to initialize database:', error)
    process.exit(1)
  })
