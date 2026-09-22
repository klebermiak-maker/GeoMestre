import React from 'react';
import { Challenge } from '../types';
import { CheckCircle2, XCircle, Star, Sparkles, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  challenge: Challenge;
  earnedPoints: number;
  streakBonus: number;
  starsAwarded: number;
  onNext: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  challenge,
  earnedPoints,
  streakBonus,
  starsAwarded,
  onNext,
  onRetry,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center transform transition-all animate-scaleUp">
        
        {/* Status Icon */}
        <div
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
            isCorrect
              ? 'bg-gradient-to-tr from-emerald-500 to-green-400 text-white shadow-emerald-500/30'
              : 'bg-gradient-to-tr from-rose-500 to-red-400 text-white shadow-rose-500/30'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          ) : (
            <XCircle className="w-12 h-12 stroke-[2.5]" />
          )}
        </div>

        {/* Title & Feedback Header */}
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 font-heading">
          {isCorrect ? 'Excelente! Você acertou!' : 'Ops! Não foi dessa vez.'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {isCorrect
            ? 'Você dominou o cálculo da área dessa figura!'
            : 'Não se preocupe, errar faz parte do aprendizado! Veja a explicação:'}
        </p>

        {/* Rewards Ribbon (If correct) */}
        {isCorrect && (
          <div className="w-full bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 mb-5 flex items-center justify-around">
            {/* Stars */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-amber-700 mb-1">Estrelas</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= starsAwarded
                        ? 'text-amber-500 fill-amber-500 animate-bounce'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="h-8 w-px bg-amber-200" />

            {/* Score Earned */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-amber-700 mb-0.5">Pontuação</span>
              <span className="text-lg font-black text-amber-900">
                +{earnedPoints} pts
              </span>
            </div>

            {/* Streak Bonus */}
            {streakBonus > 0 && (
              <>
                <div className="h-8 w-px bg-amber-200" />
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-orange-700 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-orange-500" /> Combo
                  </span>
                  <span className="text-sm font-extrabold text-orange-600">
                    +{streakBonus} bônus
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step-by-Step Pedagogical Explanation Box */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-600" />
            <span>Passo a Passo da Resolução (D12)</span>
          </h4>

          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            {challenge.explanation.text}
          </p>

          {/* Breakdown Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
              🟩 Quadradinhos inteiros: {challenge.explanation.fullCount}
            </span>

            {challenge.explanation.halfCount ? (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                🔺 Metades: {challenge.explanation.halfCount} ({challenge.explanation.halfCount / 2} inteiros)
              </span>
            ) : null}

            {challenge.explanation.calculationFormula && (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-mono">
                {challenge.explanation.calculationFormula}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3">
          {!isCorrect ? (
            <>
              <button
                type="button"
                id="modal-retry-btn"
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tentar Novamente</span>
              </button>
              <button
                type="button"
                id="modal-next-btn-wrong"
                onClick={() => {
                  onClose();
                  onNext();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Próxima Fase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              id="modal-next-btn-correct"
              onClick={() => {
                onClose();
                onNext();
              }}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.01]"
            >
              <span>Continuar Desafio</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
