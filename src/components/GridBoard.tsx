import React, { useState, useEffect } from 'react';
import { ShapeData, HalfCellOrientation } from '../types';
import { soundManager } from '../utils/audio';
import { Eraser, Pencil, Eye, EyeOff, Sparkles } from 'lucide-react';

interface GridBoardProps {
  width: number;
  height: number;
  unitLabel: string;
  primaryShape: ShapeData;
  secondaryShape?: ShapeData;
  isAnswerSubmitted?: boolean;
  showAutoSolution?: boolean;
  challengeId?: string;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  width,
  height,
  unitLabel,
  primaryShape,
  secondaryShape,
  isAnswerSubmitted = false,
  showAutoSolution = false,
  challengeId,
}) => {
  // Student's manual markings: coordinates mapped to count index
  const [markedCells, setMarkedCells] = useState<Record<string, number>>({});
  const [markingActive, setMarkingActive] = useState<boolean>(true);
  const [showSolutionGuide, setShowSolutionGuide] = useState<boolean>(false);

  // Automatically reset markings when changing challenges
  useEffect(() => {
    setMarkedCells({});
    setShowSolutionGuide(false);
  }, [challengeId, primaryShape]);

  // Clear student manual markings
  const clearMarks = () => {
    setMarkedCells({});
    soundManager.playTap();
  };

  const handleCellClick = (x: number, y: number) => {
    if (isAnswerSubmitted) return;

    const key = `${x},${y}`;
    const newMarks = { ...markedCells };

    if (newMarks[key]) {
      // Remove mark
      delete newMarks[key];
      // Renumber remaining marks sequentially
      const updated: Record<string, number> = {};
      let counter = 1;
      Object.keys(newMarks).forEach(k => {
        updated[k] = counter++;
      });
      setMarkedCells(updated);
      soundManager.playTap();
    } else {
      // Add next sequential number
      const nextNum = Object.keys(newMarks).length + 1;
      newMarks[key] = nextNum;
      setMarkedCells(newMarks);
      soundManager.playMark(nextNum);
    }
  };

  // Check if a cell belongs to primary or secondary shape
  const getCellType = (x: number, y: number) => {
    const isPrimaryFull = primaryShape.fullCells.some(c => c.x === x && c.y === y);
    const primaryHalf = primaryShape.halfCells?.find(c => c.x === x && c.y === y);

    const isSecondaryFull = secondaryShape?.fullCells.some(c => c.x === x && c.y === y);
    const secondaryHalf = secondaryShape?.halfCells?.find(c => c.x === x && c.y === y);

    return {
      isPrimaryFull,
      primaryHalf,
      isSecondaryFull,
      secondaryHalf,
    };
  };

  // Pre-calculate sequential numbering for solution guide
  const autoSolutionNumbering: Record<string, string> = {};
  let autoFullCounter = 1;
  primaryShape.fullCells.forEach(c => {
    autoSolutionNumbering[`${c.x},${c.y}`] = `${autoFullCounter++}`;
  });
  if (primaryShape.halfCells) {
    primaryShape.halfCells.forEach((c) => {
      autoSolutionNumbering[`${c.x},${c.y}_half`] = '½';
    });
  }
  if (secondaryShape) {
    let autoSecCounter = 1;
    secondaryShape.fullCells.forEach(c => {
      autoSolutionNumbering[`sec_${c.x},${c.y}`] = `${autoSecCounter++}`;
    });
    secondaryShape.halfCells?.forEach(c => {
      autoSolutionNumbering[`sec_${c.x},${c.y}_half`] = '½';
    });
  }

  // Generate triangle path for half cell orientations
  const getTrianglePath = (orientation: HalfCellOrientation, cellSize: number) => {
    switch (orientation) {
      case 'TL': // Top-Left triangle (top-left, top-right, bottom-left)
        return `0,0 ${cellSize},0 0,${cellSize}`;
      case 'TR': // Top-Right triangle (top-left, top-right, bottom-right)
        return `0,0 ${cellSize},0 ${cellSize},${cellSize}`;
      case 'BL': // Bottom-Left triangle (top-left, bottom-left, bottom-right)
        return `0,0 0,${cellSize} ${cellSize},${cellSize}`;
      case 'BR': // Bottom-Right triangle (top-right, bottom-left, bottom-right)
        return `${cellSize},0 0,${cellSize} ${cellSize},${cellSize}`;
      default:
        return `0,0 ${cellSize},0 0,${cellSize}`;
    }
  };

  const cellSize = 54;
  const totalSvgWidth = width * cellSize;
  const totalSvgHeight = height * cellSize;

  const isGuiding = showSolutionGuide || showAutoSolution;
  const markedCount = Object.keys(markedCells).length;

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-200">
      {/* Top Legend and Controls Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 text-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
            <span className="w-4 h-4 rounded bg-blue-500 inline-block"></span>
            <span>1 quadradinho = 1 {unitLabel === 'comparação' ? 'unidade' : unitLabel}</span>
          </div>

          {(primaryShape.halfCells?.length || secondaryShape?.halfCells?.length) ? (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg font-medium border border-amber-200">
              <span className="text-base leading-none font-bold">🔺</span>
              <span>1 triângulo = ½ (0,5) quadradinho</span>
            </div>
          ) : null}

          {secondaryShape && (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-blue-700 font-semibold text-xs bg-blue-50 px-2 py-1 rounded">
                <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>
                {primaryShape.label || 'Figura A'}
              </span>
              <span className="flex items-center gap-1 text-orange-700 font-semibold text-xs bg-orange-50 px-2 py-1 rounded">
                <span className="w-3 h-3 bg-orange-500 rounded-sm"></span>
                {secondaryShape.label || 'Figura B'}
              </span>
            </div>
          )}
        </div>

        {/* Student interactive counting tools */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-toggle-marking"
            onClick={() => setMarkingActive(!markingActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              markingActive
                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Ative para clicar nos quadradinhos e marcá-los com números enquanto conta!"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>{markingActive ? 'Modo Marcador (Ativo)' : 'Ativar Marcador'}</span>
          </button>

          {markedCount > 0 && (
            <button
              type="button"
              id="btn-clear-marks"
              onClick={clearMarks}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
              title="Limpar todos os números marcados"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Limpar ({markedCount})</span>
            </button>
          )}

          <button
            type="button"
            id="btn-toggle-guide"
            onClick={() => setShowSolutionGuide(!showSolutionGuide)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isGuiding
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            title="Mostrar numeração e contagem passo a passo"
          >
            {isGuiding ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isGuiding ? 'Ocultar Guia' : 'Dica Visual'}</span>
          </button>
        </div>
      </div>

      {/* Helpful instruction notice for 5th graders */}
      {markingActive && !isAnswerSubmitted && markedCount === 0 && (
        <div className="w-full mb-3 px-3 py-2 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span><strong>Dica do Aluno:</strong> Clique nos quadradinhos da malha para numerar enquanto você conta!</span>
          </span>
          <span className="text-indigo-600 font-bold hidden sm:inline">Toque para marcar</span>
        </div>
      )}

      {/* SVG Canvas Board */}
      <div className="w-full overflow-x-auto flex justify-center py-2 px-1">
        <div
          className="relative inline-block border-2 border-slate-300 rounded-xl overflow-hidden bg-slate-50 shadow-inner select-none touch-manipulation max-w-full"
          style={{ width: totalSvgWidth, height: totalSvgHeight }}
        >
          {/* Background Grid Pattern */}
          <svg
            width={totalSvgWidth}
            height={totalSvgHeight}
            className="block"
            viewBox={`0 0 ${totalSvgWidth} ${totalSvgHeight}`}
          >
            <defs>
              <pattern
                id="grid-pattern"
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

            {/* Base Grid */}
            <rect width={totalSvgWidth} height={totalSvgHeight} fill="url(#grid-pattern)" />
            {/* Outer border lines */}
            <line x1={0} y1={totalSvgHeight} x2={totalSvgWidth} y2={totalSvgHeight} stroke="#cbd5e1" strokeWidth="2" />
            <line x1={totalSvgWidth} y1={0} x2={totalSvgWidth} y2={totalSvgHeight} stroke="#cbd5e1" strokeWidth="2" />

            {/* Render Shapes Cell by Cell */}
            {Array.from({ length: height }).map((_, y) =>
              Array.from({ length: width }).map((_, x) => {
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                const cellKey = `${x},${y}`;
                const { isPrimaryFull, primaryHalf, isSecondaryFull, secondaryHalf } = getCellType(x, y);

                const primaryColor = primaryShape.color || '#3b82f6';
                const secondaryColor = secondaryShape?.color || '#f97316';

                // Student manual marking number
                const markNum = markedCells[cellKey];

                // Auto guide solution number
                const guideFullNum = isPrimaryFull
                  ? autoSolutionNumbering[cellKey]
                  : isSecondaryFull
                  ? autoSolutionNumbering[`sec_${cellKey}`]
                  : null;

                return (
                  <g
                    key={`cell-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    className="cursor-pointer group"
                  >
                    {/* Hover indicator */}
                    <rect
                      x={cellX}
                      y={cellY}
                      width={cellSize}
                      height={cellSize}
                      fill="transparent"
                      className="group-hover:fill-blue-500/10 transition-colors"
                    />

                    {/* Primary Shape: Full Cell */}
                    {isPrimaryFull && (
                      <rect
                        x={cellX + 1}
                        y={cellY + 1}
                        width={cellSize - 2}
                        height={cellSize - 2}
                        fill={primaryColor}
                        fillOpacity="0.88"
                        stroke="#1d4ed8"
                        strokeWidth="1.5"
                        rx={3}
                        className="transition-transform group-hover:scale-[0.98]"
                      />
                    )}

                    {/* Primary Shape: Half Cell (Triangle) */}
                    {primaryHalf && (
                      <g transform={`translate(${cellX}, ${cellY})`}>
                        <polygon
                          points={getTrianglePath(primaryHalf.orientation, cellSize)}
                          fill={primaryColor}
                          fillOpacity="0.88"
                          stroke="#1d4ed8"
                          strokeWidth="1.5"
                          className="transition-transform group-hover:scale-[0.98]"
                        />
                      </g>
                    )}

                    {/* Secondary Shape: Full Cell */}
                    {isSecondaryFull && (
                      <rect
                        x={cellX + 1}
                        y={cellY + 1}
                        width={cellSize - 2}
                        height={cellSize - 2}
                        fill={secondaryColor}
                        fillOpacity="0.88"
                        stroke="#c2410c"
                        strokeWidth="1.5"
                        rx={3}
                        className="transition-transform group-hover:scale-[0.98]"
                      />
                    )}

                    {/* Secondary Shape: Half Cell (Triangle) */}
                    {secondaryHalf && (
                      <g transform={`translate(${cellX}, ${cellY})`}>
                        <polygon
                          points={getTrianglePath(secondaryHalf.orientation, cellSize)}
                          fill={secondaryColor}
                          fillOpacity="0.88"
                          stroke="#c2410c"
                          strokeWidth="1.5"
                          className="transition-transform group-hover:scale-[0.98]"
                        />
                      </g>
                    )}

                    {/* Guide Solution Numbers */}
                    {isGuiding && guideFullNum && (
                      <text
                        x={cellX + cellSize / 2}
                        y={cellY + cellSize / 2 + 5}
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="#ffffff"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                      >
                        {guideFullNum}
                      </text>
                    )}

                    {/* Guide Half-cell fraction indicator */}
                    {isGuiding && (primaryHalf || secondaryHalf) && (
                      <text
                        x={cellX + cellSize / 2}
                        y={cellY + cellSize / 2 + 5}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="#ffffff"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                      >
                        ½
                      </text>
                    )}

                    {/* Student Manual Marking Badge (Circle with number) */}
                    {markNum && !isGuiding && (
                      <g transform={`translate(${cellX + cellSize / 2}, ${cellY + cellSize / 2})`}>
                        <circle
                          r={14}
                          fill="#fef08a"
                          stroke="#ca8a04"
                          strokeWidth="2"
                        />
                        <text
                          y={4.5}
                          textAnchor="middle"
                          fontSize="13"
                          fontWeight="800"
                          fill="#713f12"
                        >
                          {markNum}
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

      {/* Bottom Counter Feedback & Status */}
      <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-1.5">
          <span>Tamanho da Malha:</span>
          <span className="font-semibold text-slate-700">{width} × {height} colunas</span>
        </div>
        {markedCount > 0 ? (
          <div className="font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Você marcou <strong>{markedCount}</strong> quadradinho{markedCount > 1 ? 's' : ''}
          </div>
        ) : (
          <span className="text-slate-400 italic">Nenhum quadradinho marcado ainda</span>
        )}
      </div>
    </div>
  );
};
