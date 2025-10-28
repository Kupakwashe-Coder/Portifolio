import { useState, useEffect } from 'react';
import { Menu, X, Mail, Github, Linkedin, ExternalLink, Code2, Layout, Zap, Users, RefreshCw, Sun } from 'lucide-react';
import resumePdf from './Gwavava Decent.pdf';

type FormspreeError = { message: string };
type FormspreeResponse = {
  errors?: FormspreeError[];
  message?: string;
};

type Project = {
  title: string;
  description: string;
  tech: string[];
  image: string;
  url?: string;
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState<string>('');

  const downloadResume = () => {
    const fileUrl = encodeURI(resumePdf);
    const opened = window.open(fileUrl, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = fileUrl;
    }

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Decent_Gwavava_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setContactStatus('sending');
    setContactMessage('');
    try {
      const formData = new FormData(form);
      const nameValue = String(formData.get('name') || '');
      formData.append('_subject', `Portfolio Contact from ${nameValue}`);

      const resp = await fetch('https://formspree.io/f/xvgvgevq', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });
      const data: FormspreeResponse | null = await resp.json().catch(() => null);
      if (resp.ok) {
        setContactStatus('success');
        setContactMessage('Thanks! Your message has been sent.');
        form.reset();
      } else {
        setContactStatus('error');
        const detail = data?.errors?.map((e) => e.message).join(' ') || data?.message || `Request failed (${resp.status}).`;
        setContactMessage(detail);
      }
    } catch {
      setContactStatus('error');
      setContactMessage('Network error. Please check your connection and try again.');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll('section[id]');
      const newVisible = new Set<string>();

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          newVisible.add(section.id);
        }
      });

      setVisibleSections(newVisible);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  

  const techs = [
    'JavaScript',
    'TypeScript',
    'React',
    'Tailwind CSS',
    'HTML/CSS',
    'Git',
    'SQL',
    'Python',
  ];

  const strengths = [
    {
      title: 'Clean Code',
      desc: 'Writing maintainable, scalable, and well-documented code',
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'UI/UX Focus',
      desc: 'Creating beautiful interfaces with excellent user experience',
      icon: <Layout className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Performance',
      desc: 'Optimizing applications for speed and efficiency',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Collaboration',
      desc: 'Working effectively in team environments and Agile workflows',
      icon: <Users className="w-5 h-5 text-emerald-400" />,
    },
  ];

  const projects: Project[] = [
    {
      title: 'E-Learning Platform',
      description: 'A full-stack e-learning platform with user authentication, course catalog, interactive lessons, quizzes, and progress tracking.',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://e-learning-psi-azure.vercel.app/'
    },
    {
      title: 'AI Resume Parser',
      description: 'An AI-powered resume parser that extracts key details (skills, experience, education) from PDFs and DOCX files with smart scoring.',
      tech: ['React', 'Node.js', 'NLP', 'PDF Parsing'],
      image: 'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://ultimate-project-izoa.vercel.app/'
    },
    {
      title: 'Smart Notes',
      description: 'A modern note-taking app with fast search, tagging, and clean UX for organizing thoughts and tasks.',
      tech: ['React', 'Tailwind CSS', 'Local Storage'],
      image: 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=800',
      url: 'https://takunda-smarta.vercel.app/'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        role="navigation"
        aria-label="Primary"
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/70 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60 border-b border-slate-800'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-white">
              <span className="text-amber-400">D</span>ecent<span className="text-amber-400">.</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['home', 'about', 'skills', 'projects', 'contact'].map((item) => {
                const isActive = visibleSections.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`focus-ring capitalize font-medium transition-colors duration-300 ${
                      isActive ? 'text-amber-400' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={downloadResume}
                className="ml-4 inline-flex items-center px-4 py-2 rounded-lg border-2 border-amber-400 text-amber-400 font-semibold hover:bg-amber-400 hover:text-slate-900 transition-colors focus-ring"
              >
                Resume
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white focus-ring"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              {['home', 'about', 'skills', 'projects', 'contact'].map((item) => {
                const isActive = visibleSections.has(item);
                return (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`block w-full text-left focus-ring capitalize font-medium transition-colors duration-300 ${
                      isActive ? 'text-amber-400' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={downloadResume}
                className="block w-full text-center mt-2 px-4 py-3 rounded-lg border-2 border-amber-400 text-amber-400 font-semibold hover:bg-amber-400 hover:text-slate-900 transition-colors focus-ring"
              >
                Download Resume
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-5 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Hi, I'm <span className="text-amber-400">Decent Gwavava</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
              A Passionate Software Developer Shaping Digital Experiences
            </p>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Turning Code into Impact — Building the Future, One Line at a Time
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="focus-ring px-8 py-4 bg-amber-400 text-slate-900 rounded-lg font-semibold hover:bg-amber-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-400/50"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="focus-ring px-8 py-4 border-2 border-amber-400 text-amber-400 rounded-lg font-semibold hover:bg-amber-400 hover:text-slate-900 transform hover:scale-105 transition-all duration-300"
              >
                Hire Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
              About <span className="text-amber-400">Me</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  I'm an ambitious software developer currently studying at <span className="font-semibold text-slate-900">Uncommon.Org</span>, where I'm developing strong skills in front-end and back-end development, problem-solving, and modern software technologies.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  My passion lies in building efficient, user-friendly, and impactful digital solutions that solve real-world problems. I believe technology has the power to transform lives, and I'm committed to being part of that transformation.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-6">
                  {[
                    { label: 'Teamwork', icon: <Users className="w-5 h-5 text-slate-700" /> },
                    { label: 'Adaptability', icon: <RefreshCw className="w-5 h-5 text-slate-700" /> },
                    { label: 'Coding Efficiency', icon: <Zap className="w-5 h-5 text-slate-700" /> },
                    { label: 'Creativity', icon: <Sun className="w-5 h-5 text-slate-700" /> },
                  ].map((strength) => (
                    <div key={strength.label} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200">
                        {strength.icon}
                      </span>
                      <span className="font-medium text-slate-900">{strength.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center">
                    <img
                      src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
                      alt="Developer workspace"
                      className="w-full h-full object-cover rounded-2xl opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-700 ${visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Skills & Technologies Panel */}
              <div className="rounded-2xl border border-slate-700/70 bg-slate-800/30 p-6 md:p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Skills <span className="text-amber-400">& Technologies</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {techs.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-slate-700/70 bg-slate-800/40 text-slate-100 text-sm font-medium shadow-sm hover:bg-slate-800/70 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* What I Bring Panel */}
              <div className="rounded-2xl border border-slate-700/70 bg-slate-800/30 p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">What I Bring</h3>
                <div className="space-y-4">
                  {strengths.map((s, i) => (
                    <div
                      key={s.title}
                      className="rounded-xl border border-slate-700 bg-slate-800/50 p-5 flex items-start gap-4 hover:bg-slate-800/70 transition-colors"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                        {s.icon}
                      </div>
                      <div>
                        <p className="text-white font-semibold leading-none">{s.title}</p>
                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
              Featured <span className="text-amber-400">Projects</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-amber-400 font-semibold hover:text-amber-500 transition-colors group focus-ring"
                      >
                        View Project
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <button className="flex items-center text-amber-400 font-semibold hover:text-amber-500 transition-colors group">
                        View Project
                        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center">
            Education & <span className="text-amber-400">Experience</span>
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-row flex-wrap gap-6 justify-center">
              <div className="flex-1 min-w-[320px] md:min-w-[420px]">
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-amber-400 h-full animate-rise transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ animationDelay: '0ms' }}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-amber-400 rounded-lg flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-slate-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Software Developer Student</h3>
                      <p className="text-amber-600 font-semibold mb-3">Uncommon.Org</p>
                      <p className="text-gray-700 leading-relaxed">
                        Currently pursuing comprehensive training in software development, focusing on modern web technologies,
                        full-stack development, and industry best practices. Gaining hands-on experience with real-world projects
                        and collaborative development workflows.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Full-Stack Development</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Problem Solving</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Agile Methodology</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[320px] md:min-w-[420px]">
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-emerald-500 h-full animate-rise transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ animationDelay: '120ms' }}>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Volunteer Scratch Instructor</h3>
                      <p className="text-emerald-600 font-semibold mb-3">Community Outreach</p>
                      <p className="text-gray-700 leading-relaxed">
                        Volunteering as a Scratch Instructor, teaching school children and young adults how to code through Scratch
                        coding, fostering problem-solving and creativity.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Scratch</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Teaching</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Mentorship</span>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">Community</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Get In <span className="text-amber-400">Touch</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  I'm currently open to new opportunities and collaborations. Whether you have a project in mind,
                  want to discuss technology, or just want to connect, feel free to reach out!
                </p>
                <div className="space-y-4">
                  <a href="mailto:kupakwashegwavava@gmail.com" className="focus-ring flex items-center space-x-4 text-gray-300 hover:text-amber-400 transition-colors group">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                      <Mail className="w-6 h-6 group-hover:text-slate-900" />
                    </div>
                    <span className="font-medium">kupakwashegwavava@gmail.com</span>
                  </a>
                  <a href="https://github.com/decentKG" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center space-x-4 text-gray-300 hover:text-amber-400 transition-colors group">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                      <Github className="w-6 h-6 group-hover:text-slate-900" />
                    </div>
                    <span className="font-medium">github.com/decentKG</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center space-x-4 text-gray-300 hover:text-amber-400 transition-colors group">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-amber-400 transition-colors">
                      <Linkedin className="w-6 h-6 group-hover:text-slate-900" />
                    </div>
                    <span className="font-medium">linkedin.com/in/decentgwavava</span>
                  </a>
                </div>
              </div>
              <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="contact-name" className="block text-gray-300 mb-2 font-medium">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="focus-ring w-full px-4 py-3 bg-slate-900/40 text-white placeholder-slate-400 rounded-lg border border-slate-700/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="Your name"
                    required
                    name="name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-gray-300 mb-2 font-medium">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="focus-ring w-full px-4 py-3 bg-slate-900/40 text-white placeholder-slate-400 rounded-lg border border-slate-700/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                    placeholder="your.email@example.com"
                    required
                    name="email"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-gray-300 mb-2 font-medium">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    className="focus-ring w-full px-4 py-3 bg-slate-900/40 text-white placeholder-slate-400 rounded-lg border border-slate-700/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
                    placeholder="Your message..."
                    required
                    name="message"
                  ></textarea>
                </div>
                <button type="submit" disabled={contactStatus==='sending'} className="focus-ring w-full px-8 py-4 bg-amber-400 text-slate-900 rounded-lg font-semibold hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-400/50">
                  {contactStatus==='sending' ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus==='success' && (
                  <p className="text-emerald-500 text-sm mt-2">{contactMessage || 'Thanks! Your message has been sent.'}</p>
                )}
                {contactStatus==='error' && (
                  <p className="text-red-500 text-sm mt-2">{contactMessage || 'Something went wrong. Please try again later.'}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Decent Gwavava. Turning Code into Impact.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
