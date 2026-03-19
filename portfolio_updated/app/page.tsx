"use client";

import { useMemo } from "react";
import PortfolioPageClient, { CvType, PortfolioData } from "@/components/PortfolioPageClient";
import { useLanguage } from "@/components/LanguageProvider";

import portfolioEn from "@/data/portfolio-en.json";
import portfolioSv from "@/data/portfolio-sv.json";
import cvAllmant from "@/data/cv_allmant_sv.json";

const CV_TYPE: CvType = "tech";

export default function Home() {
    const { language, t } = useLanguage();

    const portfolioData = useMemo<PortfolioData>(() => {
        if (CV_TYPE === "general") {
            return cvAllmant as PortfolioData;
        }

        return (language === "sv" ? portfolioSv : portfolioEn) as PortfolioData;
    }, [language]);

    return <PortfolioPageClient portfolioData={portfolioData} cvType={CV_TYPE} t={t} />;
}
