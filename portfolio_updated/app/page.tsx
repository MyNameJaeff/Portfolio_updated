"use client";
import { Github, Linkedin, Mail, ExternalLink, Filter, Phone, Download, X, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Code2, Database, Cloud, Wrench, Users, Languages, Lightbulb, Target, Award, Globe } from "lucide-react";

// Import both portfolio data files statically
import portfolioEn from '@/data/portfolio-en.json';
import portfolioSv from '@/data/portfolio-sv.json';

interface Experience {
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  responsibilities: string[];
  skills: string[];
}

interface Education {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  description: string;
  skills: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  description?: string;
  shortDescription?: string;
  image: string;
  tags: string[];
  github?: string;
  linkedIn?: string;
  link?: string;
  features?: string[];
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

interface SpokenLanguage {
  language: string;
  proficiency: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  color: string;
}

interface Language {
  language: string;
  proficiency: string;
}

export default function Home() {
  const { language, t } = useLanguage();

  // Select portfolio data based on language
  const portfolioData = language === 'sv' ? portfolioSv : portfolioEn;

  const { personal, skills, projects, experience, education, values, certifications, spokenLanguages } = portfolioData;
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showCV, setShowCV] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  const handleShowCV = () => {
    setShowCV(true);
    // Scroll to CV section after a short delay to ensure it's rendered
    setTimeout(() => {
      cvRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handlePrintCV = () => {
    window.print();
  };

  // Icon mapping for skills
  const iconMap = {
    'Code2': Code2,
    'Database': Database,
    'Cloud': Cloud,
    'Wrench': Wrench,
    'Users': Users,
    'Languages': Languages
  };

  // Convert skills object to array with icons
  const skillCategories = Object.entries(skills).map(([, category]) => {
    const cat = category as SkillCategory;
    return {
      ...cat,
      icon: iconMap[cat.icon as keyof typeof iconMap]
    };
  });

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set((projects as Project[]).map((p) => p.category)))];

  const filteredProjects = selectedFilter === "All"
    ? (projects as Project[])
    : (projects as Project[]).filter((p) => p.category === selectedFilter);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground print:bg-white print:text-black">
      {/* Main Content */}
      <main className="relative z-10 print:bg-white">
        {/* Hero Section */}
        <section id="home" className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            {/* Name & Title */}
            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80">
                  {t('hero.portfolio', 'Portfolio')}
                </p>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-tight">
                  {personal.name.split(' ')[0]}
                  <br />
                  <span className="text-primary ml-4 sm:ml-8">{personal.name.split(' ')[1]}</span>
                </h1>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
                {personal.title}
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {personal.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
              <a
                href="#contact"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg text-sm sm:text-base"
              >
                {t('hero.getInTouch', 'Get in Touch')}
                <Mail className="inline-block ml-2 w-4 h-4" />
              </a>

              <a
                href="#projects"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border text-sm sm:text-base"
              >
                {t('hero.viewProjects', 'View Projects')}
                <ExternalLink className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 sm:gap-4">
              <Link
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>

              <Link
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 sm:p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>

              <Link
                href={personal.social.email}
                className="p-2.5 sm:p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-3 sm:mb-4">
                {t('about.title', 'About Me')}
              </p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
                {t('about.heading', 'Passionate About')} <span className="text-primary">{t('about.headingHighlight', 'Building Solutions')}</span>
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground">{t('about.whoIAm', 'Who I Am')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                  {personal.bio}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('about.extraInfo', "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-card-foreground">{t('about.location', '📍 Location')}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {personal.location}
                  </p>
                </div>

                <div className="p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                  <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-card-foreground">{t('about.availability', '📧 Availability')}</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {personal.availability}
                  </p>
                </div>
              </div>

              {!showCV &&
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleShowCV}
                    className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg text-sm sm:text-base"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    {t('about.viewCV', 'View CV')}
                  </button>
                </div>}
            </div>
          </div>
        </section>

        {/* CV Section - Printable */}
        <section ref={cvRef} className={`px-4 sm:px-6 py-12 sm:py-20 print:py-0 print:px-0 transition-all duration-300 ${showCV ? 'block' : 'hidden'} print:block`}>
          <div className="max-w-5xl mx-auto">
            {/* CV Toggle & Print Buttons */}
            <div className="text-center mb-8 sm:mb-12 print:hidden flex gap-3 sm:gap-4 justify-center flex-wrap">
              <button
                onClick={() => setShowCV(false)}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border text-sm sm:text-base"
              >
                <X className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                {t('about.hideCV', 'Hide CV')}
              </button>
              <button
                onClick={handlePrintCV}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg text-sm sm:text-base"
              >
                <Download className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                {t('about.downloadPrintCV', 'Download / Print CV')}
              </button>
            </div>

            {/* CV Content - Theme-aware with proper print styles */}
            <div className="cv-document bg-card text-foreground print:bg-white print:text-black border border-border print:border-0 shadow-xl print:shadow-none rounded-lg print:rounded-none overflow-hidden">
              {/* CV Header */}
              <div className="cv-header p-6 sm:p-8 print:p-12 bg-linear-to-r from-primary to-primary/80 text-primary-foreground print:bg-linear-to-r print:from-gray-800 print:to-gray-900 print:text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{personal.name}</h1>
                <p className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 opacity-95">{personal.title}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                    <a href={personal.social.email} className="hover:underline opacity-95 print:opacity-100 truncate">{personal.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                    <span className="opacity-95 print:opacity-100">{personal.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                    <span className="opacity-95 print:opacity-100">{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
                    <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline opacity-95 print:opacity-100 truncate">LinkedIn Profile</a>
                  </div>
                </div>
              </div>

              {/* CV Body */}
              <div className="cv-body p-6 sm:p-8 print:p-12 space-y-6 sm:space-y-8 print:space-y-6">
                {/* Professional Summary */}
                <section className="cv-section cv-summary">
                  <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                    <Users className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                    {t('cv.professionalSummary', 'Professional Summary')}
                  </h2>
                  {/* <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 leading-relaxed">{personal.tagline}</p> */}
                  <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 leading-relaxed mt-2">{personal.bio}</p>
                </section>

                {/* Experience */}
                <section className="cv-section cv-experience break-inside-avoid">
                  <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                    <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                    {t('cv.experience', 'Professional Experience')}
                  </h2>
                  <div className="space-y-5 sm:space-y-6 print:space-y-5">
                    {experience.map((exp: Experience, index: number) => (
                      <div key={index} className="cv-experience-item break-inside-avoid">
                        <div className="mb-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-foreground print:text-gray-900">{exp.title}</h3>
                              <p className="text-base sm:text-lg font-semibold text-primary print:text-gray-700">{exp.company}</p>
                            </div>
                            <div className="text-left sm:text-right text-xs sm:text-sm text-muted-foreground print:text-gray-600 sm:shrink-0 print:text-xs">
                              <div className="flex items-center gap-1 sm:justify-end">
                                <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 shrink-0" />
                                <span>{exp.period}</span>
                              </div>
                              {exp.location && (
                                <div className="flex items-center gap-1 sm:justify-end mt-1">
                                  <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 shrink-0" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 mb-3 leading-relaxed">{exp.description}</p>
                        <ul className="list-none space-y-1.5 sm:space-y-2 ml-0">
                          {exp.responsibilities.map((resp: string, idx: number) => (
                            <li key={idx} className="text-sm sm:text-base text-muted-foreground print:text-gray-700 flex items-start gap-2">
                              <span className="text-primary print:text-gray-800 shrink-0">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 print:hidden">
                          {exp.skills.map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="cv-skill-tag px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        {/* Print version of skills - comma separated */}
                        <p className="hidden print:block text-gray-700 text-sm mt-2 leading-relaxed">
                          <span className="font-semibold">Skills: </span>{exp.skills.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="cv-section cv-education break-inside-avoid">
                  <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                    <Award className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                    {t('cv.education', 'Education')}
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu: Education, index: number) => (
                      <div key={index} className="break-inside-avoid">
                        <div className="mb-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-foreground print:text-gray-900">{edu.degree}</h3>
                              <p className="text-base sm:text-lg font-semibold text-primary print:text-gray-700">{edu.institution}</p>
                            </div>
                            <div className="text-left sm:text-right text-xs sm:text-sm text-muted-foreground print:text-gray-600 sm:shrink-0 print:text-xs">
                              <div className="flex items-center gap-1 sm:justify-end">
                                <Calendar className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 shrink-0" />
                                <span>{edu.period}</span>
                              </div>
                              {edu.location && (
                                <div className="flex items-center gap-1 sm:justify-end mt-1">
                                  <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 shrink-0" />
                                  <span>{edu.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 leading-relaxed">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Skills */}
                <section className="cv-section cv-skills break-inside-avoid">
                  <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                    <Target className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                    {t('cv.skills', 'Technical Skills')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print:gap-3">
                    {Object.entries(skills).map(([, category]) => {
                      const cat = category as SkillCategory;
                      return (
                        <div key={cat.title} className="break-inside-avoid">
                          <h3 className="font-bold text-sm sm:text-base text-foreground print:text-gray-900 mb-2">{cat.title}</h3>
                          {/* Screen version with tags */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 print:hidden">
                            {cat.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="cv-skill-tag px-2 py-0.5 sm:py-1 text-xs bg-secondary/50 text-secondary-foreground rounded border border-border/50"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          {/* Print version with comma-separated text */}
                          <p className="hidden print:block text-gray-700 text-sm leading-relaxed">
                            {cat.skills.join(', ')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                  <section className="cv-section cv-certifications break-inside-avoid">
                    <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                      <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                      {t('cv.certifications', 'Certifications')}
                    </h2>
                    <div className="space-y-3">
                      {certifications.map((cert: Certification, index: number) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 break-inside-avoid">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm sm:text-base text-foreground print:text-gray-900">{cert.name}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground print:text-gray-600">{cert.issuer}</p>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground print:text-gray-600 sm:whitespace-nowrap">{cert.date}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Languages */}
                {spokenLanguages && spokenLanguages.length > 0 && (
                  <section className="cv-section cv-languages break-inside-avoid">
                    <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                      <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                      {t('cv.languages', 'Languages')}
                    </h2>
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      {spokenLanguages.map((lang: Language, index: number) => (
                        <div key={index}>
                          <span className="font-bold text-sm sm:text-base text-foreground print:text-gray-900">{lang.language}:</span>{" "}
                          <span className="text-sm sm:text-base text-muted-foreground print:text-gray-700">{lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* CV Footer */}
              <div className="print:min-h-[300px] cv-footer p-6 sm:p-8 print:p-6 bg-secondary/30 text-center text-xs sm:text-sm text-muted-foreground print:text-gray-600 print:border-t print:border-gray-300">
                <p>{t('cv.referencesAvailable', 'References available upon request')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section id="values" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                {t('values.titleCore', 'Core')} <span className="text-primary">{t('values.titleHighlight', 'Values')}</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('values.subtitle', 'The principles that guide my approach to software development')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value: Value, index: number) => {
                const valueIconMap = {
                  'Code2': Code2,
                  'Lightbulb': Lightbulb,
                  'Target': Target,
                  'Users': Users
                };
                const Icon = valueIconMap[value.icon as keyof typeof valueIconMap];
                return (
                  <div
                    key={index}
                    className="group p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">
                          {value.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Experience Timeline Section */}
        <section id="experience" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                {t('experience.titlePart1', 'Professional')} <span className="text-primary">{t('experience.titlePart2', 'Journey')}</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('experience.subtitle', 'Key roles and projects that have shaped my career')}
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {experience.map((exp: Experience, index: number) => (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-3 top-10 w-6 h-6 bg-primary rounded-full border-4 border-background hidden md:block"></div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                          {exp.title}
                        </h3>
                        <p className="text-base sm:text-lg text-primary font-semibold">
                          {exp.company}
                        </p>
                      </div>
                      <span className="text-sm sm:text-base text-muted-foreground font-medium">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>

                    <ul className="list-none space-y-1.5 sm:space-y-2">
                      {exp.responsibilities.map((resp: string, idx: number) => (
                        <li key={idx} className="text-sm sm:text-base text-muted-foreground flex items-start gap-2">
                          <span className="text-primary shrink-0 mt-0.5">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {exp.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 sm:px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                <span className="text-primary">{t('education.titleHighlight', 'Education')}</span> & {t('education.title', 'Learning')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('education.subtitle', 'Continuous growth through formal education and hands-on learning')}
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {education.map((edu: Education, index: number) => (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-base sm:text-lg font-semibold text-primary">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="text-sm sm:text-base text-muted-foreground font-medium">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {edu.description}
                    </p>

                    {
                      (edu.skills && edu.skills.length > 0) && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {edu.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 sm:px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )
                    }

                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                {t('skills.title', 'Skills')} & <span className="text-primary">{t('skills.titleHighlight', 'Expertise')}</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('skills.subtitle', 'A comprehensive toolkit built through hands-on experience and continuous learning')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {skillCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                      <div className={`p-2 rounded-lg bg-linear-to-br ${category.color} bg-opacity-10 shrink-0`}>
                        <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-card-foreground">
                        {category.title}
                      </h3>
                    </div>

                    {/* Skills list */}
                    <div className="relative flex flex-wrap gap-1.5 sm:gap-2">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-secondary/50 text-secondary-foreground rounded-full border border-border/50 hover:border-primary/50 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section with Filter */}
        <section id="projects" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-7xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-3 sm:mb-4">
                {t('projects.portfolio', 'Portfolio')}
              </p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
                {t('projects.featured', 'Featured')}
                <br />
                <span className="text-primary">{t('projects.featuredHighlight', 'Projects')}</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('projects.subtitle', 'Explore my complete portfolio of projects, from enterprise solutions to innovative tools. Each project represents a unique challenge and a learning experience.')}
              </p>
            </div>

            {/* Filter Section */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-semibold text-sm sm:text-base">{t('projects.filter', 'Filter:')}</span>
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedFilter(category)}
                    className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${selectedFilter === category
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-48 sm:h-64 bg-secondary/20 overflow-hidden">
                    {/* Placeholder gradient if no image */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5"></div>

                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border">
                      {project.category}
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-card via-card/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Project links overlay */}
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {project.github && (
                        <Link
                          href={project.github}
                          target="_blank"
                          className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View on GitHub"
                        >
                          <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                      )}

                      {project.linkedIn && (
                        <Link
                          href={project.linkedIn}
                          target="_blank"
                          className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View on LinkedIn"
                        >
                          <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                      )}

                      {project.link && (
                        <Link
                          href={project.link}
                          target="_blank"
                          className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View live project"
                        >
                          <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-card-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                      {project.description || project.shortDescription}
                    </p>

                    {/* Features List (if available) */}
                    {project.features && (
                      <div className="mb-3 sm:mb-4">
                        <p className="text-xs sm:text-sm font-semibold text-card-foreground mb-2">{t('projects.keyFeatures', 'Key Features:')}</p>
                        <ul className="grid grid-cols-1 gap-1 text-xs sm:text-sm text-muted-foreground">
                          {project.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                              <span className="leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        className="inline-flex items-center text-sm sm:text-base text-primary font-semibold hover:underline group/link"
                      >
                        {t('projects.viewProject', 'View Project')}
                        <ExternalLink className="ml-2 w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16 sm:py-20">
                <p className="text-lg sm:text-xl text-muted-foreground">
                  {t('projects.noProjects', 'No projects found in this category.')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                <span className="text-primary">{t('certifications.titleHighlight', 'Certifications')}</span> & {t('certifications.title', 'Achievements')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('certifications.subtitle', 'Professional certifications and recognized achievements')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {certifications.map((cert: Certification, index: number) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                      <Award className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-card-foreground">
                        {cert.name}
                      </h3>
                      <p className="text-primary font-semibold text-xs sm:text-sm">
                        {cert.issuer}
                      </p>
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        {cert.credentialId}
                      </span>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        {cert.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages Section */}
        <section id="languages" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                {t('languages.title', 'Languages')} & <span className="text-primary">{t('languages.titleHighlight', 'Communication')}</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('languages.subtitle', 'Spoken languages and communication proficiency')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {spokenLanguages.map((lang: Language, index: number) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                      <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">
                        {lang.language}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground font-semibold">
                        {lang.proficiency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 leading-tight">
              {t('contact.title', "Let's")} <span className="text-primary">{t('contact.titleHighlight', 'Connect')}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              {t('contact.subtitle', "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.")}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-10 sm:mb-12">
              <div className="p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-card-foreground">{t('contact.email', 'Email')}</span>
                </div>
                <Link
                  href={personal.social.email}
                  className="text-sm sm:text-base text-primary hover:underline font-medium break-all"
                >
                  {personal.email}
                </Link>
              </div>

              <div className="p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" />
                  <span className="font-semibold text-sm sm:text-base text-card-foreground">{t('contact.phone', 'Phone')}</span>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  {personal.phone}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 bg-primary text-primary-foreground text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg"
              >
                <Linkedin className="mr-2 sm:mr-3 w-5 h-5" />
                {t('contact.connectLinkedin', 'Connect on LinkedIn')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Force white background for the entire page */
          html,
          body,
          body > div,
          main {
            background-color: white !important;
            background-image: none !important;
          }
          
          /* Override CSS variables for print */
          :root {
            --background: white !important;
            --card: white !important;
            --secondary: white !important;
          }
          
          /* Ensure CV document and all its sections have white background */
          .cv-document,
          .cv-header,
          .cv-body,
          .cv-footer {
            background-color: white !important;
            background-image: none !important;
          }

          /* PAGE BREAK CONTROLS FOR CV SECTIONS */
          
          /* Page 1: Header + Professional Summary */
          .cv-header {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .cv-summary {
            page-break-before: avoid !important;
            break-before: avoid !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }

          /* Page 2: Experience (force new page) */
          .cv-experience {
            page-break-before: always !important;
            break-before: always !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Keep experience items together */
          .cv-experience-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Education stays with or after experience */
          .cv-education {
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Page 3: Skills section forces new page */
          .cv-skills {
            page-break-before: always !important;
            break-before: always !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          /* Certifications and Languages stay together on page 3 */
          .cv-certifications {
            page-break-before: avoid !important;
            break-before: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .cv-languages {
            page-break-before: avoid !important;
            break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Footer positioning */
          .cv-footer {
            margin-top: 2rem !important;
            page-break-before: avoid !important;
            break-before: avoid !important;
          }

          /* Hide non-CV sections when printing */
          .print\\:hidden {
            display: none !important;
          }

          /* Print spacing adjustments */
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }

          .print\\:px-0 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          .print\\:p-12 {
            padding: 3rem !important;
          }

          .print\\:space-y-6 > * + * {
            margin-top: 1.5rem !important;
          }

          .print\\:space-y-5 > * + * {
            margin-top: 1.25rem !important;
          }

          .print\\:gap-3 {
            gap: 0.75rem !important;
          }

          /* Remove shadows and borders for print */
          .print\\:shadow-none {
            box-shadow: none !important;
          }

          .print\\:border-0 {
            border-width: 0 !important;
          }

          .print\\:rounded-none {
            border-radius: 0 !important;
          }

          /* Print-specific styling */
          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:bg-gradient-to-r {
            background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important;
          }

          .print\\:from-gray-800 {
            --tw-gradient-from: #1f2937 !important;
            --tw-gradient-to: rgba(31, 41, 55, 0) !important;
            --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
          }

          .print\\:to-gray-900 {
            --tw-gradient-to: #111827 !important;
          }

          .print\\:text-white {
            color: white !important;
          }

          .print\\:text-black {
            color: black !important;
          }

          .print\\:text-gray-900 {
            color: #111827 !important;
          }

          .print\\:text-gray-800 {
            color: #1f2937 !important;
          }

          .print\\:text-gray-700 {
            color: #374151 !important;
          }

          .print\\:text-gray-600 {
            color: #4b5563 !important;
          }

          .print\\:text-gray-500 {
            color: #6b7280 !important;
          }

          .print\\:border-gray-300 {
            border-color: #d1d5db !important;
          }

          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
          }

          .print\\:bg-gray-100 {
            background-color: #f3f4f6 !important;
          }

          .print\\:border-t {
            border-top: 1px solid #d1d5db !important;
          }

          .print\\:block {
            display: block !important;
          }

          .print\\:opacity-100 {
            opacity: 1 !important;
          }

          .print\\:w-3 {
            width: 0.75rem !important;
          }

          .print\\:h-3 {
            height: 0.75rem !important;
          }

          .print\\:text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }

          .print\\:mt-auto {
            margin-top: auto !important;
          }

          /* Prevent page breaks inside important elements */
          .break-inside-avoid,
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          /* Ensure proper spacing in print */
          .cv-section {
            break-inside: avoid;
          }

          /* Page setup */
          @page {
            margin: 1cm;
            size: A4;
          }

          /* Ensure links are readable in print */
          a {
            text-decoration: none;
          }

          a[href^="http"]:after {
            content: "";
          }
        }

        /* Screen-only smooth transitions */
        @media screen {
          .cv-document {
            transition: all 0.3s ease;
          }

          .cv-skill-tag {
            transition: all 0.2s ease;
          }
        }
      `}</style>
    </div>
  );
}