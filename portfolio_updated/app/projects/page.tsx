"use client";
import { useState } from "react";
import { Github, Linkedin, ExternalLink, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import portfolioData from "@/data/portoflio-data.json";

export default function ProjectsPage() {
    const [selectedFilter, setSelectedFilter] = useState("All");

    const { projects } = portfolioData;

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

    const filteredProjects = selectedFilter === "All"
        ? projects
        : projects.filter(p => p.category === selectedFilter);

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="flex min-h-[60vh] items-center justify-center px-6 py-32">
                    <div className="max-w-4xl w-full text-center">
                        <p className="text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-4">
                            Portfolio
                        </p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                            Featured
                            <br />
                            <span className="text-primary">Projects</span>
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Explore my complete portfolio of projects, from enterprise solutions to innovative tools.
                            Each project represents a unique challenge and a learning experience.
                        </p>
                    </div>
                </section>

                {/* Filter Section */}
                <section className="px-6 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Filter className="w-5 h-5" />
                                <span className="font-semibold">Filter by:</span>
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
                </section>

                {/* Projects Grid */}
                <section className="px-6 pb-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="group relative bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-2xl"
                                >
                                    {/* Project Image */}
                                    <div className="relative h-64 bg-secondary/20 overflow-hidden">
                                        {/* Placeholder gradient */}
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
                                            {project.description}
                                        </p>

                                        {/* Features List */}
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

                {/* CTA Section */}
                <section className="px-6 pb-20">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="p-12 bg-card backdrop-blur-sm rounded-2xl border border-border">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Have a Project in Mind?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                I&apos;m always open to discussing new projects and opportunities. Let&apos;s build something amazing together!
                            </p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg"
                            >
                                Get in Touch
                                <ExternalLink className="ml-2 w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}