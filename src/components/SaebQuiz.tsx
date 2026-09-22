import React, { useState } from 'react';
import { CHALLENGES } from '../data/levels';
import { Challenge } from '../types';
import { GridBoard } from './GridBoard';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, Sparkles, Brain, Trophy, Star } from 'lucide-react';

interface SaebQuizProps {
  onBackToMap: () => void;
  studentName: string;
}

export const SaebQuiz: React.FC<SaebQuizProps> = ({ onBackToMap, studentName }) => {
  // Filter questions specifically focused on SAEB or select representative assessment items
  const quizQuestions = CHALLENGES.filter(
    (c) => c.categoryId === 'simulado_saeb_d12' || c.levelNumber % 4 === 0 || c.id === 'lvl-21' || c.id === 'lvl-23'
  ).slice(0, 6);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answersRecord, setAnswersRecord] = useState<Array<{ correct: boolean; questionTitle: string }>>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: Challenge = quizQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    soundManager.playTap();
  };

  const handleConfirm = () => {
    if (!selectedOptionId || isAnswered) return;

    const chosen = currentQ.options.find((o) => o.id === selectedOptionId);
    const correct = chosen?.isCorrect ?? false;

    setIsAnswered(true);
    if (correct) {
      soundManager.playCorrect();
      setScore((prev) => prev + 100);
    } else {
      soundManager.playError();
    }

    setAnswersRecord((prev) => [...prev, { correct, questionTitle: currentQ.title }]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      soundManager.playTap();
    } else {
      setIsFinished(true);
      soundManager.playFanfare();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setAnswersRecord([]);
    setIsFinished(false);
    soundManager.playTap();
  };

  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);

  // Result screen when finished
  if (isFinished) {
    const totalCorrect = answersRecord.filter((a) => a.correct).length;
    const percentage = Math.round((totalCorrect / quizQuestions.length) * 100);

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Simulado Concluído
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-heading">
            Resultado do Simulado SAEB D12
          </h2>

          <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
            Parabéns pelo empenho, <strong>{studentName}</strong>! Veja como foi seu desempenho:
          </p>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs text-slate-500 font-semibold block">Questões Certas</span>
              <span className="text-2xl font-black text-emerald-600">
                {totalCorrect} / {quizQuestions.length}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs text-slate-500 font-semibold block">Aproveitamento</span>
              <span className="text-2xl font-black text-blue-600">
                {percentage}%
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-xs text-slate-500 font-semibold block">Pontos Extras</span>
              <span className="text-2xl font-black text-amber-600">
                +{score} pts
              </span>
            </div>
          </div>

          {/* Feedback message */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-left max-w-lg mx-auto mb-6">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Avaliação do Professor Virtual:</span>
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {percentage >= 80
                ? 'Espetacular! Você demonstrou domínio completo do cálculo e estimativa de áreas em malhas quadriculadas segundo a Matriz SAEB!'
                : percentage >= 50
                ? 'Muito bom progresso! Você já compreende bem o conceito de área e metades triangulares. Continue praticando para gabaritar a prova!'
                : 'Bom início de treino! Lembre-se de sempre contar quadradinho por quadradinho e somar 2 metades triangulares para formar 1 quadradinho inteiro.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              id="btn-quiz-retry"
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-sm text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refazer Simulado</span>
            </button>
            <button
              type="button"
              id="btn-quiz-back"
              onClick={onBackToMap}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Voltar aos Mundos</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>Simulado Prova SAEB (Descritor 12)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading">
            Treino Oficial de Avaliação Externa
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm">
            Questão {currentIndex + 1} de {quizQuestions.length} • Leia a questão com atenção e calcule a área.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-center self-stretch sm:self-auto justify-around">
          <div>
            <span className="text-[10px] text-indigo-200 block uppercase font-bold">Progresso</span>
            <span className="text-lg font-black">{currentIndex + 1}/{quizQuestions.length}</span>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Pontos</span>
            <span className="text-lg font-black text-amber-300">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Question Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Grid Representation */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <GridBoard
            width={currentQ.gridWidth}
            height={currentQ.gridHeight}
            unitLabel={currentQ.unitLabel}
            primaryShape={currentQ.primaryShape}
            secondaryShape={currentQ.secondaryShape}
            isAnswerSubmitted={isAnswered}
            challengeId={currentQ.id}
          />
        </div>

        {/* Question Prompt and Options Card */}
        <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-0.5 rounded-md">
              Questão {currentIndex + 1}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {currentQ.title}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed">
            {currentQ.contextStory}
          </p>

          <p className="text-base font-black text-slate-900 mb-4 leading-snug">
            {currentQ.question}
          </p>

          {/* Options List */}
          <div className="space-y-2.5 mb-5">
            {currentQ.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOpt = opt.isCorrect;

              let optionStyle = 'border-slate-200 bg-white hover:border-indigo-400 text-slate-800';
              if (isAnswered) {
                if (isCorrectOpt) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                } else if (isSelected && !isCorrectOpt) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20';
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  id={`quiz-option-${opt.id}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-3.5 rounded-xl border-2 text-left font-medium text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isAnswered && isCorrectOpt
                          ? 'bg-emerald-600 text-white'
                          : isAnswered && isSelected && !isCorrectOpt
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="font-semibold">{opt.label}</span>
                  </div>

                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action / Next Button */}
          {!isAnswered ? (
            <button
              type="button"
              id="btn-quiz-confirm"
              disabled={!selectedOptionId}
              onClick={handleConfirm}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedOptionId
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Confirmar Resposta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">
                  {selectedOption?.isCorrect ? '✨ Correto!' : '⚠️ Resolução:'}
                </span>
                <p>{currentQ.explanation.text}</p>
              </div>

              <button
                type="button"
                id="btn-quiz-next"
                onClick={handleNext}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{currentIndex + 1 < quizQuestions.length ? 'Próxima Questão' : 'Ver Resultado'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
