/**
 * @fileoverview Modelo de tipo de categoría clínica para IXOLOLI.
 *
 * Representa el primer nivel de la jerarquía de ejercicios:
 * - Fortalecimiento
 * - Estiramientos
 */

/**
 * Tipo de categoría clínica (primer nivel de la jerarquía drill-down).
 *
 * @example
 * ```typescript
 * const type: CategoryType = {
 *   id: 'ct-fortalecimiento',
 *   name: 'Fortalecimiento',
 *   emoji: '💪',
 *   description: 'Ejercicios para fortalecer los músculos.',
 *   color: '#2C7A7B',
 * };
 * ```
 */
export interface CategoryType {
  /** Identificador único. Ej: `'ct-fortalecimiento'` */
  id: string;

  /** Nombre visible. Ej: `'Fortalecimiento'` */
  name: string;

  /** Emoji representativo del tipo. */
  emoji: string;

  /** Descripción breve del enfoque clínico. */
  description: string;

  /** Color hex de referencia para la paleta visual. */
  color: string;
}
