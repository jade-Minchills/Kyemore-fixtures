'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Menu, X, Upload, CalendarPlus, Calendar, Eye } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  activePage: 'upload' | 'events' | 'fixtures';
}

const navLinks = [
  { href: '/admin/upload',   label: 'CSV Upload',       icon: Upload,       key: 'upload'   },
  { href: '/admin/events',   label: 'Manage Events',    icon: CalendarPlus, key: 'events'   },
  { href: '/admin/fixtures', label: 'Manage Fixtures',  icon: Calendar,     key: 'fixtures' },
  { href: '/fixtures',       label: 'View Fixtures',    icon: Eye,          key: 'view'     },
];

export function AdminHeader({ title, subtitle, activePage }: AdminHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-6">
          {/* Title */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-0.5 hidden sm:block">{subtitle}</p>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  link.key === activePage
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile: logout + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    link.key === activePage
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-green-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
