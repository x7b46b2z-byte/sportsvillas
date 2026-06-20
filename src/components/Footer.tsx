import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-12 mt-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="space-y-4 max-w-xs">
            <span className="text-xl font-semibold tracking-tight text-gradient-brand italic">IDEACLICK</span>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The ultimate aggregator for global sports streaming. Every goal, wicket, and lap.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-navy">Platform</h5>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><Link to="/" className="hover:text-brand-blue">Live Now</Link></li>
                <li><Link to="/upcoming" className="hover:text-brand-blue">Upcoming</Link></li>
                <li><Link to="/leagues" className="hover:text-brand-blue">Leagues</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-navy">Company</h5>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><Link to="/about" className="hover:text-brand-blue">About</Link></li>
                <li><Link to="/contact" className="hover:text-brand-blue">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-navy">Legal</h5>
              <ul className="text-sm text-zinc-500 space-y-2">
                <li><Link to="/privacy" className="hover:text-brand-blue">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-brand-blue">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-100 text-center text-xs text-zinc-400 font-medium">
          © {new Date().getFullYear()} IDEACLICK SPORTS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
