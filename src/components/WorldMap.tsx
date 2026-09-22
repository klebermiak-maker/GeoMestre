import React from 'react';
import { CategoryInfo, Challenge, UserLevelRecord } from '../types';
import { CATEGORIES, CHALLENGES } from '../data/levels';
import { Star, CheckCircle2, Lock, Play, Trophy, Sparkles, Brain } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WorldMapProps {
  levelRecords: Record<string, UserLevelRecord>;
  onSelectLevel: (challengeId: string) => void;
  currentChallengeId: string;
  onOpenSaebQuiz?: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  levelRecords,
  onSelectLevel,
  currentChallengeId,
  onOpenSaebQuiz,
}) => {
  // Check if a level is unlocked: first level always unlocked, subsequent require previous level completed
  const isLevelUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevChallenge = CHALLENGES[index - 1];
    return levelRecords[prevChallenge.id]?.completed || false;
  };

  const totalCompleted = Object.values(levelRecords).filter(r => r.completed).length;
  const totalStars = Object.values(levelRecords).reduce((acc, r) => acc + (r.stars || 0), 0);
  const maxPossibleStars = CHALLENGES.length * 3;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Hero Overview Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Mapa de Aprendizagem D12</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black mb-2 font-heading">
              Jornada do Mestre das Áreas
            </h2>
            <p className="text-blue-100 text-sm md:text-base max-w-xl">
              Complete os desafios progressivos do 5º ano, ganhe até 3 estrelas por fase e domine o cálculo de áreas em malhas quadriculadas!
            </p>

            {onOpenSaebQuiz && (
              <button
                type="button"
                id="btn-banner-saeb-quiz"
                onClick={() => {
                  onOpenSaebQuiz();
                  soundManager.playTap();
                }}
                className="mt-4 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Brain className="w-4 h-4 text-purple-900" />
                <span>Iniciar Simulado Prova SAEB</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 self-stretch md:self-auto justify-around">
            <div className="text-center">
              <span className="text-xs text-blue-200 block font-semibold">Fases Concluídas</span>
              <span className="text-2xl font-black text-white">{totalCompleted}/{CHALLENGES.length}</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <span className="text-xs text-amber-200 block font-semibold">Total de Estrelas</span>
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-amber-300">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{totalStars}/{maxPossibleStars}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Categories Grid */}
      <div className="space-y-8">
        {CATEGORIES.map((category: CategoryInfo) => {
          const categoryChallenges = CHALLENGES.filter(c => c.categoryId === category.id);
          const completedInCategory = categoryChallenges.filter(c => levelRecords[c.id]?.completed).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* World Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${category.bgColor} ${category.color} flex items-center justify-center font-bold text-xl border ${category.borderColor}`}>
                    {category.badge === 'Iniciante' && '1'}
                    {category.badge === 'Intermediário' && '2'}
                    {category.badge === 'Avançado' && '3'}
                    {category.badge === 'Mestre' && '4'}
                    {category.badge === 'Desafio Prova' && '5'}
                    {category.badge === 'Explorador' && '6'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 font-heading">
                      {category.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {completedInCategory} de {categoryChallenges.length} concluídas
                  </span>
                </div>
              </div>

              {/* Levels Grid in this World */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryChallenges.map((ch: Challenge) => {
                  const globalIndex = CHALLENGES.findIndex(c => c.id === ch.id);
                  const unlocked = isLevelUnlocked(globalIndex);
                  const record = levelRecords[ch.id];
                  const isCurrent = ch.id === currentChallengeId;

                  return (
                    <button
                      key={ch.id}
                      type="button"
                      id={`level-card-${ch.id}`}
                      disabled={!unlocked}
                      onClick={() => {
                        if (unlocked) {
                          onSelectLevel(ch.id);
                          soundManager.playTap();
                        }
                      }}
                      className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                        !unlocked
                          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                          : isCurrent
                          ? 'bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20 cursor-pointer'
                          : record?.completed
                          ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500 hover:shadow-sm cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          Fase {ch.levelNumber}
                        </span>

                        {/* Stars Earned */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                record && s <= record.stars
                                  ? 'text-amber-500 fill-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {ch.title}
                        </h4>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Unidade: {ch.unitLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        {!unlocked ? (
                          <span className="flex items-center gap-1 text-slate-400 font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Bloqueado</span>
                          </span>
                        ) : record?.completed ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{record.bestScore} pts</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600 font-bold">
                            <Play className="w-3 h-3 fill-blue-600" />
                            <span>Jogar agora</span>
                          </span>
                        )}

                        {isCurrent && (
                          <span className="bg-blue-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                            Atual
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
