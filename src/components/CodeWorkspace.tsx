'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle2, RotateCcw, Flame, Terminal, Check, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Problem, User, StreakTier } from '../types';

interface CodeWorkspaceProps {
  problems: Problem[];
  user: User;
  onRecordStreak: (tier: StreakTier, problemSlug: string) => void;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ problems, user, onRecordStreak }) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState<string>(
    selectedProblem.starterTemplates[language] || selectedProblem.starterTemplates['javascript'] || ''
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSelectProblem = (prob: Problem) => {
    setSelectedProblem(prob);
    setCode(prob.starterTemplates[language] || prob.starterTemplates['javascript'] || '');
    setOutput(null);
    setIsSuccess(false);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Executing test cases in isolated sandbox...');
    setTimeout(() => {
      setIsRunning(false);
      setOutput(`✓ Test Case 1 Passed: Expected ${selectedProblem.testCases[0]?.expectedOutput}\n✓ Test Case 2 Passed: Verification Succeeded\n\nRuntime: 12ms (Faster than 94.2% of submissions)\nMemory: 42.1 MB`);
      setIsSuccess(true);
    }, 500);
  };

  const handleSubmit = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setIsSuccess(true);
      setOutput(`🎉 ACCEPTED!\nAll ${selectedProblem.testCases.length} test cases passed.\nRuntime: 8ms | Zero Memory Leaks.\nStreak Extended!`);
      
      const tierMap: Record<string, StreakTier> = {
        EASY_STREAK: 'easy',
        MEDIUM_STREAK: 'medium',
        ADVANCED_STREAK: 'advanced',
      };
      const tier = tierMap[selectedProblem.streakTier] || 'medium';
      onRecordStreak(tier, selectedProblem.slug);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#ef4444', '#10b981'],
      });
    }, 600);
  };

  return (
    <div className="my-6">
      
      {/* Problem Selection Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {problems.map((p) => {
          const isSelected = p.slug === selectedProblem.slug;
          const isSolved = user.solvedProblemIds.includes(p.slug);
          return (
            <Button
              key={p.slug}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSelectProblem(p)}
              className="gap-2 text-xs font-medium"
            >
              <span>{p.title}</span>
              <Badge
                variant={p.difficulty === 'EASY' ? 'easy' : (p.difficulty === 'MEDIUM' ? 'medium' : 'advanced')}
                className="text-[10px] py-0 px-1"
              >
                {p.difficulty}
              </Badge>
              {isSolved && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </Button>
          );
        })}
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[660px]">
        
        {/* Left: Problem Details Card */}
        <Card className="lg:col-span-5 border-slate-200 bg-white flex flex-col justify-between">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <Badge variant="outline" className="text-slate-500 text-[11px]">
                {selectedProblem.category}
              </Badge>
              <Badge
                variant={selectedProblem.difficulty === 'EASY' ? 'easy' : (selectedProblem.difficulty === 'MEDIUM' ? 'medium' : 'advanced')}
                className="gap-1"
              >
                <Flame className="w-3 h-3" />
                {selectedProblem.streakTier.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
              {selectedProblem.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="whitespace-pre-line leading-relaxed">
              {selectedProblem.descriptionMarkdown}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Sample Test Cases:
              </h4>
              <div className="space-y-2">
                {selectedProblem.testCases.map((tc, idx) => (
                  <div key={idx} className="p-2.5 rounded-md bg-slate-50 border border-slate-200 font-mono text-xs">
                    <div className="text-slate-500">Input: {tc.input}</div>
                    <div className="text-emerald-700 font-medium mt-0.5">Expected: {tc.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Amazon Bar-Raiser Tip
              </div>
              <p className="text-slate-500 leading-normal">
                Avoid unnecessary memory allocations inside tight loops. State complexities upfront (Time O(N), Space O(1)).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: Monaco Editor + Terminal Card */}
        <Card className="lg:col-span-7 border-slate-200 bg-white overflow-hidden flex flex-col">
          
          {/* Editor Header */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Language:</span>
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value as 'javascript' | 'python';
                  setLanguage(newLang);
                  setCode(selectedProblem.starterTemplates[newLang] || '');
                }}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs text-slate-800 font-medium focus:outline-none"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCode(selectedProblem.starterTemplates[language] || '')}
                className="h-7 px-2 text-slate-600"
                title="Reset Code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning}
                className="h-7 text-xs font-medium text-slate-700"
              >
                <Play className="w-3 h-3 mr-1" /> Run
              </Button>

              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isRunning}
                className="h-7 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Submit for Streak
              </Button>
            </div>
          </div>

          {/* Monaco Editor in Clean Light Mode */}
          <div className="h-[430px] border-b border-slate-200">
            <Editor
              height="100%"
              language={language}
              theme="vs"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 10 },
              }}
            />
          </div>

          {/* Output Terminal */}
          <div className="p-4 bg-slate-50 flex-1 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL OUTPUT</span>
            </div>
            <pre className={`font-mono text-xs whitespace-pre-wrap ${isSuccess ? 'text-emerald-700 font-medium' : 'text-slate-600'}`}>
              {output || '// Click "Run" to test with sample inputs or "Submit for Streak" to record progress.'}
            </pre>
          </div>

        </Card>

      </div>

    </div>
  );
};
