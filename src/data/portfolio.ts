export const personalInfo = {
  name: 'Bonsa Muluneh',
  title: 'Computer Science Student',
  subtitle: 'Aspiring Software Developer',
  intro:
    'I study Computer Science at Haramaya University and enjoy building web applications. I work with technologies such as PHP, MySQL, JavaScript, and Node.js, turning ideas into practical projects.',
  about: [
    "I'm currently pursuing my Bachelor's degree in Computer Science at Haramaya University, where I'm developing a strong foundation in programming, algorithms, data structures, and software engineering principles.",
    'I enjoy building real-world applications that solve meaningful problems. My main project, the Gindo Student Registration System, gave me hands-on experience with full-stack web development using PHP and MySQL.',
    "I'm continuously expanding my skills across multiple programming languages and technologies. I believe in writing clean, maintainable code and learning something new every day.",
  ],
  email: 'bonsamuluneh7@gmail.com',
  phone: '+251929495184',
  location: 'Ethiopia',
  photoUrl: '/uploads/photo-5cae6726-7aee-40fc-a1b6-d328df02f70e.png',
  resumeUrl: '/resume.pdf',
  social: {
    github: 'https://github.com/bonsa123',
    linkedin: 'https://www.linkedin.com/in/bonsa-muluneh-214335422/',
    instagram: 'https://www.instagram.com/bosono12/',
    youtube: 'https://www.youtube.com/@BonsaMuluneh',
    telegram: 'https://t.me/Gonna_be_better',
  },
}

export type ProfileData = typeof personalInfo

