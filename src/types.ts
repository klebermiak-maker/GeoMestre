export type HalfCellOrientation = 'TL' | 'TR' | 'BL' | 'BR'; // Top-Left, Top-Right, Bottom-Left, Bottom-Right

export interface GridCell {
  x: number;
  y: number;
}

export interface HalfCell {
  x: number;
  y: number;
  orientation: HalfCellOrientation;
}

export type CategoryId = 
  | 'retangulos_quadrados'
  | 'poligonos_compostos'
  | 'metades_triangulos'
  | 'comparacao_equivalencia'
  | 'simulado_saeb_d12'
  | 'estimativa_irregulares';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortName: string;
  badge: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface ShapeData {
  id?: string;
  label?: string;
  color?: string;
  fullCells: GridCell[];
  halfCells?: HalfCell[];
}

export interface Challenge {
  id: string;
  categoryId: CategoryId;
  levelNumber: number;
  title: string;
  contextStory: string;
  question: string;
  unitLabel: string; // e.g. "quadradinhos", "cm²", "m²"
  gridWidth: number;
  gridHeight: number;
  primaryShape: ShapeData;
  secondaryShape?: ShapeData; // For comparison questions (e.g. "Qual figura tem maior área?")
  options: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
  }>;
  correctValue: number | string;
  explanation: {
    text: string;
    fullCount: number;
    halfCount?: number;
    calculationFormula?: string;
  };
  hint: string;
  difficulty: 1 | 2 | 3;
}

export interface UserLevelRecord {
  completed: boolean;
  stars: number; // 0 to 3
  bestScore: number;
  attempts: number;
}

export interface GameState {
  currentChallengeId: string;
  activeView: 'game' | 'levels' | 'lab' | 'saeb_quiz' | 'certificate';
  score: number;
  streak: number;
  bestStreak: number;
  levelRecords: Record<string, UserLevelRecord>;
  studentName: string;
  soundEnabled: boolean;
}
