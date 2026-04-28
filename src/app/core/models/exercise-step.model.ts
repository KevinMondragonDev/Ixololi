/**
 * @fileoverview Modelo de dominio para los pasos de un ejercicio en IXOLOLI.
 *
 * Un `ExerciseStep` representa una instrucción individual dentro de la
 * secuencia de pasos de un ejercicio de fisioterapia.
 * Los pasos están ordenados por `stepNumber` y pueden incluir imagen
 * ilustrativa y duración recomendada.
 */

/**
 * Paso detallado de un ejercicio de fisioterapia.
 *
 * Los pasos se presentan en secuencia para guiar al paciente
 * a través del ejercicio de forma clara y accesible.
 *
 * @example
 * ```typescript
 * const step: ExerciseStep = {
 *   stepNumber: 1,
 *   instruction: 'Siéntate en una silla con la espalda recta y los pies apoyados en el suelo.',
 *   imageUrl: 'assets/images/exercises/shoulder-step-1.webp',
 *   durationSeconds: 10,
 * };
 * ```
 */
export interface ExerciseStep {
  /**
   * Número de orden del paso dentro del ejercicio.
   * Empieza en `1`.
   */
  stepNumber: number;

  /**
   * Instrucción textual clara para el paciente.
   * Debe estar redactada en lenguaje simple y accesible.
   */
  instruction: string;

  /**
   * URL de una imagen ilustrativa del paso.
   * Se recomienda formato WebP para mejor rendimiento.
   * Si es `undefined`, se mostrará un placeholder genérico.
   */
  imageUrl?: string;

  /**
   * Duración recomendada del paso en segundos.
   * Se usa para mostrar un temporizador visual al usuario.
   * Si es `undefined`, no se muestra temporizador.
   */
  durationSeconds?: number;

  /**
   * Indicación de repeticiones para este paso.
   * Ej: `10`, `15`. Opcional, complementario a `durationSeconds`.
   */
  repetitions?: number;
}
