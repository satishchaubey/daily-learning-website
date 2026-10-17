'use client';

import React from 'react';
import { Flame, Zap } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, StreakTier } from '../types';

interface StreakBannerProps {
  user: User;
  onSimulateActivity: (tier: StreakTier) => void;
  onUseFreeze: () => void;
}

export const StreakBanner: React.FC<StreakBannerProps> = ({ user, onSimulateActivity }) => {
  return (
    <Card className="my-6 border-slate-200 bg-white shadow-xs">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Headline & Policy */}
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50/50 gap-1 font-semibold">
                <Flame className="w-3.5 h-3.5" />
                STRICT MOMENTUM ENGINE
              </Badge>
              <span className="text-xs text-slate-500 font-medium">Daily Midnight Rollover</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-1">
              Multi-Tier Mastery Streaks
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Designed for Amazon Senior SDE candidates. Consistency is non-negotiable: missing a full day resets that tier's streak back to Day 1.
            </p>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            {/* Easy Tier Card */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-4 flex flex-col justify-between min-w-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 mb-1">
                  <span>🟢 EASY TIER</span>
                  <Flame className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {user.streaks.easy.current} <span className="text-xs font-normal text-slate-500">days</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Best: {user.streaks.easy.longest}d • Read 1 Chapter
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSimulateActivity('easy')}
                className="w-full text-xs h-7 border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-700"
              >
                <Zap className="w-3 h-3 mr-1 text-emerald-600" /> Read Chapter
              </Button>
            </div>

            {/* Medium Tier Card */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4 flex flex-col justify-between min-w-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                  <span>🟡 MEDIUM TIER</span>
                  <Flame className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {user.streaks.medium.current} <span className="text-xs font-normal text-slate-500">days</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Best: {user.streaks.medium.longest}d • 1 LeetCode/Code
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSimulateActivity('medium')}
                className="w-full text-xs h-7 border-amber-200 bg-white hover:bg-amber-50 text-amber-700"
              >
                <Zap className="w-3 h-3 mr-1 text-amber-600" /> Solve Code
              </Button>
            </div>

            {/* Advanced Tier Card */}
            <div className="rounded-lg border border-rose-200 bg-rose-50/30 p-4 flex flex-col justify-between min-w-[170px]">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-rose-800 mb-1">
                  <span>🔴 ADVANCED TIER</span>
                  <Flame className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {user.streaks.advanced.current} <span className="text-xs font-normal text-slate-500">days</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 mb-3">
                  Best: {user.streaks.advanced.longest}d • System Design/LLD
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSimulateActivity('advanced')}
                className="w-full text-xs h-7 border-rose-200 bg-white hover:bg-rose-50 text-rose-700"
              >
                <Zap className="w-3 h-3 mr-1 text-rose-600" /> Design Lab
              </Button>
            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  );
};
