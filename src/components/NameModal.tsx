import React, { useState } from 'react';
import { User, Check, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NameModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export const NameModal: React.FC<NameModalProps> = ({
  isOpen,
  currentName,
  onSave,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState<string>(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = nameInput.trim() || 'Estudante Campeão';
    onSave(clean);
    soundManager.playTap();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
            <User className="w-4 h-4" />
            <span>Identificação do Jogador</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
          Qual é o seu nome?
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Seu nome aparecerá no cabeçalho do jogo e no seu Certificado de Mestre do Descritor 12!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            id="student-name-input"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Digite seu nome (Ex: Lucas Silva)"
            maxLength={35}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-800 font-medium text-sm outline-none transition-all"
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Nome</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
