import { useState, useCallback, useMemo } from 'react';
import {
  Terminal,
  Cpu,
  Database,
  Server,
  ShieldCheck,
  GitBranch,
  ArrowUpRight,
  FileText,
  Mail,
  Github,
  MapPin,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Zap,
} from 'lucide-react';
import SEO from '../components/SEO';
import CVFile from '../assets/cv/Ichwan_Ardianto_Resume.pdf';
import { ABOUT } from '../utils/constants';
import { useApp } from '../contexts/AppContext';

function AboutPage() {
  const { language, isDarkMode } = useApp();

  const t = useMemo(() => ABOUT[language] || ABOUT.id, [language]);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleDownloadCV = useCallback(() => {
    const link = document.createElement('a');
    link.href = CVFile;
    link.download = 'Ichwan_Ardianto_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleCopyEmail = useCallback(() => {
    navigator.clipboard.writeText('ichwanpwt22@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }, []);

  const theme = useMemo(
    () => ({
      bg: isDarkMode ? 'bg-dark text-slate-100' : 'bg-white text-slate-900',
      cardBg: isDarkMode
        ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300',
      subtleText: isDarkMode ? 'text-slate-400' : 'text-slate-600',
      pillBg: isDarkMode ? 'bg-slate-800/80 text-slate-300 border-slate-700/60' : 'bg-slate-100 text-slate-700 border-slate-200',
      sectionHeader: isDarkMode ? 'text-slate-100' : 'text-slate-900',
      border: isDarkMode ? 'border-slate-800' : 'border-slate-200',
      accentBadge: isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200',
    }),
    [isDarkMode]
  );

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${theme.bg}`}>
      <SEO pageKey="about" />

      <div className="max-w-4xl mx-auto space-y-16">
        {/* HEADER / INTRO */}
        <section className="space-y-6">
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs font-mono">
            <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border ${theme.accentBadge}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              {t.statusAvailable}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border ${theme.pillBg}`}>
              <GraduationCap className="w-3.5 h-3.5 opacity-70 shrink-0" />
              {t.statusGraduation}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md border ${theme.pillBg}`}>
              <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
              {t.statusLocation}
            </span>
          </div>

          {/* Intro Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug">{t.heroTitle}</h1>
            <p className={`text-base sm:text-lg leading-relaxed ${theme.subtleText}`}>{t.heroBio}</p>
          </div>

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            <button
              onClick={handleDownloadCV}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer active:scale-95 w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 shrink-0" />
              {t.ctaCv}
            </button>

            <div className="flex flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
              <a
                href="https://github.com/IchwanArdi"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm border transition-colors cursor-pointer flex-1 sm:flex-none ${theme.pillBg}`}
              >
                <Github className="w-4 h-4 shrink-0" />
                <span>GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
              </a>

              <button
                onClick={handleCopyEmail}
                className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-lg font-mono text-xs sm:text-sm border transition-colors cursor-pointer flex-1 sm:flex-none ${theme.pillBg}`}
              >
                <Mail className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate sm:whitespace-nowrap">ichwanpwt22@gmail.com</span>
                {copiedEmail && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
              </button>
            </div>
          </div>
        </section>

        {/* KEY HIGHLIGHTS (Bento) */}
        <section className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${theme.sectionHeader}`}>{t.highlightsTitle}</h2>
            <p className={`text-xs sm:text-sm ${theme.subtleText}`}>{t.highlightsSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Highlight 1: Trackly Latency */}
            <div className={`p-5 rounded-xl border space-y-2.5 ${theme.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold font-mono text-amber-500">{t.highlight1Number}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  {t.highlight1Label}
                </span>
              </div>
              <h3 className="font-semibold text-base">{t.highlight1Title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{t.highlight1Desc}</p>
            </div>

            {/* Highlight 2: Open Source CLI */}
            <div className={`p-5 rounded-xl border space-y-2.5 ${theme.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-slate-300">
                  <Terminal className="w-3 h-3" />
                  {t.highlight2Badge}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Go (Golang)</span>
              </div>
              <h3 className="font-semibold text-base">{t.highlight2Title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{t.highlight2Desc}</p>
            </div>

            {/* Highlight 3: PuskoMedia Intern */}
            <div className={`p-5 rounded-xl border space-y-2.5 ${theme.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-slate-300">
                  <Briefcase className="w-3 h-3" />
                  {t.highlight3Badge}
                </span>
                <span className="text-[11px] font-mono text-slate-500">PuskoMedia</span>
              </div>
              <h3 className="font-semibold text-base">{t.highlight3Title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{t.highlight3Desc}</p>
            </div>

            {/* Highlight 4: Thesis FIDO2 */}
            <div className={`p-5 rounded-xl border space-y-2.5 ${theme.cardBg}`}>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-700 bg-slate-800/50 text-slate-300">
                  <ShieldCheck className="w-3 h-3" />
                  {t.highlight4Badge}
                </span>
                <span className="text-[11px] font-mono text-slate-500">WebAuthn</span>
              </div>
              <h3 className="font-semibold text-base">{t.highlight4Title}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{t.highlight4Desc}</p>
            </div>
          </div>
        </section>

        {/* TECH STACK MATRIX */}
        <section className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${theme.sectionHeader}`}>{t.techTitle}</h2>
            <p className={`text-xs sm:text-sm ${theme.subtleText}`}>{t.techSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Backend & Core */}
            <div className={`p-4 rounded-xl border ${theme.cardBg} space-y-2.5`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-500 font-mono">
                <Server className="w-3.5 h-3.5" />
                <span>{t.categories.backend}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.skillsList.backend.map((skill) => (
                  <span key={skill} className={`px-2.5 py-1 rounded text-xs font-mono border ${theme.pillBg}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* DevOps & Tools */}
            <div className={`p-4 rounded-xl border ${theme.cardBg} space-y-2.5`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-cyan-400 font-mono">
                <Cpu className="w-3.5 h-3.5" />
                <span>{t.categories.devops}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.skillsList.devops.map((skill) => (
                  <span key={skill} className={`px-2.5 py-1 rounded text-xs font-mono border ${theme.pillBg}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Database */}
            <div className={`p-4 rounded-xl border ${theme.cardBg} space-y-2.5`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-emerald-400 font-mono">
                <Database className="w-3.5 h-3.5" />
                <span>{t.categories.database}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.skillsList.database.map((skill) => (
                  <span key={skill} className={`px-2.5 py-1 rounded text-xs font-mono border ${theme.pillBg}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Frontend & AI */}
            <div className={`p-4 rounded-xl border ${theme.cardBg} space-y-2.5`}>
              <div className="flex items-center gap-2 font-semibold text-xs text-indigo-400 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.categories.frontendAi}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.skillsList.frontendAi.map((skill) => (
                  <span key={skill} className={`px-2.5 py-1 rounded text-xs font-mono border ${theme.pillBg}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CAREER TIMELINE */}
        <section className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${theme.sectionHeader}`}>{t.timelineTitle}</h2>
            <p className={`text-xs sm:text-sm ${theme.subtleText}`}>{t.timelineSubtitle}</p>
          </div>

          <div className="space-y-3">
            {t.timelineItems.map((item, idx) => (
              <div key={idx} className={`p-5 rounded-xl border space-y-2.5 transition-colors ${theme.cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono text-amber-500 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {item.period}
                  </span>
                  <span className={`text-xs font-mono ${theme.subtleText}`}>{item.location}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base">
                    {item.role} <span className="font-normal text-slate-400">@ {item.company}</span>
                  </h3>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{item.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className={`text-xs font-mono px-2 py-0.5 rounded border ${theme.pillBg}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ENGINEERING PRINCIPLES */}
        <section className="space-y-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${theme.sectionHeader}`}>{t.principlesTitle}</h2>
            <p className={`text-xs sm:text-sm ${theme.subtleText}`}>{t.principlesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {t.principles.map((principle, idx) => {
              const icons = [Zap, Cpu, Sparkles, GitBranch];
              const IconComp = icons[idx % icons.length];
              return (
                <div key={idx} className={`p-4 rounded-xl border ${theme.cardBg} space-y-2`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-semibold text-sm">{principle.title}</h3>
                  </div>
                  <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 ${theme.cardBg}`}>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t.ctaTitle}</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${theme.subtleText}`}>{t.ctaDesc}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="mailto:ichwanpwt22@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity cursor-pointer active:scale-95"
            >
              <Mail className="w-4 h-4" />
              {t.ctaEmail}
            </a>

            <a
              href="https://github.com/IchwanArdi"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm border transition-colors cursor-pointer ${theme.pillBg}`}
            >
              <Github className="w-4 h-4" />
              {t.ctaGithub}
            </a>

            <button
              onClick={handleDownloadCV}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-xs sm:text-sm border transition-colors cursor-pointer ${theme.pillBg}`}
            >
              <FileText className="w-4 h-4" />
              {t.ctaCv}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;