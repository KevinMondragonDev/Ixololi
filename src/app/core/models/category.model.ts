/**
 * @fileoverview Modelo de dominio para categorías de ejercicios IXOLOLI.
 *
 * Las categorías agrupan ejercicios por zona corporal (hombro, espalda, etc.)
 * y pueden estar dirigidas a adultos, niños o ambos.
 */

import { UserType } from './user-profile.model';

/**
 * Categoría de ejercicios de fisioterapia.
 *
 * Cada categoría representa una zona corporal o área terapéutica
 * y agrupa los ejercicios relacionados.
 *
 * @example
 * ```typescript
 * const shoulder: Category = {
 *   id: 'cat-shoulder',
 *   name: 'Hombro',
 *   slug: 'hombro',
 *   description: 'Ejercicios de movilidad y fortalecimiento del hombro.',
 *   targetUserType: 'all',
 *   color: '#2C7A7B',
 * };
 * ```
 */
export interface Category {
  /** Identificador único de la categoría. */
  id: string;

  /**
   * Nombre legible de la categoría.
   * Ej: `'Hombro'`, `'Espalda'`, `'Rodilla'`.
   */
  name: string;

  /**
   * Slug URL-friendly para enrutamiento.
   * Ej: `'hombro'`, `'espalda-lumbar'`.
   */
  slug: string;

  /**
   * URL de un ícono SVG o imagen representativa de la categoría.
   * Se usa en las tarjetas del catálogo.
   */
  iconUrl?: string;

  /** Descripción breve de la categoría para accesibilidad y SEO. */
  description: string;

  /**
   * Tipo de usuario al que está dirigida la categoría.
   * - `'adult'` — solo adultos
   * - `'kids'`  — solo niños
   * - `'all'`   — ambos
   */
  targetUserType: UserType | 'all';

  /**
   * Color de acento de la categoría en formato hexadecimal.
   * Usado para personalizar la UI de cada categoría.
   */
  color?: string;

  /**
   * Número total de ejercicios disponibles en esta categoría.
   * Campo calculado/derivado, no almacenado en el JSON principal.
   */
  exerciseCount?: number;
}
