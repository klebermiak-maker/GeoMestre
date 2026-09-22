import React from 'react';
import { Award, Star, Printer, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CertificateModalProps {
  studentName: string;
  onEditName: () => void;
  totalScore: number;
  totalStars: number;
  completedLevelsCount: number;
  totalLevelsCount: number;
  onBackToGame: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  studentName,
  onEditName,
  totalScore,
  totalStars,
  completedLevelsCount,
  totalLevelsCount,
  onBackToGame,
}) => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    soundManager.playTap();
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Actions Bar (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Certificado de Reconhecimento</h2>
          <p className="text-xs text-slate-500">Imprima ou salve como PDF para comprovar suas conquistas no Descritor 12!</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToGame}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Voltar aos Desafios
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border-8 border-double border-amber-600/60 shadow-xl relative overflow-hidden print:border-4 print:shadow-none print:m-0 print:p-8">
        {/* Decorative corner motifs */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-amber-600 pointer-events-none" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-amber-600 pointer-events-none" />

        <div className="text-center space-y-6 max-w-2xl mx-auto relative z-10">
          
          {/* Ribbon Header */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 px-5 py-1.5 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Certificado de Excelência Matemática</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-heading tracking-tight">
            MESTRE DAS ÁREAS
          </h1>

          <p className="text-sm md:text-base text-slate-600 uppercase tracking-wider font-semibold">
            Certificamos solenemente que o(a) estudante
          </p>

          {/* Student Name Display with Edit Trigger */}
          <div className="py-2 border-b-2 border-slate-300 inline-block min-w-[280px]">
            <span className="text-2xl md:text-4xl font-extrabold text-blue-700 font-heading">
              {studentName}
            </span>
            <button
              type="button"
              onClick={onEditName}
              className="ml-2 text-xs text-slate-400 hover:text-blue-600 underline print:hidden cursor-pointer"
            >
              (Editar nome)
            </button>
          </div>

          <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-xl mx-auto">
            concluiu com êxito os desafios pedagógicos de cálculo e estimativa de áreas em malhas quadriculadas, correspondentes ao <strong>Descritor 12 (D12) de Matemática para o 5º Ano do Ensino Fundamental I (SAEB/BNCC)</strong>.
          </p>

          {/* Achievement Stats Box */}
          <div className="grid grid-cols-3 gap-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-4 my-6">
            <div className="text-center">
              <span className="text-xs font-bold text-amber-800 block">Fases Vencidas</span>
              <span className="text-xl md:text-2xl font-black text-slate-900">
                {completedLevelsCount} / {totalLevelsCount}
              </span>
            </div>

            <div className="text-center border-x border-amber-200">
              <span className="text-xs font-bold text-amber-800 block">Estrelas</span>
              <div className="flex items-center justify-center gap-1 text-xl md:text-2xl font-black text-amber-600">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500 inline" />
                <span>{totalStars}</span>
              </div>
            </div>

            <div className="text-center">
              <span className="text-xs font-bold text-amber-800 block">Pontuação</span>
              <span className="text-xl md:text-2xl font-black text-blue-700">
                {totalScore} pts
              </span>
            </div>
          </div>

          {/* Seal and Signatures */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Data de Emissão</span>
              <span className="text-sm font-bold text-slate-700">{currentDate}</span>
            </div>

            {/* Gold Seal Graphic */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-900 shadow-md border-4 border-white">
              <Award className="w-10 h-10 stroke-[2]" />
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider block">Validação Pedagógica</span>
              <span className="text-sm font-bold text-emerald-700 flex items-center justify-center sm:justify-end gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>BNCC • EF05MA19</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
