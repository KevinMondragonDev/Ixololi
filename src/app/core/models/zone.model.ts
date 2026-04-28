/**
 * @fileoverview Modelo de zona corporal para IXOLOLI.
 *
 * Representa el segundo nivel de la jerarquía drill-down:
 * - Miembros Torácicos (hombro, codo, muñeca, mano)
 * - Miembros Pélvicos  (cadera, rodilla, tobillo, pie)
 */

/**
 * Zona corporal (segundo nivel de la jerarquía drill-down).
 *
 * @example
 * ```typescript
 * const zone: Zone = {
 *   id: 'zone-thoracic',
 *   name: 'Miembros Torácicos',
 *   emoji: '💪',
 *   description: 'Hombro, codo, antebrazo, muñeca y mano.',
 * };
 * ```
 */
export interface Zone {
  /** Identificador único. Ej: `'zone-thoracic'` */
  id: string;

  /** Nombre visible. Ej: `'Miembros Torácicos'` */
  name: string;

  /** Emoji representativo de la zona. */
  emoji: string;

  /** Descripción de las articulaciones y segmentos incluidos. */
  description: string;
}
