import { GraduationCap } from 'lucide-react';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/80 via-slate-50 to-slate-100">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">java.in Internship Program</h1>
              <p className="text-xs text-slate-500">One task internship program for students</p>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <p>Submit your internship tasks securely. Only the program owner reviews submissions.</p>
      </footer>
    </div>
  );
}
