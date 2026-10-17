'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { StreakBanner } from '@/components/StreakBanner';
import { RoadmapExplorer } from '@/components/RoadmapExplorer';
import { BookReader } from '@/components/BookReader';
import { CodeWorkspace } from '@/components/CodeWorkspace';
import { VisualizerModal } from '@/components/VisualizerModal';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Roadmap, User, Problem, StreakTier, Topic } from '@/types';

export default function HomePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User>(() => (authUser ? (authUser as User) : apiService.getUser()));
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'practice' | 'visualizers' | 'book'>('roadmaps');
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [selectedVisualizerTopic, setSelectedVisualizerTopic] = useState<Topic | null>(null);
  const [showVisualizerModal, setShowVisualizerModal] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser(authUser as User);
    }
  }, [authUser]);

  useEffect(() => {
    async function loadInitialData() {
      const [rList, pList] = await Promise.all([
        apiService.getRoadmaps(),
        apiService.getProblems(),
      ]);
      setRoadmaps(rList);
      setProblems(pList);
    }
    loadInitialData();
  }, []);

  const handleRecordStreak = async (tier: StreakTier, actionId?: string) => {
    const updatedUser = await apiService.recordActivity(tier, actionId);
    setUser({ ...updatedUser });
  };

  const handleUseFreeze = async () => {
    const updatedUser = await apiService.useFreezeToken();
    setUser({ ...updatedUser });
  };

  const handleSelectRoadmap = async (roadmapSummary: Roadmap) => {
    if (roadmapSummary.chapters && roadmapSummary.chapters.length > 0) {
      setSelectedRoadmap(roadmapSummary);
    } else {
      const fullRoadmap = await apiService.getRoadmap(roadmapSummary.slug);
      setSelectedRoadmap(fullRoadmap || roadmapSummary);
    }
    setActiveTab('book');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenVisualizer = (topic?: Topic) => {
    if (topic) setSelectedVisualizerTopic(topic);
    setShowVisualizerModal(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Navbar with shadcn components & Auth status */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'visualizers') {
            setShowVisualizerModal(true);
          }
        }}
        onUseFreeze={handleUseFreeze}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Multi-Tier Streak Banner */}
        <StreakBanner
          user={user}
          onSimulateActivity={handleRecordStreak}
          onUseFreeze={handleUseFreeze}
        />

        {/* View 1: 46 Tracks Explorer */}
        {activeTab === 'roadmaps' && (
          <RoadmapExplorer
            roadmaps={roadmaps}
            user={user}
            onSelectRoadmap={handleSelectRoadmap}
          />
        )}

        {/* View 2: Book Reader */}
        {activeTab === 'book' && selectedRoadmap && (
          <BookReader
            roadmap={selectedRoadmap}
            user={user}
            onBack={() => setActiveTab('roadmaps')}
            onCompleteTopic={(topicId) => handleRecordStreak('easy', topicId)}
            onOpenVisualizer={handleOpenVisualizer}
            onOpenPractice={() => setActiveTab('practice')}
          />
        )}

        {/* View 3: Monaco Code Workspace */}
        {activeTab === 'practice' && problems.length > 0 && (
          <CodeWorkspace
            problems={problems}
            user={user}
            onRecordStreak={handleRecordStreak}
          />
        )}
      </main>

      {/* Visualizer Modal */}
      {showVisualizerModal && (
        <VisualizerModal
          topic={selectedVisualizerTopic}
          onClose={() => setShowVisualizerModal(false)}
        />
      )}

      {/* Clean White Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <strong className="text-slate-800 font-semibold">DevMastery</strong> • Daily Learning & Architecture System
          </div>
          <div>
            Built with <strong>Next.js App Router</strong> & <strong>NestJS</strong> • AWS SES & Free Tier Ready
          </div>
        </div>
      </footer>
    </div>
  );
}
