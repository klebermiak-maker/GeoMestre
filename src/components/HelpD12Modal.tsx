import React from 'react';
import { X, BookOpen, Check, Layers, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HelpD12ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpD12Modal: React.FC<HelpD12ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Guia do Descritor 12 (SAEB 5º Ano)
              </h3>
              <p className="text-xs text-slate-500">
                Matriz de Referência de Matemática • Ensino Fundamental 1
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              soundManager.playTap();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="space-y-6 text-sm text-slate-700">
          
          {/* Section 1: Definition */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
            <h4 className="font-bold text-blue-900 text-base mb-1 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>O que diz o Descritor 12?</span>
            </h4>
            <p className="text-blue-800 leading-relaxed">
              <strong>"Resolver problema envolvendo o cálculo ou estimativa de áreas de figuras planas desenhadas em malhas quadriculadas."</strong>
            </p>
            <p className="text-xs text-blue-700 mt-2">
              Isso significa que você aprenderá a medir a superfície (o recheio) de qualquer figura contando quantos quadradinhos cabem dentro dela!
            </p>
          </div>

          {/* Section 2: Area vs Perimeter */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
            <h4 className="font-bold text-amber-900 text-base mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Cuidado: Não confunda Área com Perímetro!</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-emerald-700 block text-sm mb-1">🟩 ÁREA (Superfície)</span>
                <p className="text-slate-600">
                  É a quantidade de <strong>quadradinhos do interior</strong> que preenchem a figura. É como o piso ou a grama de um quintal.
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-rose-700 block text-sm mb-1">📏 PERÍMETRO (Contorno)</span>
                <p className="text-slate-600">
                  É a soma das <strong>linhas da borda</strong> ao redor da figura. É como a cerca ou o muro que contorna o quintal.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The secret of half squares */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <h4 className="font-bold text-emerald-900 text-base mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>O Segredo dos Meios Quadradinhos (Triângulos)</span>
            </h4>
            <p className="text-emerald-800 leading-relaxed mb-3">
              Muitas figuras do SAEB possuem pontas inclinadas ou telhados. Quando cortamos um quadradinho pela diagonal:
            </p>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-around text-center font-bold text-sm">
              <div>
                <span className="text-2xl block mb-1">🔺 + 🔺</span>
                <span className="text-emerald-700 text-xs">2 Metades</span>
              </div>
              <span className="text-2xl text-slate-400">=</span>
              <div>
                <span className="text-2xl block mb-1">🟩</span>
                <span className="text-blue-700 text-xs">1 Quadradinho Inteiro</span>
              </div>
            </div>
          </div>

          {/* Section 4: Golden Tips */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">Dicas para arrasar na prova:</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Use o <strong>Modo Marcador</strong> do nosso jogo para clicar e numerar os quadradinhos enquanto você conta!</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Para retângulos grandes, multiplique o <strong>comprimento × largura</strong> em vez de contar um por um.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Figuras com formatos diferentes podem ter <strong>a mesma área</strong>!</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => {
              onClose();
              soundManager.playTap();
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            Entendi! Voltar ao Jogo
          </button>
        </div>

      </div>
    </div>
  );
};
