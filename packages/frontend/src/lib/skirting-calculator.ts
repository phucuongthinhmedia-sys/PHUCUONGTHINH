/**
 * Tile Skirting Calculator - Pure calculation logic
 * Calculates how many tiles needed to cut skirting boards
 */

export interface SkirtingInput {
  totalLengthM: number;
  tileWidthCM: number;
  tileHeightCM: number;
  skirtingHeightCM: number;
  bladeLossMM?: number;
  wastePercent?: number;
}

export interface SkirtingResult {
  piecesPerTile: number;
  exactTiles: number;
  totalTilesToBuy: number;
  totalAreaM2: number;
}

/**
 * Calculate skirting board requirements
 * @param input - Calculation parameters
 * @returns Calculation results
 */
export function calculateSkirting(input: SkirtingInput): SkirtingResult {
  const {
    totalLengthM,
    tileWidthCM,
    tileHeightCM,
    skirtingHeightCM,
    bladeLossMM = 2,
    wastePercent = 5,
  } = input;

  // Convert to mm for precision
  const tileHeightMM = tileHeightCM * 10;
  const skirtingHeightMM = skirtingHeightCM * 10;

  // Calculate pieces per tile
  const piecesPerTile = Math.floor(
    (tileHeightMM + bladeLossMM) / (skirtingHeightMM + bladeLossMM),
  );

  // Length covered by one tile (in meters)
  const lengthPerTileM = piecesPerTile * (tileWidthCM / 100);

  // Exact tiles needed
  const exactTiles = totalLengthM / lengthPerTileM;

  // Total tiles to buy (with waste)
  const totalTilesToBuy = Math.ceil(exactTiles * (1 + wastePercent / 100));

  // Total area in m2
  const totalAreaM2 =
    totalTilesToBuy * (tileWidthCM / 100) * (tileHeightCM / 100);

  return {
    piecesPerTile,
    exactTiles: Math.round(exactTiles * 100) / 100,
    totalTilesToBuy,
    totalAreaM2: Math.round(totalAreaM2 * 100) / 100,
  };
}

/**
 * Validate input values
 */
export function validateSkirtingInput(
  input: Partial<SkirtingInput>,
): string | null {
  if (!input.totalLengthM || input.totalLengthM <= 0) {
    return "Tổng mét dài phải lớn hơn 0";
  }
  if (!input.tileWidthCM || input.tileWidthCM <= 0) {
    return "Chiều rộng gạch phải lớn hơn 0";
  }
  if (!input.tileHeightCM || input.tileHeightCM <= 0) {
    return "Chiều dài gạch phải lớn hơn 0";
  }
  if (!input.skirtingHeightCM || input.skirtingHeightCM <= 0) {
    return "Chiều cao len phải lớn hơn 0";
  }
  if (input.skirtingHeightCM >= input.tileHeightCM) {
    return "Chiều cao len phải nhỏ hơn chiều dài gạch";
  }
  if (input.bladeLossMM !== undefined && input.bladeLossMM < 0) {
    return "Hao hụt lưỡi cắt không được âm";
  }
  if (input.wastePercent !== undefined && input.wastePercent < 0) {
    return "Phần trăm hao hụt không được âm";
  }
  return null;
}
