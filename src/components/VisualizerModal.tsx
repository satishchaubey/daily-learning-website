'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, Activity, Server, Database, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Topic } from '../types';

interface VisualizerModalProps {
  topic?: Topic | null;
  onClose: () => void;
}

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dsa' | 'system' | 'lld'>('dsa');
  
  // DSA Visualizer State (Two Sum Simulation)
  const nums = [2, 7, 11, 15];
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = [
    { index: -1, val: null, complement: null, map: {}, log: 'Step 0: Initialize empty Hash Map {} and set target = 9' },
    { index: 0, val: 2, complement: 7, map: { 2: 0 }, log: 'Step 1: Check index 0 (val 2). Complement 9 - 2 = 7 not in map. Store {2: 0}' },
    { index: 1, val: 7, complement: 2, map: { 2: 0 }, log: 'Step 2: Check index 1 (val 7). Complement 9 - 7 = 2 IS IN MAP at index 0! Match: [0, 1]' },
  ];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 1300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  // System Design Traffic Simulation State
  const [trafficActive, setTrafficActive] = useState(false);
  const [activeNode, setActiveNode] = useState<number>(0);

  const handleSimulateTraffic = () => {
    setTrafficActive(true);
    let n = 0;
    const interval = setInterval(() => {
      n++;
      setActiveNode(n % 5);
      if (n > 8) {
        clearInterval(interval);
        setTrafficActive(false);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Interactive Architectural & Algorithmic Visualizer
                </h2>
                <p className="text-xs text-slate-500">
                  Step-by-step state machine simulation for DSA, System Design, and LLD.
                </p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-500 hover:text-slate-900">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 my-4 border-b border-slate-100 pb-3">
            <Button
              variant={activeTab === 'dsa' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('dsa')}
              className="text-xs"
            >
              DSA State Machine (Two Sum)
            </Button>
            <Button
              variant={activeTab === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('system')}
              className="text-xs"
            >
              System Design (1M QPS Flow)
            </Button>
            <Button
              variant={activeTab === 'lld' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('lld')}
              className="text-xs"
            >
              LLD (LRU Cache Linked List)
            </Button>
          </div>

          {/* Mode 1: DSA Visualizer */}
          {activeTab === 'dsa' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="text-xs text-slate-500 font-medium mb-4">
                  Array State: <code className="text-slate-800 font-bold">nums = [2, 7, 11, 15]</code> | Target = <code className="text-amber-600 font-bold">9</code>
                </div>

                <div className="flex gap-3 justify-center my-6">
                  {nums.map((val, idx) => {
                    const isCurrent = steps[currentStep]?.index === idx;
                    const isMatch = currentStep === 2 && (idx === 0 || idx === 1);
                    return (
                      <div
                        key={idx}
                        className={`w-20 h-24 rounded-lg flex flex-col items-center justify-center transition-all ${
                          isMatch
                            ? 'bg-emerald-50 border-2 border-emerald-500 shadow-sm'
                            : isCurrent
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        <span className="text-2xl font-bold">{val}</span>
                        <span className={`text-[11px] ${isCurrent ? 'text-slate-300' : 'text-slate-400'}`}>[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-lg bg-white border border-slate-200 p-3 text-xs">
                  <div className="font-semibold text-slate-700 mb-1">
                    Hash Map Lookup State (O(1)):
                  </div>
                  <code className="text-slate-900 font-mono">
                    {JSON.stringify(steps[currentStep]?.map || {})}
                  </code>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-xs"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 mr-1" /> : <Play className="w-3.5 h-3.5 mr-1" />}
                    {isPlaying ? 'Pause' : 'Auto Play'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="text-xs"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="text-xs"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                    className="h-8 w-8"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="font-mono text-xs text-emerald-700 font-medium">
                  {steps[currentStep]?.log}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: System Design Simulator */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-700">
                    High-Availability Request Pipeline
                  </span>
                  <Button size="sm" onClick={handleSimulateTraffic} className="text-xs">
                    <Activity className="w-3.5 h-3.5 mr-1" /> Simulate 1M QPS Spike
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-4">
                  {[
                    { name: 'Global Clients', icon: <Globe className="w-5 h-5 text-sky-600" /> },
                    { name: 'CloudFront Edge', icon: <Server className="w-5 h-5 text-purple-600" /> },
                    { name: 'API Gateway', icon: <Cpu className="w-5 h-5 text-slate-800" /> },
                    { name: 'Redis Cache (L2)', icon: <Database className="w-5 h-5 text-amber-600" /> },
                    { name: 'Database Cluster', icon: <Database className="w-5 h-5 text-emerald-600" /> },
                  ].map((node, idx) => {
                    const isActive = trafficActive && activeNode === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isActive
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        {node.icon}
                        <span className="text-xs font-semibold">{node.name}</span>
                        <span className={`text-[10px] ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isActive ? 'Processing...' : 'Healthy'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed">
                💡 <strong>Amazon Scale Design:</strong> Static book chapters are cached by CloudFront CDN edges. Code practice submissions pass through the API Gateway token-bucket rate limiter, with Redis providing ultra-fast sub-millisecond session state.
              </div>
            </div>
          )}

          {/* Mode 3: LLD Visualizer */}
          {activeTab === 'lld' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  LRU Cache Doubly Linked List Topology:
                </h4>
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  {['[Head: MRU]', 'Node(1,1)', 'Node(3,3)', '[Tail: LRU Evicted]'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-md bg-white border border-slate-200 font-mono text-xs font-semibold text-slate-800 shadow-xs">
                        {item}
                      </div>
                      {i < 3 && <span className="text-slate-400 text-sm">⇄</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-500">
                Hash Map gives instantaneous $O(1)$ key lookup, while the Doubly Linked List enables $O(1)$ node eviction and repositioning.
              </div>
            </div>
          )}

        </div>
      </Card>
    </div>
  );
};
