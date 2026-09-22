import React, { useState, useEffect } from 'react';
import { CHALLENGES, CATEGORIES } from './data/levels';
import { Challenge, CategoryInfo, UserLevelRecord } from './types';
import { soundManager } from './utils/audio';
import confetti from 'canvas-confetti';

import { Header } from './components/Header';
import { GridBoard } from './components/GridBoard';
import { QuestionCard } from './components/QuestionCard';
import { FeedbackModal } from './components/FeedbackModal';
import { WorldMap } from './components/WorldMap';
import { CreativeLab } from './components/CreativeLab';
import { CertificateModal } from './components/CertificateModal';
import { HelpD12Modal } from './components/HelpD12Modal';
import { NameModal } from './components/NameModal';
import { SaebQuiz } from './components/SaebQuiz';

export default function App() {
  // Local storage state initialization
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(() => {
    return localStorage.getItem('d12_current_challenge') || CHALLENGES[0].id;
  });

  const [activeView, setActiveView] = useState<'game' | 'levels' | 'lab' | 'saeb_quiz' | 'certificate'>('game');

  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('d12_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(() => {
    const saved = localStorage.getItem('d12_best_streak');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('d12_student_name') || 'Estudante Campeão';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [levelRecords, setLevelRecords] = useState<Record<string, UserLevelRecord>>(() => {
    const saved = localStorage.getItem('d12_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  // Current turn interaction states
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentAttempts, setCurrentAttempts] = useState<number>(1);

  // Modals
  const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
  const [helpModalOpen, setHelpModalOpen] = useState<boolean>(false);
  const [nameModalOpen, setNameModalOpen] = useState<boolean>(false);

  // Feedback reward values
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [streakBonus, setStreakBonus] = useState<number>(0);
  const [starsAwarded, setStarsAwarded] = useState<number>(0);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('d12_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('d12_best_streak', bestStreak.toString());
  }, [bestStreak]);

  useEffect(() => {
    localStorage.setItem('d12_records', JSON.stringify(levelRecords));
  }, [levelRecords]);

  useEffect(() => {
    localStorage.setItem('d12_student_name', studentName);
  }, [studentName]);

  useEffect(() => {
    localStorage.setItem('d12_current_challenge', currentChallengeId);
  }, [currentChallengeId]);

  // Current Challenge Data
  const currentChallengeIndex = CHALLENGES.findIndex(c => c.id === currentChallengeId);
  const currentChallenge: Challenge = currentChallengeIndex >= 0 ? CHALLENGES[currentChallengeIndex] : CHALLENGES[0];
  const currentCategory: CategoryInfo = CATEGORIES.find(c => c.id === currentChallenge.categoryId) || CATEGORIES[0];

  // Total stars calculated
  const totalStars = Object.values(levelRecords).reduce((acc, r) => acc + (r.stars || 0), 0);
  const completedLevelsCount = Object.values(levelRecords).filter(r => r.completed).length;

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isSubmitted) return;

    const chosenOption = currentChallenge.options.find(o => o.id === selectedOptionId);
    const correct = Boolean(chosenOption?.isCorrect);

    setIsSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();

      // Confetti burst
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Calculate Stars and Points
      const basePoints = 100;
      const calculatedStreakBonus = streak * 25;
      const pointsTotal = basePoints + calculatedStreakBonus;

      // 3 stars on 1st attempt, 2 stars on 2nd, 1 star on 3rd+
      const stars = currentAttempts === 1 ? 3 : currentAttempts === 2 ? 2 : 1;

      setEarnedPoints(basePoints);
      setStreakBonus(calculatedStreakBonus);
      setStarsAwarded(stars);

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
      }

      setScore(prev => prev + pointsTotal);

      // Save level record
      const existing = levelRecords[currentChallenge.id];
      const updatedRecord: UserLevelRecord = {
        completed: true,
        stars: Math.max(existing?.stars || 0, stars),
        bestScore: Math.max(existing?.bestScore || 0, pointsTotal),
        attempts: (existing?.attempts || 0) + currentAttempts,
      };

      setLevelRecords(prev => ({
        ...prev,
        [currentChallenge.id]: updatedRecord,
      }));

      // Play fanfare if 3 stars
      if (stars === 3) {
        setTimeout(() => soundManager.playFanfare(), 300);
      }
    } else {
      soundManager.playError();
      setStreak(0);
      setEarnedPoints(0);
      setStreakBonus(0);
      setStarsAwarded(0);
    }

    setFeedbackModalOpen(true);
  };

  // Move to next challenge
  const handleNextChallenge = () => {
    setFeedbackModalOpen(false);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setCurrentAttempts(1);

    if (currentChallengeIndex < CHALLENGES.length - 1) {
      const nextChallenge = CHALLENGES[currentChallengeIndex + 1];
      setCurrentChallengeId(nextChallenge.id);
    } else {
      // Completed all levels! Go to certificate view
      setActiveView('certificate');
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
      });
      soundManager.playFanfare();
    }
  };

  // Retry the current challenge
  const handleRetry = () => {
    setFeedbackModalOpen(false);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setCurrentAttempts(prev => prev + 1);
  };

  // Jump to specific level from map
  const handleSelectLevel = (challengeId: string) => {
    setCurrentChallengeId(challengeId);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setCurrentAttempts(1);
    setActiveView('game');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <Header
        score={score}
        streak={streak}
        starsCount={totalStars}
        activeView={activeView}
        setActiveView={setActiveView}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenHelp={() => setHelpModalOpen(true)}
        studentName={studentName}
        onEditName={() => setNameModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeView === 'game' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Interactive Malha Quadriculada (Grid Board) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <GridBoard
                width={currentChallenge.gridWidth}
                height={currentChallenge.gridHeight}
                unitLabel={currentChallenge.unitLabel}
                primaryShape={currentChallenge.primaryShape}
                secondaryShape={currentChallenge.secondaryShape}
                isAnswerSubmitted={isSubmitted}
                challengeId={currentChallenge.id}
              />
            </div>

            {/* Question & Options Card */}
            <div className="lg:col-span-5 flex flex-col">
              <QuestionCard
                challenge={currentChallenge}
                category={currentCategory}
                selectedOptionId={selectedOptionId}
                onSelectOption={setSelectedOptionId}
                onSubmitAnswer={handleSubmitAnswer}
                isSubmitted={isSubmitted}
                isCorrect={isCorrect}
                onNextChallenge={handleNextChallenge}
                onRetry={handleRetry}
                currentLevelIndex={currentChallengeIndex}
                totalLevelsCount={CHALLENGES.length}
              />
            </div>
          </div>
        )}

        {activeView === 'levels' && (
          <WorldMap
            levelRecords={levelRecords}
            onSelectLevel={handleSelectLevel}
            currentChallengeId={currentChallengeId}
            onOpenSaebQuiz={() => setActiveView('saeb_quiz')}
          />
        )}

        {activeView === 'lab' && (
          <CreativeLab />
        )}

        {activeView === 'saeb_quiz' && (
          <SaebQuiz
            studentName={studentName}
            onBackToMap={() => setActiveView('levels')}
          />
        )}

        {activeView === 'certificate' && (
          <CertificateModal
            studentName={studentName}
            onEditName={() => setNameModalOpen(true)}
            totalScore={score}
            totalStars={totalStars}
            completedLevelsCount={completedLevelsCount}
            totalLevelsCount={CHALLENGES.length}
            onBackToGame={() => setActiveView('game')}
          />
        )}
      </main>

      {/* Immediate Pedagogical Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        isCorrect={Boolean(isCorrect)}
        challenge={currentChallenge}
        earnedPoints={earnedPoints}
        streakBonus={streakBonus}
        starsAwarded={starsAwarded}
        onNext={handleNextChallenge}
        onRetry={handleRetry}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {/* Descritor 12 Help & Theory Modal */}
      <HelpD12Modal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* Student Name Modal */}
      <NameModal
        isOpen={nameModalOpen}
        currentName={studentName}
        onSave={(name) => setStudentName(name)}
        onClose={() => setNameModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Mestre das Áreas</strong> • Jogo Educativo de Matemática (Descritor 12 • SAEB / Prova Brasil 5º Ano)
          </span>
          <span className="text-slate-400">
            Habilidade BNCC: <strong>EF05MA19</strong> (Área de figuras em malhas quadriculadas)
          </span>
        </div>
      </footer>
    </div>
  );
}
