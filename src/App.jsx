import React, { useState } from 'react';
import {
  Compass,
  Cpu,
  Globe2,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  ArrowUpRight,
  Linkedin,
  Github,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
  Code2,
  BookOpen,
  Building2,
  ChevronRight,
  X,
} from 'lucide-react';
import Navbar from './components/Navbar';
import FlockLogoCanvas from './components/FlockLogoCanvas';
import { VISION_PILLARS, EVENTS_GALLERY, OFFICE_BEARERS } from './data/csaData';

const GALLERY_CATEGORIES = ['All', 'Hackathon', 'Symposium', 'Competition', 'Workshop', 'Networking', 'CSR Outreach'];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeEventModal, setActiveEventModal] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Partnership / Event Sponsorship',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredEvents =
    selectedCategory === 'All'
      ? EVENTS_GALLERY
      : EVENTS_GALLERY.filter((ev) => ev.category === selectedCategory);

  const patronBearer = OFFICE_BEARERS.find((b) => b.tier === 'patron');
  const executiveBearers = OFFICE_BEARERS.filter((b) => b.tier === 'executive');
  const committeeBearers = OFFICE_BEARERS.filter((b) => b.tier === 'committee');

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setContactForm({
        name: '',
        email: '',
        subject: 'Partnership / Event Sponsorship',
        message: '',
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white relative selection:bg-sky-400/30 selection:text-sky-100">
      {/* Subtle Architectural Grid Overlay & Radial Ambient Lights */}
      <div className="fixed inset-0 bg-grid-navy pointer-events-none z-0" />
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-sky-500/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <Navbar />

      {/* =====================================================================
          HERO SECTION WITH CENTERED SEAMLESS FLOCK-OF-BIRDS -> CSA ANIMATION
      ===================================================================== */}
      <section
        id="home"
        className="relative z-10 min-h-screen pt-24 pb-16 md:pt-28 md:pb-24 flex flex-col items-center justify-center overflow-hidden border-b border-white/5"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* University Affiliation Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-navy-900/80 border border-sky-400/25 text-xs sm:text-sm text-sky-300 font-medium backdrop-blur-md">
            <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Faculty of Applied Sciences • University of Sri Jayewardenepura</span>
          </div>

          {/* Seamless, Full-Width Centered Bird Flock -> CSA Animation Stage */}
          <div className="w-full -my-2 sm:-my-4">
            <FlockLogoCanvas />
          </div>

          {/* Centered Title & Subtitle Integrated Directly Below the Formed CSA Flock */}
          <div className="max-w-3xl mx-auto space-y-5">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              <span className="text-white">Computer Science</span>{' '}
              <span className="text-gradient-cyan">Association</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
              The official undergraduate technological community of the Department of Computer Science at the{' '}
              <span className="text-white font-medium">University of Sri Jayewardenepura</span>. Uniting algorithms, research, and collective intelligence to engineer tomorrow.
            </p>

            {/* Centered Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
              <a
                href="#vision"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-navy-950 font-semibold text-sm hover:bg-sky-300 transition-all shadow-xl shadow-white/10"
              >
                <span>Explore Our Vision</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-navy-900/80 text-white font-medium text-sm border border-white/15 hover:border-sky-400/50 hover:bg-navy-800/80 transition-all"
              >
                <span>Event Gallery</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          OUR VISION & MISSION SECTION
      ===================================================================== */}
      <section id="vision" className="relative z-10 py-24 md:py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
              <Compass className="w-4 h-4" />
              <span>01 // Association Philosophy</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Our Vision as an Association
            </h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
              Rooted in the academic heritage of the University of Sri Jayewardenepura, CSA bridges rigorous computer science theory with modern engineering leadership.
            </p>
          </div>

          {/* Primary Vision & Mission Statement Showcase Card */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-500/15 text-sky-300 border border-sky-400/25">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Vision Statement
                </span>
                <blockquote className="mt-6 font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                  “To be the premier hub of computational excellence, ethical innovation, and technological leadership among Sri Lankan university communities.”
                </blockquote>
                <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  Just as a flock of birds moves in synchronized emergence toward a shared horizon, the Computer Science Association unites diverse minds—researchers, software architects, data scientists, and creators—into one purposeful force.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
                <span>DEPARTMENT OF COMPUTER SCIENCE // FAS</span>
                <span className="text-sky-400">UNIVERSITY OF SRI JAYEWARDENEPURA</span>
              </div>
            </div>

            <div className="lg:col-span-5 glass-card rounded-3xl p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-b from-navy-800/60 to-navy-950/90">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 text-white border border-white/15">
                  Our Core Mission
                </span>
                <h3 className="mt-5 font-display text-xl sm:text-2xl font-bold text-white">
                  Empowering Every Undergraduate to Build Beyond Boundaries
                </h3>
                <ul className="mt-5 space-y-3.5 text-sm text-slate-300">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Foster advanced technical literacy in AI, Distributed Systems, Cybersecurity, and Software Engineering.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Cultivate long-term collaboration between FAS academia, alumni, and global technology enterprises.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>Champion national digital literacy through community outreach and open knowledge sharing.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Est. Department of Computer Science</span>
                <a
                  href="#bearers"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  <span>Meet Leadership</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Three Strategic Pillars */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {VISION_PILLARS.map((pillar, idx) => {
              const IconComponent = idx === 0 ? Cpu : idx === 1 ? Globe2 : Code2;
              return (
                <div
                  key={pillar.id}
                  className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-sky-400 tracking-widest">
                        {pillar.id} // {pillar.tag}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-navy-800 border border-white/10 flex items-center justify-center text-sky-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-mono text-white font-medium">
                      {pillar.metric}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          EVENT GALLERY SECTION
      ===================================================================== */}
      <section id="events" className="relative z-10 py-24 md:py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
                <Calendar className="w-4 h-4" />
                <span>02 // Chronicle of Innovation</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Event Gallery
              </h2>
              <p className="mt-3 text-slate-400 text-base max-w-2xl">
                Highlights from our national hackathons, AI symposiums, algorithmic programming leagues, and community outreach programs.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {GALLERY_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-white text-navy-950 font-semibold shadow-md shadow-white/10'
                      : 'bg-navy-900/80 text-slate-300 hover:text-white border border-white/10 hover:border-sky-400/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Gallery Cards Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredEvents.map((event) => (
              <article
                key={event.id}
                onClick={() => setActiveEventModal(event)}
                className="group glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Event Image Container */}
                <div className="relative h-56 overflow-hidden bg-navy-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-navy-950/85 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                      {event.category}
                    </span>
                  </div>

                  {/* Date Pill */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-sky-400" />
                      {event.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sky-300 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      {event.attendees}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5 truncate max-w-[78%]">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-white font-medium group-hover:text-sky-400 transition-colors">
                      <span>View</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          CURRENT OFFICE BEARERS SECTION
      ===================================================================== */}
      <section id="bearers" className="relative z-10 py-24 md:py-32 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
                <Award className="w-4 h-4" />
                <span>03 // Executive Board 2026/2027</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Current Office Bearers
              </h2>
              <p className="mt-3 text-slate-400 text-base max-w-2xl">
                Dedicated student leaders and academic advisors steering the Computer Science Association at the Faculty of Applied Sciences.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900 border border-white/10 text-xs font-mono text-slate-300 self-start md:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Tenure: Academic Year 2026 / 2027</span>
            </div>
          </div>

          {/* Senior Treasurer / Academic Advisor Spotlight Banner */}
          {patronBearer && (
            <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8 border border-sky-400/25">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={patronBearer.image}
                    alt={patronBearer.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-sky-400/40 shadow-lg"
                  />
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-sky-500/15 text-sky-300 text-xs font-mono uppercase tracking-wider">
                      {patronBearer.role}
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">
                      {patronBearer.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {patronBearer.year} • University of Sri Jayewardenepura
                    </p>
                    <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                      {patronBearer.bio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center">
                  <a
                    href={`mailto:${patronBearer.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-white/10 text-xs font-medium text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-sky-400" />
                    <span>Contact Advisor</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Top Executive Board (President, General Secretary, Vice President) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {executiveBearers.map((member) => (
              <div
                key={member.id}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-white to-sky-500 opacity-75" />
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-white/15"
                    />
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white text-navy-950 font-semibold">
                        {member.role}
                      </span>
                      <h3 className="mt-1.5 font-display text-lg font-bold text-white">
                        {member.name}
                      </h3>
                      <p className="text-xs text-slate-400">{member.year}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 truncate">
                    {member.email}
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} LinkedIn`}
                      className="p-2 rounded-lg bg-navy-900/90 hover:bg-sky-500 hover:text-navy-950 text-slate-300 border border-white/10 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${member.name} GitHub`}
                        className="p-2 rounded-lg bg-navy-900/90 hover:bg-white hover:text-navy-950 text-slate-300 border border-white/10 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      className="p-2 rounded-lg bg-navy-900/90 hover:bg-sky-400 hover:text-navy-950 text-slate-300 border border-white/10 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Committee & Executive Officers */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {committeeBearers.map((member) => (
              <div
                key={member.id}
                className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 block">
                        {member.role}
                      </span>
                      <h4 className="font-display text-base font-bold text-white mt-0.5">
                        {member.name}
                      </h4>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-400 font-mono">{member.year}</p>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs text-slate-400 hover:text-sky-300 truncate max-w-[160px]"
                  >
                    {member.email}
                  </a>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-navy-900 text-slate-400 hover:text-white border border-white/5"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="p-1.5 rounded-lg bg-navy-900 text-slate-400 hover:text-white border border-white/5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          CONTACT SECTION
      ===================================================================== */}
      <section id="contact" className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Official Coordinates & Direct Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-sky-400 mb-3">
                  <Mail className="w-4 h-4" />
                  <span>04 // Get In Touch</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Collaborate with CSA
                </h2>
                <p className="mt-3 text-slate-400 text-base leading-relaxed">
                  Whether you are an industry partner looking to sponsor our next national hackathon, an alumnus, or an undergraduate ready to contribute—reach out to our executive board.
                </p>
              </div>

              <div className="space-y-4">
                <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Official Address</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Computer Science Association (CSA),<br />
                      Department of Computer Science,<br />
                      Faculty of Applied Sciences,<br />
                      University of Sri Jayewardenepura, Gangodawila, Nugegoda, Sri Lanka.
                    </p>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Electronic Mail</h3>
                    <p className="text-xs text-slate-400 mt-0.5">General & Official Inquiries</p>
                    <a
                      href="mailto:csa@sjp.ac.lk"
                      className="text-sm font-mono text-sky-400 hover:text-sky-300 mt-1 inline-block"
                    >
                      csa@sjp.ac.lk
                    </a>
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Department Secretariat</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Mon – Fri, 8:30 AM – 4:30 PM (IST)</p>
                    <p className="text-sm font-mono text-white mt-1">+94 11 275 8909</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10">
                <h3 className="font-display text-2xl font-bold text-white">
                  Send an Official Message
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Messages are routed directly to the CSA General Secretary & Executive Board.
                </p>

                {submitted ? (
                  <div className="mt-8 p-6 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-sky-400 mx-auto" />
                    <h4 className="font-display text-lg font-bold text-white">
                      Message Received by CSA USJ
                    </h4>
                    <p className="text-sm text-slate-300 max-w-md mx-auto">
                      Thank you for reaching out to the Computer Science Association. Our Secretariat will respond within 24–48 business hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-navy-950 text-xs font-semibold"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="mt-7 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, name: e.target.value })
                          }
                          placeholder="e.g. Kasun Perera"
                          className="w-full px-4 py-3 rounded-xl bg-navy-950/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) =>
                            setContactForm({ ...contactForm, email: e.target.value })
                          }
                          placeholder="name@organization.com"
                          className="w-full px-4 py-3 rounded-xl bg-navy-950/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Inquiry Category
                      </label>
                      <select
                        value={contactForm.subject}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, subject: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-navy-950/90 border border-white/10 text-sm text-white focus:outline-none focus:border-sky-400 transition-colors"
                      >
                        <option value="Partnership / Event Sponsorship">
                          Partnership / Event Sponsorship
                        </option>
                        <option value="Guest Lecture / Workshop Proposal">
                          Guest Lecture / Workshop Proposal
                        </option>
                        <option value="Student Membership & Volunteering">
                          Student Membership & Volunteering
                        </option>
                        <option value="General Academic / Media Inquiry">
                          General Academic / Media Inquiry
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                        Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, message: e.target.value })
                        }
                        placeholder="Share details about your inquiry, event collaboration, or question..."
                        className="w-full px-4 py-3 rounded-xl bg-navy-950/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-navy-950 font-semibold text-sm hover:bg-sky-300 transition-all shadow-lg shadow-white/10"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FOOTER
      ===================================================================== */}
      <footer className="relative z-10 border-t border-white/10 bg-navy-950/90 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center font-display font-bold text-xs text-sky-300">
              CSA
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-white font-semibold">Computer Science Association</span> • Faculty of Applied Sciences, University of Sri Jayewardenepura
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#vision" className="hover:text-white transition-colors">
              Vision
            </a>
            <a href="#events" className="hover:text-white transition-colors">
              Events
            </a>
            <a href="#bearers" className="hover:text-white transition-colors">
              Office Bearers
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            © {new Date().getFullYear()} CSA USJ. All rights reserved.
          </div>
        </div>
      </footer>

      {/* =====================================================================
          EVENT LIGHTBOX MODAL
      ===================================================================== */}
      {activeEventModal && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setActiveEventModal(null)}
        >
          <div
            className="glass-card max-w-2xl w-full rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-72 bg-navy-900">
              <img
                src={activeEventModal.image}
                alt={activeEventModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveEventModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-navy-950/80 text-white hover:bg-white hover:text-navy-950 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6">
                <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-500 text-navy-950 font-semibold">
                  {activeEventModal.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  {activeEventModal.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  {activeEventModal.location}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sky-300">
                  <Users className="w-4 h-4" />
                  {activeEventModal.attendees}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white">
                {activeEventModal.title}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {activeEventModal.description}
              </p>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveEventModal(null)}
                  className="px-5 py-2.5 rounded-full bg-white text-navy-950 font-semibold text-xs hover:bg-sky-300 transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
