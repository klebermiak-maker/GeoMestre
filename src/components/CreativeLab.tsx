import React, { useState, useMemo } from 'react';
import { HalfCellOrientation } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Square, 
  Triangle, 
  Eraser, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Layers,
  Award
} from 'lucide-react';

interface LabCell {
  type: 'full' | 'half' | 'empty';
  orientation?: HalfCellOrientation;
  color: string;
}

export const CreativeLab: React.FC = () => {
  const gridDim = 8; // 8x8 grid
  const [selectedTool, setSelectedTool] = useState<'full' | 'half' | 'eraser'>('full');
  const [halfOrientation, setHalfOrientation] = useState<HalfCellOrientation>('TL');
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [cells, setCells] = useState<Record<string, LabCell>>({});
  const [targetMissionIndex, setTargetMissionIndex] = useState<number>(0);

  const missions = [
    { targetArea: 6, label: 'Desenhe uma figura com exatamente 6 quadradinhos de área.' },
    { targetArea: 8.5, label: 'Desenhe uma figura mista com exatamente 8,5 quadradinhos (use triângulos!).' },
    { targetArea: 12, label: 'Desenhe um polígono com exatamente 12 quadradinhos de área.' },
    { targetArea: 15, label: 'Crie uma grande figura com 15 quadradinhos de área.' },
  ];

  const currentMission = missions[targetMissionIndex];

  // Calculate live area
  const { fullCount, halfCount, totalArea } = useMemo(() => {
    let full = 0;
    let half = 0;

    Object.values(cells).forEach(cell => {
      if (cell.type === 'full') full += 1;
      if (cell.type === 'half') half += 1;
    });

    const area = full + (half * 0.5);
    return { fullCount: full, halfCount: half, totalArea: area };
  }, [cells]);

  // Check mission success
  const isMissionMet = totalArea === currentMission.targetArea;

  const handleCellClick = (x: number, y: number) => {
    const key = `${x},${y}`;
    const newCells = { ...cells };

    if (selectedTool === 'eraser') {
      if (newCells[key]) {
        delete newCells[key];
        setCells(newCells);
        soundManager.playTap();
      }
    } else if (selectedTool === 'full') {
      newCells[key] = {
        type: 'full',
        color: selectedColor,
      };
      setCells(newCells);
      soundManager.playTap();
    } else if (selectedTool === 'half') {
      newCells[key] = {
        type: 'half',
        orientation: halfOrientation,
        color: selectedColor,
      };
      setCells(newCells);
      soundManager.playTap();
    }

    // If new area matches mission
    const nextFull = Object.values(newCells).filter(c => c.type === 'full').length;
    const nextHalf = Object.values(newCells).filter(c => c.type === 'half').length;
    const nextArea = nextFull + nextHalf * 0.5;

    if (nextArea === currentMission.targetArea && totalArea !== currentMission.targetArea) {
      soundManager.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const clearAll = () => {
    setCells({});
    soundManager.playTap();
  };

  const getTrianglePoints = (orientation: HalfCellOrientation, size: number) => {
    switch (orientation) {
      case 'TL': return `0,0 ${size},0 0,${size}`;
      case 'TR': return `0,0 ${size},0 ${size},${size}`;
      case 'BL': return `0,0 0,${size} ${size},${size}`;
      case 'BR': return `${size},0 0,${size} ${size},${size}`;
      default: return `0,0 ${size},0 0,${size}`;
    }
  };

  const cellSize = 46;
  const totalWidth = gridDim * cellSize;
  const totalHeight = gridDim * cellSize;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Title & Mission Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espaço Livre de Criação</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-heading">
              Laboratório Criativo do Descritor 12
            </h2>
            <p className="text-sm text-slate-500">
              Pinte quadradinhos inteiros e metades triangulares para descobrir como a área é calculada na prática!
            </p>
          </div>

          {/* Mission Widget */}
          <div className={`p-4 rounded-2xl border-2 transition-all self-stretch md:self-auto min-w-[280px] ${
            isMissionMet
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
              : 'bg-amber-50/70 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Missão {targetMissionIndex + 1} de {missions.length}</span>
              </span>
              {isMissionMet && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Concluído!
                </span>
              )}
            </div>

            <p className="text-xs font-semibold leading-snug mb-2">
              {currentMission.label}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-amber-200/50">
              <span className="text-xs text-slate-600 font-medium">
                Meta: <strong>{currentMission.targetArea} u²</strong> (Atual: <strong>{totalArea} u²</strong>)
              </span>
              <button
                type="button"
                id="btn-next-mission"
                onClick={() => {
                  setTargetMissionIndex((targetMissionIndex + 1) % missions.length);
                  soundManager.playTap();
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
              >
                Trocar Missão
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Toolbar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Ferramentas de Desenho</span>
          </h3>

          {/* Tools Selector */}
          <div className="space-y-2">
            <button
              type="button"
              id="tool-full-square"
              onClick={() => {
                setSelectedTool('full');
                soundManager.playTap();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                selectedTool === 'full'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="w-6 h-6 rounded bg-blue-600 flex-shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">Quadradinho Inteiro</span>
                <span className="text-xs font-normal text-slate-500">Vale 1 unidade de área</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-half-triangle"
              onClick={() => {
                setSelectedTool('half');
                soundManager.playTap();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                selectedTool === 'half'
                  ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-xl leading-none font-bold text-amber-600 flex-shrink-0">🔺</span>
              <div className="text-left">
                <span className="block leading-tight">Metade (Triângulo)</span>
                <span className="text-xs font-normal text-slate-500">Vale 0,5 (½) unidade</span>
              </div>
            </button>

            <button
              type="button"
              id="tool-eraser"
              onClick={() => {
                setSelectedTool('eraser');
                soundManager.playTap();
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                selectedTool === 'eraser'
                  ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <Eraser className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div className="text-left">
                <span className="block leading-tight">Borracha</span>
                <span className="text-xs font-normal text-slate-500">Clique para apagar</span>
              </div>
            </button>
          </div>

          {/* Half Triangle Orientations (when half tool selected) */}
          {selectedTool === 'half' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                Escolha a inclinação do triângulo:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['TL', 'TR', 'BL', 'BR'] as HalfCellOrientation[]).map((orient) => (
                  <button
                    key={orient}
                    type="button"
                    onClick={() => {
                      setHalfOrientation(orient);
                      soundManager.playTap();
                    }}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      halfOrientation === orient
                        ? 'border-amber-600 bg-amber-200/60 font-bold'
                        : 'border-amber-200 bg-white hover:bg-amber-100/50'
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" className="border border-slate-300 rounded bg-white">
                      <polygon points={getTrianglePoints(orient, 24)} fill="#f59e0b" />
                    </svg>
                    <span className="text-[10px] text-amber-800 font-semibold">{orient}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Picker */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">Cor do Traço:</span>
            <div className="flex items-center gap-2">
              {[
                { name: 'Azul', hex: '#3b82f6' },
                { name: 'Verde', hex: '#10b981' },
                { name: 'Roxo', hex: '#8b5cf6' },
                { name: 'Laranja', hex: '#f97316' },
                { name: 'Rosa', hex: '#ec4899' },
              ].map(c => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    setSelectedColor(c.hex);
                    soundManager.playTap();
                  }}
                  className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                    selectedColor === c.hex ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            id="btn-clear-canvas"
            onClick={clearAll}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar Malha Inteira</span>
          </button>
        </div>

        {/* Center Canvas Grid */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
          
          {/* Live Dynamic Stats Dashboard */}
          <div className="w-full grid grid-cols-3 gap-3 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-semibold text-blue-700 block">Área Total</span>
              <span className="text-2xl font-black text-blue-900 font-heading">
                {totalArea} <span className="text-sm font-semibold">u²</span>
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-semibold text-slate-600 block">Inteiros</span>
              <span className="text-2xl font-black text-slate-800 font-heading">
                {fullCount} <span className="text-sm font-semibold">🟩</span>
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-center">
              <span className="text-xs font-semibold text-amber-700 block">Metades (½)</span>
              <span className="text-2xl font-black text-amber-900 font-heading">
                {halfCount} <span className="text-sm font-semibold">🔺</span>
              </span>
            </div>
          </div>

          {/* Pedagogical Formula Ribbon */}
          <div className="w-full bg-slate-100 rounded-xl px-4 py-2 mb-4 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>
                Cálculo em tempo real: <strong>{fullCount}</strong> inteiros + <strong>{halfCount}</strong> metades ({halfCount * 0.5} inteiros) = <strong>{totalArea} quadradinhos</strong>
              </span>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
          <div className="overflow-x-auto p-1">
            <div
              className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-slate-50 shadow-inner select-none cursor-pointer"
              style={{ width: totalWidth, height: totalHeight }}
            >
              <svg
                width={totalWidth}
                height={totalHeight}
                className="block"
                viewBox={`0 0 ${totalWidth} ${totalHeight}`}
              >
                <defs>
                  <pattern
                    id="lab-grid-pattern"
                    width={cellSize}
                    height={cellSize}
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width={cellSize} height={cellSize} fill="#ffffff" />
                    <path
                      d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                    />
                  </pattern>
                </defs>

                <rect width={totalWidth} height={totalHeight} fill="url(#lab-grid-pattern)" />

                {Array.from({ length: gridDim }).map((_, y) =>
                  Array.from({ length: gridDim }).map((_, x) => {
                    const key = `${x},${y}`;
                    const cell = cells[key];
                    const cellX = x * cellSize;
                    const cellY = y * cellSize;

                    return (
                      <g
                        key={`lab-cell-${x}-${y}`}
                        onClick={() => handleCellClick(x, y)}
                        className="group"
                      >
                        {/* Cell hover outline */}
                        <rect
                          x={cellX}
                          y={cellY}
                          width={cellSize}
                          height={cellSize}
                          fill="transparent"
                          className="group-hover:fill-blue-500/15 transition-colors"
                        />

                        {/* Full painted cell */}
                        {cell?.type === 'full' && (
                          <rect
                            x={cellX + 1}
                            y={cellY + 1}
                            width={cellSize - 2}
                            height={cellSize - 2}
                            fill={cell.color}
                            stroke="#0f172a"
                            strokeWidth="1"
                            rx={2}
                          />
                        )}

                        {/* Half triangle painted cell */}
                        {cell?.type === 'half' && cell.orientation && (
                          <g transform={`translate(${cellX}, ${cellY})`}>
                            <polygon
                              points={getTrianglePoints(cell.orientation, cellSize)}
                              fill={cell.color}
                              stroke="#0f172a"
                              strokeWidth="1"
                            />
                            <text
                              x={cellSize / 2}
                              y={cellSize / 2 + 4}
                              textAnchor="middle"
                              fontSize="12"
                              fontWeight="bold"
                              fill="#ffffff"
                            >
                              ½
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })
                )}
              </svg>
            </div>
          </div>

          <span className="text-xs text-slate-400 mt-4">
            Toque nos quadradinhos para pintar ou apagar com a ferramenta selecionada.
          </span>
        </div>

      </div>
    </div>
  );
};
