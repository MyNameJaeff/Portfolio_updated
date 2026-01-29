"use client";
import { Code2, Lightbulb, Target, Users, ArrowRight, Download, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Award, Globe } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import portfolioData from "@/data/portoflio-data.json";

export default function AboutPage() {
    const cvRef = useRef<HTMLDivElement>(null);

    const handlePrintCV = () => {
        window.print();
    };

    const { personal, experience, education, values, skills, certifications, spokenLanguages } = portfolioData;

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
            {/* Main Content */}
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="flex min-h-screen items-center justify-center px-6 py-32 print:hidden">
                    <div className="max-w-4xl w-full">
                        <div className="space-y-8">
                            <div>
                                <p className="text-sm font-medium tracking-wider uppercase text-primary opacity-80 mb-4">
                                    About Me
                                </p>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6">
                                    Passionate About
                                    <br />
                                    <span className="text-primary">Building Solutions</span>
                                </h1>
                            </div>

                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                                <p>{personal.bio}</p>
                                <p>
                                    When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/projects"
                                    className="group inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                                >
                                    View My Work
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border"
                                >
                                    Get in Touch
                                </Link>
                                <button
                                    onClick={handlePrintCV}
                                    className="inline-flex items-center px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent/80 border border-border"
                                >
                                    <Download className="mr-2 w-4 h-4" />
                                    Download CV
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CV Section - Printable */}
                <section ref={cvRef} className="px-6 py-20 print:py-0 print:px-0">
                    <div className="max-w-5xl mx-auto bg-white text-black print:shadow-none print:max-w-none">
                        {/* CV Header */}
                        <div className="p-8 print:p-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white print:bg-gradient-to-r print:from-gray-800 print:to-gray-900">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">{personal.name}</h1>
                            <p className="text-xl md:text-2xl font-light mb-4">{personal.title}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <a href={personal.social.email} className="hover:underline">{personal.email}</a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{personal.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{personal.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <a href={personal.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        LinkedIn Profile
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* CV Content */}
                        <div className="p-8 print:p-12 space-y-8">
                            {/* Professional Summary */}
                            <section>
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Professional Summary
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{personal.tagline}</p>
                                <p className="text-gray-700 leading-relaxed mt-2">{personal.bio}</p>
                            </section>

                            {/* Experience */}
                            <section className="print:break-inside-avoid">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Professional Experience
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((exp, index) => (
                                        <div key={index} className="print:break-inside-avoid">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                                                    <p className="text-lg font-semibold text-blue-600 print:text-gray-700">{exp.company}</p>
                                                </div>
                                                <div className="text-right text-sm text-gray-600">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{exp.period}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 mb-3">{exp.description}</p>
                                            <ul className="list-none space-y-1 ml-0">
                                                {exp.responsibilities.map((resp, idx) => (
                                                    <li key={idx} className="text-gray-700 flex items-start gap-2">
                                                        <span className="text-blue-600 print:text-gray-800 mt-1.5">•</span>
                                                        <span>{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {exp.skills.map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 print:bg-gray-200 print:text-gray-800 rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Education */}
                            <section className="print:break-inside-avoid">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <GraduationCap className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Education
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                                                    <p className="text-lg font-semibold text-blue-600 print:text-gray-700">{edu.institution}</p>
                                                </div>
                                                <div className="text-right text-sm text-gray-600">
                                                    <div className="flex items-center gap-1 justify-end">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{edu.period}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end mt-1">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{edu.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{edu.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Skills */}
                            <section className="print:break-inside-avoid">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <Code2 className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Technical Skills
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(skills).map(([key, category]: [string, any]) => (
                                        <div key={key}>
                                            <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {category.skills.map((skill: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Certifications */}
                            <section className="print:break-inside-avoid">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Certifications
                                </h2>
                                <div className="space-y-3">
                                    {certifications.map((cert, index) => (
                                        <div key={index} className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{cert.name}</h3>
                                                <p className="text-sm text-gray-600">{cert.issuer}</p>
                                            </div>
                                            <span className="text-sm text-gray-600">{cert.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Languages */}
                            <section className="print:break-inside-avoid">
                                <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                                    <Globe className="w-6 h-6 text-blue-600 print:text-gray-800" />
                                    Languages
                                </h2>
                                <div className="flex gap-6">
                                    {spokenLanguages.map((lang, index) => (
                                        <div key={index}>
                                            <span className="font-bold text-gray-900">{lang.language}:</span>{" "}
                                            <span className="text-gray-700">{lang.proficiency}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* CV Footer */}
                        <div className="p-8 print:p-12 bg-gray-100 text-center text-sm text-gray-600 print:bg-white print:border-t print:border-gray-300">
                            <p>References available upon request</p>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="min-h-screen flex items-center justify-center px-6 py-20 print:hidden">
                    <div className="max-w-6xl w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Core <span className="text-primary">Values</span>
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                The principles that guide my approach to software development
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {values.map((value, index) => {
                                const iconMap: { [key: string]: any } = {
                                    'Code2': Code2,
                                    'Lightbulb': Lightbulb,
                                    'Target': Target,
                                    'Users': Users
                                };
                                const Icon = iconMap[value.icon];
                                return (
                                    <div
                                        key={index}
                                        className="group p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                                <Icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2 text-card-foreground">
                                                    {value.title}
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed">
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
                <section className="min-h-screen flex items-center justify-center px-6 py-20 print:hidden">
                    <div className="max-w-4xl w-full">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Professional <span className="text-primary">Journey</span>
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Key roles and projects that have shaped my career
                            </p>
                        </div>

                        <div className="space-y-8">
                            {experience.map((exp, index) => (
                                <div
                                    key={index}
                                    className="group relative p-8 bg-card backdrop-blur-sm rounded-2xl border border-border hover:border-primary/50 transition-all duration-300"
                                >
                                    {/* Timeline dot */}
                                    <div className="absolute -left-3 top-10 w-6 h-6 bg-primary rounded-full border-4 border-background hidden md:block"></div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                            <div>
                                                <h3 className="text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                                                    {exp.title}
                                                </h3>
                                                <p className="text-lg text-primary font-semibold">
                                                    {exp.company}
                                                </p>
                                            </div>
                                            <span className="text-muted-foreground font-medium">
                                                {exp.period}
                                            </span>
                                        </div>

                                        <p className="text-muted-foreground leading-relaxed">
                                            {exp.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2">
                                            {exp.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full border border-border"
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

                {/* CTA Section */}
                <section className="min-h-[60vh] flex items-center justify-center px-6 py-20 print:hidden">
                    <div className="max-w-3xl w-full text-center">
                        <div className="p-12 bg-card backdrop-blur-sm rounded-2xl border border-border">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Let&apos;s Build Something <span className="text-primary">Amazing</span>
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                I&apos;m always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-1 shadow-lg"
                                >
                                    Get in Touch
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                                <Link
                                    href="/projects"
                                    className="inline-flex items-center justify-center px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-lg transition-all duration-300 hover:bg-accent hover:text-accent-foreground border border-border"
                                >
                                    View Projects
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body {
                        background: white;
                    }
                    
                    .print\\:hidden {
                        display: none !important;
                    }
                    
                    .print\\:block {
                        display: block !important;
                    }
                    
                    .print\\:p-12 {
                        padding: 3rem !important;
                    }
                    
                    .print\\:py-0 {
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                    }
                    
                    .print\\:px-0 {
                        padding-left: 0 !important;
                        padding-right: 0 !important;
                    }
                    
                    .print\\:shadow-none {
                        box-shadow: none !important;
                    }
                    
                    .print\\:max-w-none {
                        max-width: none !important;
                    }
                    
                    .print\\:bg-gradient-to-r {
                        background: linear-gradient(to right, var(--tw-gradient-stops)) !important;
                    }
                    
                    .print\\:from-gray-800 {
                        --tw-gradient-from: #1f2937 !important;
                        --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(31, 41, 55, 0)) !important;
                    }
                    
                    .print\\:to-gray-900 {
                        --tw-gradient-to: #111827 !important;
                    }
                    
                    .print\\:text-gray-800 {
                        color: #1f2937 !important;
                    }
                    
                    .print\\:text-gray-700 {
                        color: #374151 !important;
                    }
                    
                    .print\\:bg-gray-200 {
                        background-color: #e5e7eb !important;
                    }
                    
                    .print\\:bg-white {
                        background-color: white !important;
                    }
                    
                    .print\\:border-t {
                        border-top-width: 1px !important;
                    }
                    
                    .print\\:border-gray-300 {
                        border-color: #d1d5db !important;
                    }
                    
                    .print\\:break-inside-avoid {
                        break-inside: avoid !important;
                    }
                    
                    @page {
                        margin: 1cm;
                    }
                }
            `}</style>
        </div>
    );
}