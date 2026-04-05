"use client";

import {
  Github, Linkedin, Mail, ExternalLink, Filter,
  Phone, Download, X, Calendar, MapPin, Folder,
  Code2, Database, Cloud, Wrench, Users, Languages,
  Lightbulb, Target, Award, Globe, Star, Zap, Shield, Heart,
  Send,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useMemo, useCallback, useEffect, type CSSProperties } from "react";

// Types
export interface Experience {
  logo?: string;
  title: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  responsibilities: string[];
  skills: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  location?: string;
  description: string;
  skills: string[];
}

export interface Project {
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

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  image?: string;
  verifyUrl?: string;
}

export interface SpokenLanguage {
  language: string;
  proficiency: string;
}

export interface Value {
  icon: string;
  title: string;
  description: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  color: string;
}

export interface Personal {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  availability: string;
  phone: string;
  email: string;
  social: {
    email: string;
    linkedin: string;
    github?: string;
  };
}

export interface PortfolioData {
  personal: Personal;
  skills: Record<string, SkillCategory>;
  experience: Experience[];
  education: Education[];
  values: Value[];
  projects?: Project[];
  certifications?: Certification[];
  spokenLanguages?: SpokenLanguage[];
}

export type CvType = "tech" | "general";

type Translator = (key: string, defaultValue?: string) => string;
type SkillCategoryWithIcon = Omit<SkillCategory, "icon"> & { icon: React.ElementType };

// Constants
const DEFAULT_PROJECT_FILTER = "All";

const SKILL_ICON_MAP = {
  Code2, Database, Cloud, Wrench, Users, Languages, Star, Zap, Shield, Heart,
} as const;

const VALUE_ICON_MAP = {
  Code2,
  Lightbulb,
  Target,
  Users,
  Heart: Users,
  Zap: Lightbulb,
  Shield: Target,
} as const;

// Shared primitives
/** Small pill badge used throughout the page. */
function SkillTag({ label, variant = "default" }: { label: string; variant?: "default" | "primary" }) {
  const base = "px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full border";
  const styles =
    variant === "primary"
      ? "bg-primary/10 text-primary border-primary/20 cv-skill-tag"
      : "bg-secondary text-secondary-foreground border-border";
  return <span className={`${base} ${styles}`}>{label}</span>;
}

