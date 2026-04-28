/**
 * @fileoverview Modelos de dominio para perfiles de usuario IXOLOLI.
 *
 * Define los tipos de usuario (adulto/niño) y la estructura de un perfil
 * dentro de la plataforma de fisioterapia accesible.
 */

/**
 * Tipos de perfil soportados por la plataforma.
 * - `'adult'` — usuarios adultos (catálogo de ejercicios adultos)
 * - `'kids'`  — usuarios niños (catálogo con diseño adaptado y ejercicios pediátricos)
 */
export type UserType = 'adult' | 'kids';

/**
 * Perfil de un usuario de la plataforma IXOLOLI.
 *
 * @example
 * ```typescript
 * const user: UserProfile = {
 *   id: 'usr-001',
 *   name: 'María González',
 *   type: 'adult',
 *   age: 42,
 * };
 * ```
 */
export interface UserProfile {
  /** Identificador único del usuario. */
  id: string;

  /** Nombre completo o alias del usuario. */
  name: string;

  /**
   * Tipo de perfil que determina qué catálogo de ejercicios se muestra.
   * @see UserType
   */
  type: UserType;

  /**
   * Edad del usuario en años.
   * Opcional: puede no conocerse al inicio del onboarding.
   */
  age?: number;

  /**
   * URL de la imagen de avatar del usuario.
   * Puede ser una URL absoluta o relativa a `/assets/`.
   */
  avatarUrl?: string;

  /**
   * Condición o diagnóstico principal del usuario (uso interno clínico).
   * Ej: 'Tendinitis de hombro', 'Esguince de tobillo'.
   */
  diagnosis?: string;
}
