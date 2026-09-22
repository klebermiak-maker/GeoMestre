import React, { useState } from 'react';
import { Challenge, CategoryInfo } from '../types';
import { Lightbulb, HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface QuestionCardProps {
  challenge: Challenge;
  category: CategoryInfo;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onSubmitAnswer: () => void;
  isSubmitted: boolean;
  isCorrect: boolean | null;
  onNextChallenge: () => void;
  onRetry: () => void;
  currentLevelIndex: number;
  totalLevelsCount: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  challenge,
  category,
  selectedOptionId,
  onSelectOption,
  onSubmitAnswer,
  isSubmitted,
  isCorrect,
  onNextChallenge,
  onRetry,
  currentLevelIndex,
  totalLevelsCount,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);

  const handleOptionClick = (optionId: string) => {
    if (isSubmitted) return;
    onSelectOption(optionId);
    soundManager.playTap();
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full bg-white rounded-2xl p-5 md:p-7 shadow-sm border border-slate-200 flex flex-col justify-between">
      <div>
        {/* Category Badge & Level Progression */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${category.bgColor} ${category.color} border ${category.borderColor}`}>
            <span>{category.badge}</span>
            <span>•</span>
            <span>{category.shortName}</span>
          </span>

          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Fase {currentLevelIndex + 1} de {totalLevelsCount}
          </span>
        </div>

        {/* Challenge Title */}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 font-heading">
          {challenge.title}
        </h2>

        {/* Context Story */}
        <div className="bg-slate-50 border-l-4 border-blue-500 rounded-r-xl p-3.5 mb-4 text-sm text-slate-700 leading-relaxed">
          <p>{challenge.contextStory}</p>
        </div>

        {/* Question Prompt */}
        <div className="mb-5">
          <p className="text-base font-semibold text-slate-800 leading-snug">
            {challenge.question}
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-2.5 mb-4">
          {challenge.options.map((option, idx) => {
            const letter = optionLetters[idx] || String(idx + 1);
            const isSelected = selectedOptionId === option.id;

            let buttonStyles = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 text-slate-800';

            if (isSelected && !isSubmitted) {
              buttonStyles = 'border-blue-600 bg-blue-50 text-blue-950 font-bold ring-2 ring-blue-500/20';
            } else if (isSubmitted) {
              if (option.isCorrect) {
                buttonStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
              } else if (isSelected && !option.isCorrect) {
                buttonStyles = 'border-rose-400 bg-rose-50 text-rose-950 line-through opacity-80';
              } else {
                buttonStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                id={`option-btn-${option.id}`}
                onClick={() => handleOptionClick(option.id)}
                disabled={isSubmitted}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer disabled:cursor-default ${buttonStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isSelected
                        ? isSubmitted && option.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted && !option.isCorrect
                          ? 'bg-rose-600 text-white'
                          : 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm md:text-base">{option.label}</span>
                </div>

                {isSubmitted && option.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                {isSubmitted && isSelected && !option.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hint Trigger */}
        {!isSubmitted && (
          <div className="mt-2">
            <button
              type="button"
              id="btn-toggle-hint"
              onClick={() => {
                setShowHint(!showHint);
                soundManager.playTap();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Ocultar Dica' : 'Precisa de uma Dica?'}</span>
            </button>

            {showHint && (
              <div className="mt-2 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed animate-fadeIn">
                <p>{challenge.hint}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer Button */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        {!isSubmitted ? (
          <button
            type="button"
            id="btn-confirm-answer"
            onClick={onSubmitAnswer}
            disabled={!selectedOptionId}
            className={`w-full py-3 px-6 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-sm transition-all ${
              selectedOptionId
                ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md cursor-pointer active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Confirmar Resposta</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full flex items-center gap-3">
            {!isCorrect ? (
              <button
                type="button"
                id="btn-retry-question"
                onClick={() => {
                  onRetry();
                  soundManager.playTap();
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tentar de Novo</span>
              </button>
            ) : null}

            <button
              type="button"
              id="btn-next-question"
              onClick={() => {
                onNextChallenge();
                soundManager.playTap();
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <span>Próxima Fase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
