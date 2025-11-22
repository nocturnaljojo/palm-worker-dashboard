'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import { Orb } from '@/components/ui/orb';
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, Sparkles } from 'lucide-react';

type AgentState = null | 'thinking' | 'listening' | 'talking';

export default function VoiceAssistantPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>(null);
  const [inputVolume, setInputVolume] = useState(0);
  const [outputVolume, setOutputVolume] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Simulate audio reactivity
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMicActive && agentState === 'listening') {
        setInputVolume(Math.random() * 0.8 + 0.2);
      } else {
        setInputVolume(0);
      }

      if (isSpeaking && agentState === 'talking') {
        setOutputVolume(Math.random() * 0.9 + 0.1);
      } else {
        setOutputVolume(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMicActive, isSpeaking, agentState]);

  const handleMicToggle = () => {
    setIsMicActive(!isMicActive);
    if (!isMicActive) {
      setAgentState('listening');
      setIsSpeaking(false);
    } else {
      setAgentState(null);
    }
  };

  const handleSpeakToggle = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking) {
      setAgentState('talking');
      setIsMicActive(false);
    } else {
      setAgentState(null);
    }
  };

  const stateColors: Record<string, [string, string]> = {
    listening: ['#10b981', '#06b6d4'],
    thinking: ['#f59e0b', '#f97316'],
    talking: ['#8b5cf6', '#ec4899'],
    default: ['#D4AF37', '#0F52BA'],
  };

  const currentColors = agentState ? stateColors[agentState] : stateColors.default;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
      <Navbar currentPath="/voice-assistant" isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-midnight via-ocean to-charcoal dark:from-black dark:via-midnight dark:to-black text-white py-12 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[128px]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-6 text-white hover:bg-white/10"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Home
              </Button>
            </Link>

            <div className="text-center space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md mb-4">
                <Sparkles className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-5xl md:text-6xl font-heading font-bold">
                AI Voice Assistant
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                Interact with your PALM assistant using natural voice commands
              </p>
            </div>
          </div>
        </section>

        {/* Orb Section */}
        <section className="py-16 bg-white dark:bg-charcoal transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Orb Visualization */}
              <div className="relative">
                <div className="bg-gradient-to-br from-sand to-white dark:from-midnight dark:to-charcoal rounded-2xl shadow-2xl p-8 border border-slate-100 dark:border-white/5">
                  <div className="aspect-square w-full max-w-md mx-auto">
                    <Orb
                      colors={currentColors}
                      agentState={agentState}
                      volumeMode="manual"
                      manualInput={inputVolume}
                      manualOutput={outputVolume}
                    />
                  </div>

                  {/* State Indicator */}
                  <div className="mt-6 text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-full ${
                      agentState === 'listening' ? 'bg-green-100 dark:bg-green-900/30' :
                      agentState === 'thinking' ? 'bg-orange-100 dark:bg-orange-900/30' :
                      agentState === 'talking' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-gold/10'
                    }`}>
                      <div className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                        agentState === 'listening' ? 'bg-green-500' :
                        agentState === 'thinking' ? 'bg-orange-500' :
                        agentState === 'talking' ? 'bg-purple-500' :
                        'bg-gold'
                      }`}></div>
                      <span className={`font-medium ${
                        agentState === 'listening' ? 'text-green-700 dark:text-green-300' :
                        agentState === 'thinking' ? 'text-orange-700 dark:text-orange-300' :
                        agentState === 'talking' ? 'text-purple-700 dark:text-purple-300' :
                        'text-slate-600 dark:text-slate-300'
                      }`}>
                        {agentState === 'listening' ? 'Listening...' :
                         agentState === 'thinking' ? 'Thinking...' :
                         agentState === 'talking' ? 'Speaking...' :
                         'Ready'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls & Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                    Voice Controls
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Activate your microphone to speak with the AI assistant or listen to responses
                  </p>

                  {/* Control Buttons */}
                  <div className="space-y-4">
                    <Button
                      variant={isMicActive ? 'luxury' : 'outline'}
                      size="lg"
                      className="w-full justify-center"
                      icon={isMicActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                      onClick={handleMicToggle}
                    >
                      {isMicActive ? 'Stop Listening' : 'Start Listening'}
                    </Button>

                    <Button
                      variant={isSpeaking ? 'luxury' : 'outline'}
                      size="lg"
                      className="w-full justify-center"
                      icon={isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                      onClick={handleSpeakToggle}
                    >
                      {isSpeaking ? 'Stop Speaking' : 'Test Speech'}
                    </Button>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-sand dark:bg-midnight rounded-xl p-6 border border-slate-100 dark:border-white/5">
                  <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-4">
                    Features
                  </h3>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2"></div>
                      <span>Real-time audio reactivity with visual feedback</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2"></div>
                      <span>Natural language processing for worker queries</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2"></div>
                      <span>3D animated orb with state visualization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2"></div>
                      <span>Multilingual support for Pacific languages</span>
                    </li>
                  </ul>
                </div>

                {/* Example Commands */}
                <div className="bg-sand dark:bg-midnight rounded-xl p-6 border border-slate-100 dark:border-white/5">
                  <h3 className="text-xl font-heading font-semibold text-slate-900 dark:text-white mb-4">
                    Example Commands
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="px-4 py-2 bg-white dark:bg-charcoal rounded-lg text-slate-700 dark:text-slate-300">
                      "What are my rights as a PALM worker?"
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-charcoal rounded-lg text-slate-700 dark:text-slate-300">
                      "How do I report a workplace issue?"
                    </div>
                    <div className="px-4 py-2 bg-white dark:bg-charcoal rounded-lg text-slate-700 dark:text-slate-300">
                      "Show me workers near my location"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
