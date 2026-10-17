'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, Shield, Layers, Code2, Cpu, LogOut, LogIn, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  user: User;
  activeTab: 'roadmaps' | 'practice' | 'visualizers' | 'book';
  onSelectTab: (tab: 'roadmaps' | 'practice' | 'visualizers' | 'book') => void;
  onUseFreeze: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, activeTab, onSelectTab, onUseFreeze }) => {
  const { isAuthenticated, logout, user: authUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const displayName = authUser?.username || user?.username || 'L6 Candidate';
  const displayInitial = (displayName[0] || 'L').toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={() => onSelectTab('roadmaps')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>DevMastery</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                L6 Bar
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">Daily Learning & Architecture</p>
          </div>
        </div>

        {/* Center Nav Items using shadcn Button */}
        <nav className="flex items-center gap-1">
          <Button
            variant={activeTab === 'roadmaps' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSelectTab('roadmaps')}
            className="text-slate-700 font-medium"
          >
            <Layers className="w-4 h-4 mr-1.5 text-slate-500" />
            Roadmaps (46)
          </Button>

          <Button
            variant={activeTab === 'practice' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSelectTab('practice')}
            className="text-slate-700 font-medium"
          >
            <Code2 className="w-4 h-4 mr-1.5 text-slate-500" />
            Code Workspace
          </Button>

          <Button
            variant={activeTab === 'visualizers' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSelectTab('visualizers')}
            className="text-slate-700 font-medium"
          >
            <Cpu className="w-4 h-4 mr-1.5 text-slate-500" />
            Interactive Visualizers
          </Button>
        </nav>

        {/* Right Status Badges & Auth */}
        <div className="flex items-center gap-2">
          {user?.streaks && (
            <>
              <Badge variant="easy" className="hidden sm:inline-flex gap-1 py-1 px-2" title="Easy Streak: Daily Chapter Reading">
                <Flame className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user.streaks.easy?.current || 0}d Easy</span>
              </Badge>

              <Badge variant="medium" className="hidden md:inline-flex gap-1 py-1 px-2" title="Medium Streak: Daily LeetCode & Code Practice">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>{user.streaks.medium?.current || 0}d Med</span>
              </Badge>

              <Badge variant="advanced" className="hidden lg:inline-flex gap-1 py-1 px-2" title="Advanced Streak: Daily System Design & LLD">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>{user.streaks.advanced?.current || 0}d Adv</span>
              </Badge>

              {/* Freeze Token Action */}
              <Button
                variant="outline"
                size="sm"
                onClick={onUseFreeze}
                className="h-8 text-xs font-medium text-sky-700 border-sky-200 bg-sky-50/50 hover:bg-sky-100/60"
                title="Freeze token protects streak from midnight reset"
              >
                <Shield className="w-3.5 h-3.5 mr-1 text-sky-600" />
                {user.streaks.freezeTokens || 0} Freeze
              </Button>
            </>
          )}

          {/* Auth State */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs"
                title={`Logged in as ${displayName}`}
              >
                {displayInitial}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-2 text-xs text-slate-600 hover:text-red-600"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-slate-700">
                  <LogIn className="w-3.5 h-3.5 mr-1" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-8 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
