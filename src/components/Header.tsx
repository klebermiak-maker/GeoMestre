import React from 'react';
import { Volume2, VolumeX, Flame, Star, Trophy, HelpCircle, Compass, Grid, Award, Brain } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  score: number;
  streak: number;
  starsCount: number;
  activeView: 'game' | 'levels' | 'lab' | 'saeb_quiz' | 'certificate';
  setActiveView: (view: 'game' | 'levels' | 'lab' | 'saeb_quiz' | 'certificate') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenHelp: () => void;
  studentName: string;
  onEditName: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  score,
  streak,
  starsCount,
  activeView,
  setActiveView,
  soundEnabled,
  setSoundEnabled,
  onOpenHelp,
  studentName,
  onEditName,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playTap();
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Student Badge */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <button
              type="button"
              id="btn-nav-home"
              onClick={() => {
                setActiveView('game');
                soundManager.playTap();
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                D12
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  Mestre das Áreas
                </h1>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block">
                  Matemática 5º Ano • SAEB
                </span>
              </div>
            </button>

            {/* Mobile Sound & Help buttons */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                id="btn-sound-mobile"
                onClick={toggleSound}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Som"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
              </button>
              <button
                type="button"
                id="btn-help-mobile"
                onClick={onOpenHelp}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                aria-label="Ajuda e Dicas"
              >
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 text-xs sm:text-sm font-medium">
            <button
              type="button"
              id="nav-game"
              onClick={() => {
                setActiveView('game');
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'game'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Desafios</span>
            </button>

            <button
              type="button"
              id="nav-levels"
              onClick={() => {
                setActiveView('levels');
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'levels'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Mundos & Fases</span>
            </button>

            <button
              type="button"
              id="nav-lab"
              onClick={() => {
                setActiveView('lab');
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'lab'
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Laboratório</span>
            </button>

            <button
              type="button"
              id="nav-saeb-quiz"
              onClick={() => {
                setActiveView('saeb_quiz');
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'saeb_quiz'
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-4 h-4 text-indigo-400" />
              <span>Simulado SAEB</span>
            </button>

            <button
              type="button"
              id="nav-certificate"
              onClick={() => {
                setActiveView('certificate');
                soundManager.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeView === 'certificate'
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Certificado</span>
            </button>
          </nav>

          {/* Gamification Stats: Stars, Score, Streak, Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                streak > 1
                  ? 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
              title="Sequência de acertos seguidos!"
            >
              <Flame className={`w-4 h-4 ${streak > 1 ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
              <span>{streak}x Combo</span>
            </div>

            {/* Stars Count */}
            <div
              className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold"
              title="Estrelas conquistadas"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{starsCount}</span>
            </div>

            {/* Total Score */}
            <div
              className="flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-extrabold"
              title="Pontuação total"
            >
              <Trophy className="w-4 h-4 text-blue-600" />
              <span>{score} pts</span>
            </div>

            {/* Student Name */}
            <button
              type="button"
              id="btn-edit-student-name"
              onClick={onEditName}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors truncate max-w-[120px]"
              title="Clique para alterar seu nome no jogo"
            >
              👤 {studentName}
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              id="btn-sound-desktop"
              onClick={toggleSound}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title={soundEnabled ? 'Desativar Sons' : 'Ativar Sons'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Help Guide */}
            <button
              type="button"
              id="btn-help-desktop"
              onClick={onOpenHelp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-bold transition-colors"
              title="Guia do Descritor 12 e Dicas"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>O que é D12?</span>
            </button>
          </div>

        </div>

        {/* Mobile Stats Sub-bar */}
        <div className="flex md:hidden items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-1 text-xs">
          <button
            type="button"
            onClick={onEditName}
            className="flex items-center gap-1 text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-lg truncate max-w-[130px]"
            title="Alterar nome"
          >
            👤 <span className="truncate">{studentName}</span>
          </button>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="flex items-center gap-0.5 font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                <Flame className="w-3.5 h-3.5 fill-orange-500" />
                {streak}x
              </span>
            )}
            <span className="flex items-center gap-0.5 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {starsCount}
            </span>
            <span className="flex items-center gap-0.5 font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-blue-600" />
              {score}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
