"use client";
import { Github, Linkedin, Mail, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import portfolioData from "@/data/portoflio-data.json";
import { Code2, Database, Cloud, Wrench, Users, Languages } from "lucide-react";

export default function Home() {
  const { personal, skills, projects } = portfolioData;
  const [selectedFilter, setSelectedFilter] = useState("All");

  // Icon mapping for skills
  const iconMap: { [key: string]: any } = {
    'Code2': Code2,
    'Database': Database,
    'Cloud': Cloud,
    'Wrench': Wrench,
    'Users': Users,
    'Languages': Languages
  };

  // Convert skills object to array with icons
  const skillCategories = Object.entries(skills).map(([key, category]: [string, any]) => ({
    ...category,
    icon: iconMap[category.icon]
  }));

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedFilter === "All"
    ? projects
    : projects.filter(p => p.category === selectedFilter);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="home" className="flex min-h-screen items-center justify-center px-6 py-20">
          <div className="max-w-4xl w-full">
            {/* Name & Title */}
            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <p className="text-sm font-medium tracking-wider uppercase text-primary opacity-80">
                  Portfolio
                </p>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground">
                  {personal.name.split(' ')[0]}
                  <br />
                  <span className="text-primary ml-8">{personal.name.split(' ')[1]}</span>
                </h1>
              </div>

              <h2 className="text-2xl md:text-3xl font-light text-muted-foreground">
                {personal.title}
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {personal.tagline}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              >
                Get in Touch
                <Mail className="inline-block ml-2 w-4 h-4" />
              </a>

              <a
                href="#projects"
                className="group px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border"
              >
                View Projects
                <ExternalLink className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href={personal.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>

              <Link
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>

              <Link
                href={personal.social.email}
                className="p-3 bg-secondary hover:bg-accent rounded-lg transition-all duration-300 group border border-border"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-secondary-foreground group-hover:text-accent-foreground transition-colors" />
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                About <span className="text-primary">Me</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Passionate developer with a drive to create impactful solutions
              </p>
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-card backdrop-blur-sm rounded-2xl border border-border">
                <h3 className="text-2xl font-bold mb-4 text-card-foreground">Who I Am</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {personal.tagline}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I specialize in building modern web applications with a focus on performance,
                  user experience, and clean code. My passion lies in turning complex problems
                  into elegant, intuitive solutions.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                  <h4 className="text-xl font-bold mb-3 text-card-foreground">Education</h4>
                  <p className="text-muted-foreground">
                    Continuous learner with a focus on modern web technologies and best practices
                  </p>
                </div>

                <div className="p-6 bg-card backdrop-blur-sm rounded-2xl border border-border">
                  <h4 className="text-xl font-bold mb-3 text-card-foreground">Experience</h4>
                  <p className="text-muted-foreground">
                    Building production-ready applications and solving real-world challenges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Skills & <span className="text-primary">Expertise</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A comprehensive toolkit built through hands-on experience and continuous learning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-6 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <div className="relative flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} bg-opacity-10`}>
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-card-foreground">
                        {category.title}
                      </h3>
                    </div>

                    {/* Skills list */}
                    <div className="relative flex flex-wrap gap-2">
                      {category.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 text-sm bg-secondary/50 text-secondary-foreground rounded-full border border-border/50 hover:border-primary/50 transition-colors"
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
        <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-7xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="text-primary">Projects</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore my portfolio showcasing various technologies and problem-solving approaches
              </p>
            </div>

            {/* Filter Section */}
            <div className="mb-12">
              <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="w-5 h-5" />
                  <span className="font-semibold">Filter:</span>
                </div>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedFilter(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedFilter === category
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-64 bg-secondary/20 overflow-hidden">
                    {/* Placeholder gradient if no image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5"></div>

                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs font-semibold text-primary border border-border">
                      {project.category}
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Project links overlay */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {project.github && (
                        <Link
                          href={project.github}
                          target="_blank"
                          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View on GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </Link>
                      )}

                      {project.linkedIn && (
                        <Link
                          href={project.linkedIn}
                          target="_blank"
                          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View on LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Link>
                      )}

                      {project.link && (
                        <Link
                          href={project.link}
                          target="_blank"
                          className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                          aria-label="View live project"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {project.description || project.shortDescription}
                    </p>

                    {/* Features List (if available) */}
                    {project.features && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-card-foreground mb-2">Key Features:</p>
                        <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                          {project.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.link && (
                      <Link
                        href={project.link}
                        className="inline-flex items-center text-primary font-semibold hover:underline group/link"
                      >
                        View Project
                        <ExternalLink className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No projects found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-2xl w-full text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Let&apos;s <span className="text-primary">Connect</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
              <Link
                href={personal.social.email}
                className="inline-flex items-center justify-center px-12 py-5 bg-primary text-primary-foreground text-lg font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg"
              >
                <Mail className="mr-3 w-5 h-5" />
                Send me an email
              </Link>
              <Link
                href={personal.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-12 py-5 bg-primary text-primary-foreground text-lg font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg"
              >
                <Linkedin className="mr-3 w-5 h-5" />
                Connect on LinkedIn
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}