/** Reusable section heading with optional eyebrow label and subtitle. */
function SectionHeader({
  eyebrow,
  heading,
  highlight,
  highlightPosition = "end",
  subtitle,
}: {
  eyebrow?: string;
  heading: string;
  highlight?: string;
  highlightPosition?: "start" | "end";
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      {eyebrow && (
        <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-3 sm:mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
        {highlightPosition === "start" && highlight && (
          <><span className="text-primary">{highlight}</span>{" & "}</>
        )}
        {heading}
        {highlightPosition === "end" && highlight && (
          <> <span className="text-primary">{highlight}</span></>
        )}
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * A card with a vertical timeline rail, dot, and horizontal connector on md+.
 * Used by both ExperienceSection and EducationSection.
 */
function TimelineItem({
  index,
  isLast,
  children,
}: {
  index: number;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fade-in-up group relative p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300"
      style={{ transitionDelay: `${index * 100}ms` } as CSSProperties}
    >
      {/* Single vertical connector to the next dot (except last item) */}
      {!isLast && (
        <div
          className="hidden md:block absolute -left-8 w-0.5 bg-linear-to-b from-primary/40 via-primary/25 to-primary/10"
          style={{ top: "2.875rem", height: "calc(100% + 2.875rem)" } as CSSProperties}
          aria-hidden="true"
        />
      )}

      {/* Dot marker */}
      <div className="timeline-dot hidden md:flex absolute -left-11.5 top-8 w-7 h-7 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm border-2 border-primary/60 z-10 shadow-[0_0_0_4px_hsl(var(--background)/0.7)]">
        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
      </div>

      {/* Horizontal connector: dot to card */}
      <div
        className="hidden md:block absolute top-11.5 h-0.5 bg-primary/25 z-0"
        style={{ left: "-1.875rem", width: "1.875rem" } as CSSProperties}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}

// Section: Hero
function HeroSection({ personal, t }: { personal: Personal; t: Translator }) {
  const [firstName, ...rest] = personal.name.split(" ");
  const lastName = rest.join(" ");

  const handleSectionLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section id="home" className="flex min-h-screen items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
          <div className="space-y-2">
            <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80">
              {t("hero.portfolio", "Portfolio")}
            </p>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-tight">
              {firstName}
              <br />
              {lastName && <span className="text-primary ml-4 sm:ml-8">{lastName}</span>}
            </h1>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-muted-foreground">
            {personal.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {personal.tagline}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12">
          <a
            href="#contact"
            onClick={(event) => handleSectionLinkClick(event, "contact")}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg text-sm sm:text-base"
          >
            {t("hero.getInTouch", "Get in Touch")}
            <Mail className="inline-block ml-2 w-4 h-4" />
          </a>
          <a
            href="#projects"
            onClick={(event) => handleSectionLinkClick(event, "projects")}
            className="group px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border text-sm sm:text-base"
          >
            {t("hero.viewProjects", "View Projects")}
            <ExternalLink className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="flex gap-3 sm:gap-4">
          {"github" in personal.social && personal.social.github && (
            <Link
              href={personal.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 sm:p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
            </Link>
          )}
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
  );
}

// Section: About
function AboutSection({
  personal,
  showCV,
  onShowCV,
  onHideCV,
  onPrintCV,
  t,
}: {
  personal: Personal;
  showCV: boolean;
  onShowCV: () => void;
  onHideCV: () => void;
  onPrintCV: () => void;
  t: Translator;
}) {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-3 sm:mb-4">
            {t("about.title", "About Me")}
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("about.heading", "Passionate About")}{" "}
            <span className="text-primary">{t("about.headingHighlight", "Building Solutions")}</span>
          </h2>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="fade-in-up p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-card-foreground">
              {t("about.whoIAm", "Who I Am")}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
              {personal.bio}
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t(
                "about.extraInfo",
                "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div
              className="fade-in-up p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border"
              style={{ transitionDelay: "100ms" } as CSSProperties}
            >
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-card-foreground">
                {t("about.location", "📍 Location")}
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">{personal.location}</p>
            </div>
            <div
              className="fade-in-up p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border"
              style={{ transitionDelay: "200ms" } as CSSProperties}
            >
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-card-foreground">
                {t("about.availability", "📧 Availability")}
              </h4>
              <p className="text-sm sm:text-base text-muted-foreground">{personal.availability}</p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            {!showCV ? (
              <button
                onClick={onShowCV}
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg text-sm sm:text-base"
              >
                <Download className="mr-2 w-5 h-5" />
                {t("about.viewCV", "View CV")}
              </button>
            ) : (
              <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
                <button
                  onClick={onHideCV}
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border text-sm sm:text-base"
                >
                  <X className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                  {t("about.hideCV", "Hide CV")}
                </button>
                <button
                  onClick={onPrintCV}
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg text-sm sm:text-base"
                >
                  <Download className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                  {t("about.downloadPrintCV", "Download / Print CV")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// CV sub-sections (only used inside CVSection)
function CVExperienceItem({ exp }: { exp: Experience }) {
  return (
    <div className="cv-experience-item break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-2">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          {exp.logo && (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg print:rounded-none overflow-hidden border border-border/60 bg-background shrink-0">
              <Image
                src={exp.logo}
                alt={`${exp.company} logo`}
                fill
                className="object-contain p-1"
                sizes="56px"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-foreground print:text-gray-900">{exp.title}</h3>
            <p className="text-base sm:text-lg font-semibold text-primary print:text-gray-700">{exp.company}</p>
          </div>
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

      <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 mb-3 leading-relaxed">
        {exp.description}
      </p>

      <ul className="list-none space-y-1.5 sm:space-y-2">
        {exp.responsibilities.map((resp, idx) => (
          <li key={idx} className="text-sm sm:text-base text-muted-foreground print:text-gray-700 flex items-start gap-2">
            <span className="text-primary print:text-gray-800 shrink-0">•</span>
            <span>{resp}</span>
          </li>
        ))}
      </ul>

      {/* Screen: pill tags */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 print:hidden">
        {exp.skills.map((skill, idx) => <SkillTag key={idx} label={skill} variant="primary" />)}
      </div>
      {/* Print: comma-separated */}
      <p className="hidden print:block text-gray-700 text-sm mt-2 leading-relaxed">
        <span className="font-semibold">Skills: </span>{exp.skills.join(", ")}
      </p>
    </div>
  );
}

function CVEducationItem({ edu }: { edu: Education }) {
  return (
    <div className="break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-2">
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
      <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 leading-relaxed">
        {edu.description}
      </p>

      {edu.skills.length > 0 && (
        <>
          {/* Screen: pill tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 print:hidden">
            {edu.skills.map((skill, idx) => <SkillTag key={idx} label={skill} />)}
          </div>
          {/* Print: comma-separated */}
          <p className="hidden print:block text-gray-700 text-sm mt-2 leading-relaxed">
            <span className="font-semibold">Skills Learned: </span>{edu.skills.join(", ")}
          </p>
        </>
      )}
    </div>
  );
}

// Section: CV (animated reveal)
function CVSection({
  cvRef,
  showCV,
  personal,
  experience,
  education,
  rawSkillCategories,
  certifications,
  spokenLanguages,
  cvFooterHeightClass,
  t,
}: {
  cvRef: React.RefObject<HTMLDivElement | null>;
  showCV: boolean;
  personal: Personal;
  experience: Experience[];
  education: Education[];
  rawSkillCategories: SkillCategory[];
  certifications: Certification[];
  spokenLanguages: SpokenLanguage[];
  cvFooterHeightClass: string;
  t: Translator;
}) {
  return (
    <section
      ref={cvRef}
      className={`px-4 sm:px-6 print:py-0 print:px-0 print:block cv-reveal-section ${showCV ? "cv-reveal-in" : "cv-reveal-out"}`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Document */}
        <div className="cv-document bg-card text-foreground print:bg-white print:text-black border border-border print:border-0 shadow-xl print:shadow-none rounded-lg print:rounded-none overflow-hidden">
          {/* Header */}
          <div className="cv-header p-6 sm:p-8 print:p-12 bg-linear-to-r from-primary to-primary/80 text-primary-foreground print:bg-linear-to-r print:from-gray-800 print:to-gray-900 print:text-gray-900">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">{personal.name}</h1>
            <p className="text-lg sm:text-xl md:text-2xl font-light mb-3 sm:mb-4 opacity-95">{personal.title}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 print:text-gray-700 shrink-0" />
                <a href={personal.social.email} className="hover:underline opacity-95 print:opacity-100 print:text-gray-700 truncate">
                  {personal.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 print:text-gray-700 shrink-0" />
                <span className="opacity-95 print:opacity-100 print:text-gray-700">{personal.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 print:text-gray-700 shrink-0" />
                <span className="opacity-95 print:opacity-100 print:text-gray-700">{personal.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 sm:w-4 h-3.5 sm:h-4 print:w-3 print:h-3 print:text-gray-700 shrink-0" />
                <a
                  href={personal.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline opacity-95 print:opacity-100 print:text-gray-700 truncate"
                >
                  LinkedIn Profile
                  <ExternalLink className="hidden print:inline ml-1 w-3 h-3 align-[-1px]" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="cv-body p-6 sm:p-8 print:p-12 space-y-6 sm:space-y-8 print:space-y-6">
            {/* Summary */}
            <section className="cv-section cv-summary">
              <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                <Users className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                {t("cv.professionalSummary", "Professional Summary")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground print:text-gray-700 leading-relaxed mt-2">
                {personal.bio}
              </p>
            </section>

            {/* Experience */}
            <section className="cv-section cv-experience break-inside-avoid">
              <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                <Code2 className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                {t("cv.experience", "Professional Experience")}
              </h2>
              <div className="space-y-5 sm:space-y-6 print:space-y-5">
                {experience.map((exp, i) => <CVExperienceItem key={i} exp={exp} />)}
              </div>
            </section>

            {/* Education */}
            <section className="cv-section cv-education break-inside-avoid">
              <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                <Award className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                {t("cv.education", "Education")}
              </h2>
              <div className="space-y-4">
                {education.map((edu, i) => <CVEducationItem key={i} edu={edu} />)}
              </div>
            </section>

            {/* Skills */}
            <section className="cv-section cv-skills break-inside-avoid">
              <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                <Target className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                {t("cv.skills", "Technical Skills")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 print:gap-3">
                {rawSkillCategories.map((cat) => (
                  <div key={cat.title} className="break-inside-avoid">
                    <h3 className="font-bold text-sm sm:text-base text-foreground print:text-gray-900 mb-2">
                      {cat.title}
                    </h3>
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
                    <p className="hidden print:block text-gray-700 text-sm leading-relaxed">
                      {cat.skills.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications */}
            {certifications.length > 0 && (
              <section className="cv-section cv-certifications break-inside-avoid">
                <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                  <Lightbulb className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                  {t("cv.certifications", "Certifications")}
                </h2>
                <div className="space-y-3">
                  {certifications.map((cert, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 break-inside-avoid"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground print:text-gray-900">{cert.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground print:text-gray-600">{cert.issuer}</p>
                      </div>
                      <span className="text-xs sm:text-sm text-muted-foreground print:text-gray-600 sm:whitespace-nowrap">
                        {cert.date}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {spokenLanguages.length > 0 && (
              <section className="cv-section cv-languages break-inside-avoid">
                <h2 className="cv-section-title text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pb-2 border-b-2 border-primary/30 print:border-gray-300 text-foreground print:text-black flex items-center gap-2">
                  <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-primary print:text-gray-800 shrink-0" />
                  {t("cv.languages", "Languages")}
                </h2>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {spokenLanguages.map((lang, i) => (
                    <div key={i}>
                      <span className="font-bold text-sm sm:text-base text-foreground print:text-gray-900">
                        {lang.language}:
                      </span>{" "}
                      <span className="text-sm sm:text-base text-muted-foreground print:text-gray-700">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div
            className={`${cvFooterHeightClass} flex items-end justify-center cv-footer p-6 sm:p-8 print:p-6 bg-secondary/30 text-center text-xs sm:text-sm text-muted-foreground print:text-gray-600 print:border-t print:border-gray-300`}
          >
            <p>{t("cv.referencesAvailable", "References available upon request")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Section: Core Values
function ValuesSection({ values, t }: { values: Value[]; t: Translator }) {
  return (
    <section id="values" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-6xl w-full">
        <SectionHeader
          heading={t("values.titleCore", "Core")}
          highlight={t("values.titleHighlight", "Values")}
          subtitle={t("values.subtitle", "The principles that guide my approach to software development")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {values.map((value, index) => {
            const Icon = VALUE_ICON_MAP[value.icon as keyof typeof VALUE_ICON_MAP] || Users;
            return (
              <div
                key={index}
                className="fade-in-up group p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors shrink-0">
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-card-foreground">{value.title}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section: Experience Timeline
function ExperienceSection({ experience, t }: { experience: Experience[]; t: Translator }) {
  return (
    <section id="experience" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <SectionHeader
          heading={t("experience.titlePart1", "Professional")}
          highlight={t("experience.titlePart2", "Journey")}
          subtitle={t("experience.subtitle", "Key roles and projects that have shaped my career")}
        />
        <div className="relative space-y-6 sm:space-y-8 md:pl-12">
          {experience.map((exp, index) => (
            <TimelineItem key={index} index={index} isLast={index === experience.length - 1}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  {exp.logo && (
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg print:rounded-none overflow-hidden border border-border/60 bg-background shrink-0">
                      <Image
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-base sm:text-lg text-primary font-semibold">{exp.company}</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base text-muted-foreground font-medium">{exp.period}</span>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                {exp.description}
              </p>

              <ul className="list-none space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm sm:text-base text-muted-foreground flex items-start gap-2">
                    <span className="text-primary shrink-0 mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {exp.skills.map((skill, idx) => <SkillTag key={idx} label={skill} />)}
              </div>
            </TimelineItem>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section: Education Timeline
function EducationSection({ education, t }: { education: Education[]; t: Translator }) {
  return (
    <section id="education" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <SectionHeader
          heading={t("education.title", "Learning")}
          highlight={t("education.titleHighlight", "Education")}
          highlightPosition="start"
          subtitle={t("education.subtitle", "Continuous growth through formal education and hands-on learning")}
        />
        <div className="relative space-y-6 sm:space-y-8 md:pl-12">
          {education.map((edu, index) => (
            <TimelineItem key={index} index={index} isLast={index === education.length - 1}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-primary">{edu.institution}</p>
                </div>
                <span className="text-sm sm:text-base text-muted-foreground font-medium">{edu.period}</span>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                {edu.description}
              </p>

              {edu.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {edu.skills.map((skill, idx) => <SkillTag key={idx} label={skill} />)}
                </div>
              )}
            </TimelineItem>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section: Skills
function SkillsSection({
  skillCategories,
  t,
}: {
  skillCategories: SkillCategoryWithIcon[];
  t: Translator;
}) {
  return (
    <section id="skills" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-6xl w-full">
        <SectionHeader
          heading={t("skills.title", "Skills")}
          highlight={t("skills.titleHighlight", "Expertise")}
          subtitle={t("skills.subtitle", "A comprehensive toolkit built through hands-on experience and continuous learning")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="fade-in-up group relative p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                style={{ transitionDelay: `${index * 60}ms` } as CSSProperties}
              >
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <div className={`p-2 rounded-lg bg-linear-to-br ${category.color} bg-opacity-10 shrink-0`}>
                    <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-card-foreground">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
  );
}

// Projects: card + section
function ProjectCard({ project, index, t }: { project: Project; index: number; t: Translator }) {
  return (
    <div
      className="fade-in-up flex flex-col group relative bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-2xl"
      style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}
    >
      {/* Image */}
      <div className="relative h-48 sm:h-64 bg-secondary/20 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-primary/5" />
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="100%"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-2.5 sm:px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border">
          {project.category}
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Hover link icons */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          {project.github && (
            <Link href={project.github} target="_blank" className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors" aria-label="View on GitHub">
              <Github className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          )}
          {project.linkedIn && (
            <Link href={project.linkedIn} target="_blank" className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors" aria-label="View on LinkedIn">
              <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          )}
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              className="p-1.5 sm:p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors" aria-label="View live project">
              <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-card-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
          {project.description || project.shortDescription}
        </p>

        {project.features && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm font-semibold text-card-foreground mb-2">
              {t("projects.keyFeatures", "Key Features:")}
            </p>
            <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              {project.features.slice(0, 3).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Folder className="w-4 sm:w-5 h-4 sm:h-5 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">{project.category}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {project.tags.map((tag, idx) => <SkillTag key={idx} label={tag} />)}
          </div>
          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              className="inline-flex items-center text-sm sm:text-base text-primary font-semibold hover:underline group/link"
            >
              {t("projects.viewProject", "View Project")}
              <ExternalLink className="ml-2 w-3.5 sm:w-4 h-3.5 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection({
  categories,
  filteredProjects,
  selectedFilter,
  onFilterChange,
  t,
}: {
  projects: Project[];
  categories: string[];
  filteredProjects: Project[];
  selectedFilter: string;
  onFilterChange: (cat: string) => void;
  t: Translator;
}) {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-3 sm:mb-4">
            {t("projects.portfolio", "Portfolio")}
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("projects.featured", "Featured")}
            <br />
            <span className="text-primary">{t("projects.featuredHighlight", "Projects")}</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("projects.subtitle", "Explore my complete portfolio of projects, from enterprise solutions to innovative tools.")}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-10 sm:mb-12 flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">{t("projects.filter", "Filter:")}</span>
          </div>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onFilterChange(category)}
              className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium transition-all duration-300 text-sm sm:text-base ${selectedFilter === category
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} t={t} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <p className="text-lg sm:text-xl text-muted-foreground">
              {t("projects.noProjects", "No projects found in this category.")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function getCertificateImagePath(cert: Certification): string | null {
  if (cert.image) return cert.image;

  const credential = cert.credentialId?.toLowerCase() ?? "";
  if (credential.includes("6rqp-dwvw")) return "/certificates/html_and_css-cert.jpg";
  if (credential.includes("wvp2h-h94e")) return "/certificates/javascript-cert.jpg";

  return null;
}

// Section: Certifications
function CertificationsSection({ certifications, t }: { certifications: Certification[]; t: Translator }) {
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);

  useEffect(() => {
    if (!previewCert) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewCert(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewCert]);

  const previewImagePath = previewCert ? getCertificateImagePath(previewCert) : null;

  return (
    <section id="certifications" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <SectionHeader
          heading={t("certifications.title", "Achievements")}
          highlight={t("certifications.titleHighlight", "Certifications")}
          highlightPosition="start"
          subtitle={t("certifications.subtitle", "Professional certifications and recognized achievements")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="fade-in-up p-5 sm:p-6 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <Award className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-card-foreground">{cert.name}</h3>
                  <p className="text-primary font-semibold text-xs sm:text-sm">{cert.issuer}</p>
                  {cert.credentialId && (
                    <span className="text-xs sm:text-sm text-muted-foreground">{cert.credentialId}</span>
                  )}
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1">{cert.date}</p>
                  <div className="flex items-center gap-2 mt-4">
                    {getCertificateImagePath(cert) && (
                      <button
                        type="button"
                        onClick={() => setPreviewCert(cert)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t("certifications.viewCertificate", "View Certificate")}
                      </button>
                    )}
                    {cert.verifyUrl && (
                      <Link
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {t("certifications.verifyCertificate", "Verify Certificate")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {previewCert && previewImagePath && (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setPreviewCert(null)}
            role="dialog"
            aria-modal="true"
            aria-label={t("certifications.previewDialog", "Certificate preview")}
          >
            <div
              className="relative w-full max-w-5xl bg-card border border-border rounded-xl p-3 sm:p-4"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewCert(null)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                aria-label={t("certifications.closePreview", "Close preview")}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pr-12 mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-card-foreground">{previewCert.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{previewCert.issuer}</p>
              </div>

              <div className="w-full border border-border/60 rounded-lg bg-background p-2 sm:p-3">
                <Image
                  src={previewImagePath}
                  alt={`${previewCert.name} certificate`}
                  width={1600}
                  height={1200}
                  className="mx-auto w-auto h-auto max-w-full max-h-[72vh] object-contain"
                  priority
                />
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-3">
                {previewCert.verifyUrl && (
                  <Link
                    href={previewCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t("certifications.verifyCertificate", "Verify Certificate")}
                  </Link>
                )}
                <Link
                  href={previewImagePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {t("certifications.openNewTab", "Open in new tab")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Section: Languages
function LanguagesSection({ spokenLanguages, t }: { spokenLanguages: SpokenLanguage[]; t: Translator }) {
  return (
    <section id="languages" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <SectionHeader
          heading={t("languages.title", "Languages")}
          highlight={t("languages.titleHighlight", "Communication")}
          subtitle={t("languages.subtitle", "Spoken languages and communication proficiency")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {spokenLanguages.map((lang, index) => (
            <div
              key={index}
              className="fade-in-up p-6 sm:p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ transitionDelay: `${index * 80}ms` } as CSSProperties}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg shrink-0">
                  <Globe className="w-5 sm:w-6 h-5 sm:h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-card-foreground">{lang.language}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground font-semibold">{lang.proficiency}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section: Contact
function ContactSection({ personal, t }: { personal: Personal; t: Translator }) {
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "", message: "", website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const contactFormEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT;

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (formData.name.trim().length < 2 || formData.subject.trim().length < 3 || formData.message.trim().length < 10) {
      setSubmitState("error");
      setSubmitMessage(t("contact.form.validationError", "Please fill out all fields correctly."));
      return;
    }
    setIsSubmitting(true);
    setSubmitState("idle");
    setSubmitMessage("");
    try {
      if (!contactFormEndpoint) throw new Error(t("contact.form.notConfigured", "Contact form endpoint is not configured."));
      const response = await fetch(contactFormEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, subject: formData.subject, message: formData.message, website: formData.website }),
      });
      const payload = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(payload.message || t("contact.form.sendError", "Could not send your message."));
      setSubmitState("success");
      setSubmitMessage(payload.message || t("contact.form.sendSuccess", "Message sent. I will get back to you soon."));
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : t("contact.form.sendError", "Could not send your message."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-base text-foreground outline-none transition-[border-color,background-color] placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-secondary/70";
  const labelClass = "block text-xs font-medium tracking-widest uppercase text-muted-foreground/70 mb-2";

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 print:hidden">
      <div className="max-w-4xl w-full">
        <SectionHeader
          heading={t("contact.title", "Let's")}
          highlight={t("contact.titleHighlight", "Connect")}
          subtitle={t("contact.subtitle", "Always open to discussing new projects, creative ideas, or opportunities to be part of your vision.")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            <div className="fade-in-up p-5 bg-card rounded-2xl border border-border hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className={labelClass}>{t("contact.email", "Email")}</span>
              </div>
              <Link href={personal.social.email} className="text-base text-primary font-medium hover:underline break-all">
                {personal.email}
              </Link>
            </div>

            <div className="fade-in-up p-5 bg-card rounded-2xl border border-border hover:border-primary/40 transition-all duration-300" style={{ transitionDelay: "60ms" } as CSSProperties}>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span className={labelClass}>{t("contact.phone", "Phone")}</span>
              </div>
              <p className="text-base text-muted-foreground">{personal.phone}</p>
            </div>

            <div className="fade-in-up p-5 bg-card rounded-2xl border border-border hover:border-primary/40 transition-all duration-300" style={{ transitionDelay: "120ms" } as CSSProperties}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <ExternalLink className="w-4 h-4 text-primary" />
                </div>
                <span className={labelClass}>{t("contact.elsewhere", "Find me on")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {personal.social.github && (
                  <Link
                    href={personal.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full border border-border hover:border-primary/40 hover:text-foreground transition-all duration-200"
                  >
                    <Github className="w-3.5 h-3.5" />
                    GitHub
                  </Link>
                )}
                <Link
                  href={personal.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full border border-border hover:border-primary/40 hover:text-foreground transition-all duration-200"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            className="lg:col-span-2 fade-in-up p-6 sm:p-8 bg-card rounded-2xl border border-border space-y-5"
            style={{ transitionDelay: "60ms" } as CSSProperties}
            onSubmit={handleSubmit}
            noValidate
          >
            <div>
              <label className={labelClass}>{t("contact.form.name", "Name")}</label>
              <input type="text" name="name" autoComplete="name" required minLength={2} maxLength={80} value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} className={inputClass} placeholder={t("contact.form.namePlaceholder", "Your name")} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("contact.form.email", "Email")}</label>
                <input type="email" name="email" autoComplete="email" required maxLength={160} value={formData.email} onChange={(e) => handleFieldChange("email", e.target.value)} className={inputClass} placeholder={t("contact.form.emailPlaceholder", "you@example.com")} />
              </div>
              <div>
                <label className={labelClass}>{t("contact.form.subject", "Subject")}</label>
                <input type="text" name="subject" required minLength={3} maxLength={120} value={formData.subject} onChange={(e) => handleFieldChange("subject", e.target.value)} className={inputClass} placeholder={t("contact.form.subjectPlaceholder", "What's this about?")} />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t("contact.form.message", "Message")}</label>
              <textarea name="message" required minLength={10} maxLength={2000} rows={5} value={formData.message} onChange={(e) => handleFieldChange("message", e.target.value)} className={`${inputClass} resize-y min-h-14`} placeholder={t("contact.form.messagePlaceholder", "Tell me about your project or question...")} />
            </div>

            {/* Honeypot */}
            <input type="text" name="website" value={formData.website} onChange={(e) => handleFieldChange("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div className="pt-4 border-t border-border flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-base font-semibold rounded-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? t("contact.form.sending", "Sending…") : t("contact.form.submit", "Send message")}
              </button>

              {submitMessage && (
                <p className={`text-sm ${submitState === "success" ? "text-primary" : "text-destructive"}`} role="status" aria-live="polite">
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
// Global styles (animations + print)
function GlobalStyles() {
  return (
    <style jsx global>{`
      /* ─── Scroll-triggered fade-in-up ─── */
      .fade-in-up {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.55s ease, transform 0.55s ease;
      }
      .fade-in-up.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* ─── CV reveal / hide ─── */
      .cv-reveal-section {
        overflow: hidden;
        transition:
          opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1),
          transform 0.55s cubic-bezier(0.16, 1, 0.3, 1),
          max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cv-reveal-out {
        opacity: 0;
        transform: translateY(-12px);
        max-height: 0;
        padding-top: 0;
        padding-bottom: 0;
        pointer-events: none;
      }
      .cv-reveal-in {
        opacity: 1;
        transform: translateY(0);
        max-height: 9999px;
      }

      /* ─── Timeline dot ─── */
      .timeline-dot {
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .group:hover .timeline-dot {
        border-color: hsl(var(--primary));
        box-shadow: 0 0 0 4px hsl(var(--primary) / 0.15);
      }
      .timeline-dot span {
        animation: dot-pulse 3s ease-in-out infinite;
      }
      @keyframes dot-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.6; transform: scale(0.75); }
      }

      /* ─── Screen-only ─── */
      @media screen {
        .cv-document  { transition: all 0.3s ease; }
        .cv-skill-tag { transition: all 0.2s ease; }
      }

      /* ─── Print ─── */
      @media print {
        html, body, body > div, main {
          background-color: white !important;
          background-image: none !important;
        }
        :root {
          --background: white !important;
          --card: white !important;
          --secondary: white !important;
        }
        .cv-document, .cv-header, .cv-body, .cv-footer {
          background-color: white !important;
          background-image: none !important;
        }
        .cv-reveal-section {
          opacity: 1 !important;
          transform: none !important;
          max-height: none !important;
          padding: 0 !important;
          overflow: visible !important;
          pointer-events: auto !important;
        }

        /* Page break controls */
        .cv-header  { page-break-after: avoid !important; break-after: avoid !important; }
        .cv-summary { page-break-before: avoid !important; break-before: avoid !important; }
        .cv-experience {
          page-break-before: always !important; break-before: always !important;
          page-break-after: avoid !important;   break-after: avoid !important;
        }
        .cv-experience-item { page-break-inside: avoid !important; break-inside: avoid !important; }
        .cv-education       { page-break-inside: avoid !important; break-inside: avoid !important; }
        .cv-skills          { page-break-before: always !important; break-before: always !important; }
        .cv-certifications, .cv-languages {
          page-break-before: avoid !important; break-before: avoid !important;
          page-break-inside: avoid !important; break-inside: avoid !important;
        }
        .cv-footer {
          margin-top: 2rem !important;
          page-break-before: avoid !important;
          break-before: avoid !important;
        }

        .timeline-dot { display: none !important; }
        .fade-in-up   { opacity: 1 !important; transform: none !important; }
        .break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
        .cv-section   { break-inside: avoid; }

        .print\\:hidden          { display: none !important; }
        .print\\:py-0            { padding-top: 0 !important; padding-bottom: 0 !important; }
        .print\\:px-0            { padding-left: 0 !important; padding-right: 0 !important; }
        .print\\:p-12            { padding: 3rem !important; }
        .print\\:space-y-6 > * + * { margin-top: 1.5rem !important; }
        .print\\:space-y-5 > * + * { margin-top: 1.25rem !important; }
        .print\\:gap-3           { gap: 0.75rem !important; }
        .print\\:shadow-none     { box-shadow: none !important; }
        .print\\:border-0        { border-width: 0 !important; }
        .print\\:rounded-none    { border-radius: 0 !important; }
        .print\\:bg-white        { background-color: white !important; }
        .print\\:text-white      { color: white !important; }
        .print\\:text-black      { color: black !important; }
        .print\\:text-gray-900   { color: #111827 !important; }
        .print\\:text-gray-800   { color: #1f2937 !important; }
        .print\\:text-gray-700   { color: #374151 !important; }
        .print\\:text-gray-600   { color: #4b5563 !important; }
        .print\\:border-gray-300 { border-color: #d1d5db !important; }
        .print\\:border-t        { border-top: 1px solid #d1d5db !important; }
        .print\\:block           { display: block !important; }
        .print\\:opacity-100     { opacity: 1 !important; }
        .print\\:w-3, .print\\:h-3 { width: 0.75rem !important; height: 0.75rem !important; }
        .print\\:text-xs         { font-size: 0.75rem !important; line-height: 1rem !important; }

        a                        { text-decoration: none; }
        a[href^="http"]:after    { content: ""; }
        @page { margin: 1cm; size: A4; }
      }
    `}</style>
  );
}

// Root component
interface PortfolioPageClientProps {
  portfolioData: PortfolioData;
  cvType: CvType;
  t: Translator;
}

export default function PortfolioPageClient({ portfolioData, cvType, t }: PortfolioPageClientProps) {
  const { personal, skills, experience, education, values } = portfolioData;

  const projects = useMemo<Project[]>(() => portfolioData.projects ?? [], [portfolioData.projects]);
  const certifications = useMemo<Certification[]>(() => portfolioData.certifications ?? [], [portfolioData.certifications]);
  const spokenLanguages = useMemo<SpokenLanguage[]>(() => portfolioData.spokenLanguages ?? [], [portfolioData.spokenLanguages]);

  const [selectedFilter, setSelectedFilter] = useState(DEFAULT_PROJECT_FILTER);
  const [showCV, setShowCV] = useState(false);
  const [cvMounted, setCvMounted] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);
  const hideCvTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Register IntersectionObserver for all .fade-in-up elements
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleShowCV = useCallback(() => {
    if (hideCvTimeoutRef.current) {
      clearTimeout(hideCvTimeoutRef.current);
      hideCvTimeoutRef.current = null;
    }

    setCvMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowCV(true);
      });
    });
  }, []);

  const handleHideCV = useCallback(() => {
    setShowCV(false);

    if (hideCvTimeoutRef.current) {
      clearTimeout(hideCvTimeoutRef.current);
    }

    hideCvTimeoutRef.current = setTimeout(() => {
      setCvMounted(false);
      hideCvTimeoutRef.current = null;
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (hideCvTimeoutRef.current) {
        clearTimeout(hideCvTimeoutRef.current);
      }
    };
  }, []);

  const rawSkillCategories = useMemo(() => Object.values(skills) as SkillCategory[], [skills]);

  const skillCategories = useMemo(
    () =>
      rawSkillCategories.map((cat) => ({
        ...cat,
        icon: SKILL_ICON_MAP[cat.icon as keyof typeof SKILL_ICON_MAP] || Users,
      })),
    [rawSkillCategories]
  );

  const categories = useMemo(
    () => [DEFAULT_PROJECT_FILTER, ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filteredProjects = useMemo(
    () =>
      selectedFilter === DEFAULT_PROJECT_FILTER
        ? projects
        : projects.filter((p) => p.category === selectedFilter),
    [projects, selectedFilter]
  );

  const cvFooterHeightClass = cvType === "general" ? "print:min-h-180" : "print:min-h-86.5";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground print:bg-white print:text-black">
      <main className="relative z-10 print:bg-white">
        <HeroSection personal={personal} t={t} />

        <AboutSection
          personal={personal}
          showCV={showCV}
          onShowCV={handleShowCV}
          onHideCV={handleHideCV}
          onPrintCV={() => window.print()}
          t={t}
        />

        {cvMounted && (
          <CVSection
            cvRef={cvRef}
            showCV={showCV}
            personal={personal}
            experience={experience}
            education={education}
            rawSkillCategories={rawSkillCategories}
            certifications={certifications}
            spokenLanguages={spokenLanguages}
            cvFooterHeightClass={cvFooterHeightClass}
            t={t}
          />
        )}

        <ValuesSection values={values} t={t} />
        <ExperienceSection experience={experience} t={t} />
        <EducationSection education={education} t={t} />
        <SkillsSection skillCategories={skillCategories} t={t} />

        <ProjectsSection
          projects={projects}
          categories={categories}
          filteredProjects={filteredProjects}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          t={t}
        />

        {certifications.length > 0 && <CertificationsSection certifications={certifications} t={t} />}
        {spokenLanguages.length > 0 && <LanguagesSection spokenLanguages={spokenLanguages} t={t} />}

        <ContactSection personal={personal} t={t} />
      </main>

      <GlobalStyles />
    </div>
  );
}