export const skillCategories = [
  {
    id: 'languages',
    label: 'Programming Languages',
    icon: 'Code2',
    skills: ['Python', 'PHP', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#'],
  },
  {
    id: 'frontend',
    label: 'Frontend Development',
    icon: 'Monitor',
    skills: ['React', 'HTML5', 'CSS3', 'Tailwind CSS'],
  },
  {
    id: 'backend',
    label: 'Backend Development',
    icon: 'Server',
    skills: ['Node.js', 'PHP', 'REST APIs', 'OOP'],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: 'Database',
    skills: ['MySQL', 'SQL', 'NoSQL', 'Database Design'],
  },
  {
    id: 'tools',
    label: 'Tools & Other',
    icon: 'Wrench',
    skills: ['Git', 'GitHub', 'VS Code', 'XAMPP', 'Linux'],
  },
]

export const education = [
  {
    id: 'haramaya',
    institution: 'Haramaya University',
    degree: 'Bachelor of Science in Computer Science',
    period: '2022 — 2026 (Expected)',
    description:
      'Studying core CS fundamentals including algorithms, data structures, software engineering, databases, and operating systems.',
    highlights: [
      'Software Engineering',
      'Database Systems',
      'Data Structures & Algorithms',
      'Web Development',
      'Object-Oriented Programming',
    ],
  },
]

export const defaultCertificates = [
  {
    id: '1',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Coursera / Meta',
    issueDate: '2024',
    credentialUrl: 'https://coursera.org',
    credentialId: 'META-FE-892401',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    skills: ['React', 'JavaScript', 'HTML5 & CSS3', 'UI/UX Design', 'Version Control'],
  },
  {
    id: '2',
    title: 'Problem Solving & SQL Certification',
    issuer: 'HackerRank',
    issueDate: '2023',
    credentialUrl: 'https://hackerrank.com',
    credentialId: 'HR-SQL-PS-55421',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    skills: ['SQL', 'Relational Databases', 'Algorithms', 'Data Structures'],
  },
  {
    id: '3',
    title: 'Responsive Web Design & Full Stack Foundations',
    issuer: 'freeCodeCamp',
    issueDate: '2023',
    credentialUrl: 'https://freecodecamp.org',
    credentialId: 'FCC-RWD-77189',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    skills: ['Web Design', 'Responsive CSS', 'Flexbox/Grid', 'Accessibility'],
  },
]

export const defaultProjects = [
  {
    id: '1',
    title: 'Gindo Student Registration System',
    category: 'Full-Stack',
    description:
      'A full-stack web application automating student registration, course enrollment, and academic record tracking with role-based access.',
    longDescription:
      'Designed and built to replace slow, error-prone manual paper-based registration. Features real-time validation, student enrollment verification, course capacity management, and comprehensive administrative reporting dashboards.',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3'],
    role: 'Full-Stack Developer & Database Architect',
    highlights: [
      'Engineered relational database schema in MySQL with indexed foreign keys and ACID-compliant transactions',
      'Built secure role-based authentication (Admin, Registrar, Student) with hashed passwords and session management',
      'Implemented dynamic search, filtering, and exportable student grade & enrollment reports',
      'Streamlined registration turnaround time by over 70% during peak academic enrollment periods',
    ],
    challenges:
      'Handling concurrent registrations during peak intake periods without race conditions or duplicate ID generation; solved with MySQL transactional locks and strict input validation.',
    liveUrl: '',
    sourceUrl: 'https://github.com/bonsa123',
    featured: true,
  },
  {
    id: '2',
    title: 'CampusConnect — Resource & Notice Hub',
    category: 'Full-Stack',
    description:
      'A modern campus communication platform enabling faculty and students to exchange department announcements and course materials.',
    longDescription:
      'Built to unify scattered communication channels across campus departments. Features categorized announcement streams, syllabus downloads, course schedule updates, and interactive student inquiry boards.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'MySQL'],
    role: 'Full-Stack Developer',
    highlights: [
      'Engineered RESTful API in Express with JWT authentication and file upload handling',
      'Created responsive React frontend with Tailwind CSS and real-time state management',
      'Implemented categorized announcement streams with instant text search and department tagging',
      'Integrated secure document storage and preview for lecture slides and course notes',
    ],
    challenges:
      'Structuring performant multi-department categorization and efficient file upload streaming with file type validation.',
    liveUrl: '',
    sourceUrl: 'https://github.com/bonsa123',
    featured: true,
  },
  {
    id: '3',
    title: 'Algorithm Visualizer & DSA Workbench',
    category: 'Frontend',
    description:
      'Interactive web tool to visualize sorting algorithms, binary search trees, and graph traversals with adjustable execution speeds.',
    longDescription:
      'Created as both a personal computer science study tool and a learning resource for fellow students to intuitively grasp algorithmic time complexity and data structures in real-time.',
    image: 'https://images.unsplash.com/photo-1516116211227-bbc13c744be6?w=800&q=80',
    technologies: ['TypeScript', 'React', 'Framer Motion', 'Tailwind CSS'],
    role: 'Frontend Developer',
    highlights: [
      'Visualized Bubble, Quick, Merge, and Heap sorts with step-by-step bar state transitions and sound cues',
      'Built interactive Graph DFS and BFS pathfinders with dynamic obstacle generation',
      'Integrated live Big-O time and space complexity explanations for each algorithmic step',
      'Fully responsive and touch-enabled for mobile and desktop screens',
    ],
    challenges:
      'Synchronizing asynchronous state steps with Framer Motion animations while supporting pause, step-forward, and variable speed scrubbing.',
    liveUrl: '',
    sourceUrl: 'https://github.com/bonsa123',
    featured: true,
  },
  {
    id: '4',
    title: 'Secure Auth & RBAC Backend Engine',
    category: 'Backend',
    description:
      'Production-ready Node.js backend boilerplate featuring enterprise authentication, JWT token rotation, and SQL migration pipelines.',
    longDescription:
      'Developed to provide a production-ready starting foundation for full-stack systems. Implements industry best practices in API security, input sanitization, rate-limiting, and database seeding.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    technologies: ['Node.js', 'Express', 'MySQL', 'JWT', 'bcrypt', 'REST APIs'],
    role: 'Backend Developer',
    highlights: [
      'Implemented access & refresh token rotation with secure HTTP-only cookies',
      'Integrated automated schema migrations, foreign key constraints, and relational queries',
      'Configured Helmet, CORS policies, rate limiting, and input sanitization to block SQL injection and XSS',
      'Comprehensive endpoint documentation and ready-to-test Postman collection',
    ],
    challenges:
      'Designing a clean middleware pipeline for dynamic permission checking across hierarchical role structures.',
    liveUrl: '',
    sourceUrl: 'https://github.com/bonsa123',
    featured: false,
  },
]

export const defaultPortfolioContent = {
  heroGreeting: "It's",
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
  aboutParagraphs: personalInfo.about,
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
