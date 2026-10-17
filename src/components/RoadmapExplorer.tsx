'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Roadmap, User } from '../types';

interface RoadmapExplorerProps {
  roadmaps: Roadmap[];
  user: User;
  onSelectRoadmap: (roadmap: Roadmap) => void;
}

export const RoadmapExplorer: React.FC<RoadmapExplorerProps> = ({ roadmaps, user, onSelectRoadmap }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    roadmaps.forEach((r) => set.add(r.category));
    return ['All', ...Array.from(set).sort()];
  }, [roadmaps]);

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((r) => {
      const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [roadmaps, selectedCategory, search]);

  return (
    <section className="my-8">
      
      {/* Header and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Curated Developer Tracks
            </h1>
            <Badge variant="secondary" className="font-semibold text-xs text-slate-700">
              {roadmaps.length} Books
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Structured modules with clear chapter reading, code practice, and system design challenges.
          </p>
        </div>

        {/* Search using shadcn Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search System Design, Redis, AI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-slate-200"
          />
        </div>
      </div>

      {/* Category Pills using shadcn Button variants */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full text-xs font-medium whitespace-nowrap h-8 px-3.5"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Roadmaps Grid using shadcn Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoadmaps.map((r) => {
          const completedInTrack = user.completedTopicIds.filter((id) => id.startsWith(r.slug)).length;
          const progressPercent = Math.min(100, Math.round((completedInTrack / Math.max(1, r.totalTopics)) * 100));

          return (
            <Card
              key={r.slug}
              onClick={() => onSelectRoadmap(r)}
              className="cursor-pointer hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[11px] font-normal text-slate-600 border-slate-200 bg-slate-50">
                    {r.category}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    {r.totalChapters} Modules
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-slate-800">
                  {r.title}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {r.totalTopics} topics covering architecture, implementation patterns, and core compute.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Clean Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Mastery Progress</span>
                    <span className="font-semibold text-slate-700">{progressPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{r.totalTopics} Chapters</span>
                <span className="font-medium text-slate-900 flex items-center gap-0.5">
                  Read Book <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </CardFooter>
            </Card>
          );
        })}
      </div>

    </section>
  );
};
