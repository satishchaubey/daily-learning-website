'use client';

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Check, Flame, Code2, Cpu, CheckCircle, Copy, AlertCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Roadmap, Topic, User } from '../types';

interface BookReaderProps {
  roadmap: Roadmap;
  user: User;
  onBack: () => void;
  onCompleteTopic: (topicId: string) => void;
  onOpenVisualizer: (topic: Topic) => void;
  onOpenPractice: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  roadmap,
  user,
  onBack,
  onCompleteTopic,
  onOpenVisualizer,
  onOpenPractice,
}) => {
  const chapters = roadmap?.chapters || [];
  const [activeChapterIndex, setActiveChapterIndex] = useState(1);
  const currentChapter = chapters.find((c) => c.chapterIndex === activeChapterIndex) || chapters[0] || {
    chapterIndex: 1,
    title: 'Module 1: Foundations',
    topics: [],
  };

  const [activeTopic, setActiveTopic] = useState<Topic>(
    currentChapter?.topics?.[0] || {
      topicId: 't1',
      title: 'Introduction & Core Foundations',
      difficulty: 'EASY',
      streakTier: 'EASY_STREAK',
      visualizerType: 'NONE',
      summary: 'Essential fundamentals overview.',
      readingTimeMinutes: 8,
    }
  );

  React.useEffect(() => {
    const chs = roadmap?.chapters || [];
    if (chs.length > 0) {
      setActiveChapterIndex(chs[0].chapterIndex);
      if (chs[0].topics && chs[0].topics.length > 0) {
        setActiveTopic(chs[0].topics[0]);
      }
    }
    setSelectedQuizOption(null);
    setIsCopied(false);
  }, [roadmap]);

  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const isCompleted = user.completedTopicIds.includes(activeTopic.topicId);
  const enriched = activeTopic.enrichedContent;

  const handleSelectTopic = (topic: Topic) => {
    setActiveTopic(topic);
    setSelectedQuizOption(null);
    setIsCopied(false);
  };

  const handleMarkComplete = () => {
    onCompleteTopic(activeTopic.topicId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });
  };

  const handleCopyCode = () => {
    if (enriched?.codeSnippet) {
      navigator.clipboard.writeText(enriched.codeSnippet);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="my-6">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
        <Button variant="outline" size="sm" onClick={onBack} className="text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Tracks
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="easy" className="gap-1">
            <Flame className="w-3.5 h-3.5 text-emerald-600" /> Easy Streak Eligible
          </Badge>
          <Button size="sm" onClick={onOpenPractice} className="bg-slate-900 text-white hover:bg-slate-800">
            <Code2 className="w-4 h-4 mr-1.5" /> Practice Code for this Track
          </Button>
        </div>
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Table of Contents */}
        <Card className="lg:col-span-1 border-slate-200 bg-white max-h-[85vh] overflow-y-auto shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <BookOpen className="w-4 h-4 text-slate-700" />
              <span>Table of Contents</span>
            </div>
            <p className="text-xs text-slate-500 font-normal">{roadmap.title} ({roadmap.totalChapters} Modules)</p>
          </CardHeader>

          <div className="p-3 space-y-3">
            {roadmap.chapters.map((ch) => {
              const isActiveChapter = ch.chapterIndex === currentChapter?.chapterIndex;
              return (
                <div key={ch.chapterIndex} className="border-b border-slate-100 pb-2.5 last:border-0">
                  <div
                    onClick={() => {
                      setActiveChapterIndex(ch.chapterIndex);
                      if (ch.topics.length > 0) handleSelectTopic(ch.topics[0]);
                    }}
                    className={`text-xs font-semibold cursor-pointer flex items-center justify-between py-1 px-1.5 rounded transition-colors ${
                      isActiveChapter ? 'text-slate-900 bg-slate-100 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="line-clamp-1">{ch.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal ml-2">{ch.topics.length}</span>
                  </div>

                  {/* Subtopics */}
                  {isActiveChapter && (
                    <div className="ml-2 mt-1 space-y-1 border-l-2 border-slate-200 pl-2">
                      {ch.topics.map((tp) => {
                        const isCurrent = tp.topicId === activeTopic.topicId;
                        const isDone = user.completedTopicIds.includes(tp.topicId);
                        return (
                          <div
                            key={tp.topicId}
                            onClick={() => handleSelectTopic(tp)}
                            className={`text-xs py-1 px-2 rounded cursor-pointer flex items-center justify-between transition-colors ${
                              isCurrent
                                ? 'bg-slate-900 text-white font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span className={`line-clamp-1 ${isDone && !isCurrent ? 'line-through text-slate-400' : ''}`}>
                              {tp.title}
                            </span>
                            {isDone && <Check className={`w-3.5 h-3.5 ${isCurrent ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Right Area: Deep Educational Material */}
        <Card className="lg:col-span-3 border-slate-200 bg-white shadow-xs">
          <div className="p-8 sm:p-10 space-y-8">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-200">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {roadmap.title} • {currentChapter?.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {activeTopic.title}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={activeTopic.difficulty === 'EASY' ? 'easy' : (activeTopic.difficulty === 'MEDIUM' ? 'medium' : 'advanced')}>
                  {activeTopic.difficulty}
                </Badge>
                <span className="text-xs text-slate-500 font-medium">
                  {activeTopic.readingTimeMinutes} min read
                </span>
                {activeTopic.visualizerType !== 'NONE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenVisualizer(activeTopic)}
                    className="text-xs text-slate-700"
                  >
                    <Cpu className="w-3.5 h-3.5 mr-1 text-slate-600" /> View Simulation
                  </Button>
                )}
              </div>
            </div>

            {/* Section 1: Overview */}
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                1. System Overview & Core Motivation
              </h2>
              <p className="text-[15px] text-slate-700 leading-relaxed">
                {enriched?.overview || activeTopic.summary || `Comprehensive guide and production implementation for ${activeTopic.title}.`}
              </p>
            </div>

            {/* Section 2: Technical Mechanics */}
            {enriched?.mechanics && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  2. Architectural Mechanics & Invariants
                </h2>
                <div className="space-y-2">
                  {enriched.mechanics.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="leading-relaxed">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Production Code Implementation */}
            {enriched?.codeSnippet && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                    3. Production Code Pattern ({enriched.codeLang.toUpperCase()})
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode} className="h-7 text-xs text-slate-500 hover:text-slate-900">
                    <Copy className="w-3.5 h-3.5 mr-1" /> {isCopied ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
                <div className="rounded-lg bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-sm">
                  <pre>
                    <code>{enriched.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Section 4: Trade-offs & Production Considerations */}
            {enriched?.tradeoffs && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  4. Production Trade-offs & Performance
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Advantages */}
                  <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200 space-y-2">
                    <div className="font-semibold text-xs text-emerald-800 uppercase tracking-wider">
                      ✓ Production Strengths
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                      {enriched.tradeoffs.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Pitfalls */}
                  <div className="p-4 rounded-lg bg-rose-50/40 border border-rose-200 space-y-2">
                    <div className="font-semibold text-xs text-rose-800 uppercase tracking-wider">
                      ⚠ Anti-Patterns & Gotchas
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
                      {enriched.tradeoffs.pitfalls.map((pit, i) => (
                        <li key={i}>{pit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  ⚡ <strong>Resource Bound:</strong> {enriched.tradeoffs.complexity}
                </div>
              </div>
            )}

            {/* Section 5: Amazon Bar-Raiser Interview Drill */}
            {enriched?.barRaiserInterview && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  5. Amazon Bar-Raiser Technical Question & Answer
                </h2>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 space-y-2">
                  <div className="font-bold text-sm text-slate-900">
                    Q: {enriched.barRaiserInterview.question}
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-200">
                    <strong className="text-slate-900">Senior SDE Response:</strong> {enriched.barRaiserInterview.answer}
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Interactive Checkpoint Quiz */}
            {enriched?.checkpointQuiz && (
              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-sky-500" />
                  6. Knowledge Checkpoint Quiz
                </h2>
                <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-3">
                  <div className="font-medium text-sm text-slate-900">
                    {enriched.checkpointQuiz.question}
                  </div>
                  
                  <div className="space-y-2">
                    {enriched.checkpointQuiz.options.map((opt, i) => {
                      const isSelected = selectedQuizOption === i;
                      const isCorrect = i === enriched.checkpointQuiz.correctIndex;
                      let btnStyle = "border-slate-200 hover:bg-slate-50 text-slate-700";
                      
                      if (selectedQuizOption !== null) {
                        if (isCorrect) {
                          btnStyle = "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
                        } else if (isSelected) {
                          btnStyle = "border-rose-300 bg-rose-50 text-rose-800";
                        }
                      }

                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedQuizOption(i)}
                          className={`p-3 rounded-md border text-xs cursor-pointer transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {selectedQuizOption !== null && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                        </div>
                      );
                    })}
                  </div>

                  {selectedQuizOption !== null && (
                    <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed mt-2">
                      💡 <strong>Explanation:</strong> {enriched.checkpointQuiz.explanation}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant={isCompleted ? 'outline' : 'default'}
                onClick={handleMarkComplete}
                className={isCompleted ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'bg-slate-900 text-white hover:bg-slate-800'}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                    Chapter Completed (Easy Streak Maintained!)
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Mark Read & Extend Easy Streak
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={onOpenPractice} className="text-slate-700">
                <Code2 className="w-4 h-4 mr-2" /> Practice Code for this Topic
              </Button>
            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};
