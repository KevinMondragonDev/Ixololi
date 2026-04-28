/**
 * @fileoverview Modelo de dominio para ejercicios de fisioterapia en IXOLOLI.
 *
 * Un `Exercise` es la entidad central de la plataforma: contiene toda la
 * información necesaria para que el paciente realice un ejercicio correctamente,
 * incluyendo imagen, video, descripción, nivel de dificultad y pasos detallados.
 */

import { UserType } from './user-profile.model';
import { ExerciseStep } from './exercise-step.model';

/**
 * Nivel de dificultad de un ejercicio.
 * - `'beginner'`     — Principiante: movimientos básicos de bajo impacto
 * - `'intermediate'` — Intermedio: requiere algo de fuerza o coordinación
 * - `'advanced'`     — Avanzado: movimientos complejos o de alta demanda
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Ejercicio de fisioterapia.
 *
 * Entidad principal del dominio IXOLOLI. Contiene toda la información
 * clínica y multimedia necesaria para guiar al paciente.
 *
 * @example
 * ```typescript
 * const exercise: Exercise = {
 *   id: 'ex-001',
 *   title: 'Rotación de Hombro con Banda Elástica',
 *   imageUrl: 'assets/images/exercises/shoulder-rotation.webp',
 *   categoryId: 'cat-shoulder',
 *   description: 'Mejora la movilidad y fortalece el manguito rotador.',
 *   difficulty: 'beginner',
 *   durationMinutes: 10,
 *   targetUserType: 'adult',
 *   steps: [...],
 * };
 * ```
 */
export interface Exercise {
  /** Identificador único del ejercicio. */
  id: string;

  /**
   * Título descriptivo del ejercicio.
   * Debe ser claro y comprensible para personas no especializadas.
   */
  title: string;

  /**
   * URL de la imagen principal del ejercicio.
   * Se muestra en las tarjetas del catálogo y en el encabezado del detalle.
   * Formato recomendado: WebP.
   */
  imageUrl: string;

  /**
   * ID de la categoría a la que pertenece el ejercicio.
   * Referencia a `Category.id`.
   */
  categoryId: string;

  /**
   * URL del video demostrativo del ejercicio.
   * Puede ser una URL de YouTube embed, Vimeo, o un video local en `/assets/`.
   * Si es `undefined`, se mostrará solo la imagen y los pasos textuales.
   */
  videoUrl?: string;

  /**
   * Descripción breve del ejercicio y sus beneficios terapéuticos.
   * Máximo 200 caracteres recomendados.
   */
  description: string;

  /**
   * Nivel de dificultad del ejercicio.
   * @see DifficultyLevel
   */
  difficulty: DifficultyLevel;

  /**
   * Duración estimada del ejercicio completo en minutos.
   * Incluye calentamiento, ejecución y enfriamiento.
   */
  durationMinutes: number;

  /**
   * Tipo de usuario al que está dirigido el ejercicio.
   * - `'adult'` — solo adultos
   * - `'kids'`  — solo niños (adaptado pedagógicamente)
   * - `'all'`   — apto para ambos
   */
  targetUserType: UserType | 'all';

  /**
   * Listado ordenado de pasos detallados del ejercicio.
   * Si está vacío o `undefined`, se mostrará solo la descripción general.
   * @see ExerciseStep
   */
  steps?: ExerciseStep[];

  /**
   * Equipamiento necesario para el ejercicio.
   * Ej: `['Banda elástica', 'Pelota de foam']`.
   * Un array vacío indica que no se necesita material.
   */
  equipment?: string[];

  /**
   * Número de repeticiones recomendadas por sesión.
   * Complementa a `durationMinutes` para ejercicios de fuerza.
   */
  repetitions?: number;

  /**
   * Número de series recomendadas por sesión.
   */
  sets?: number;

  /**
   * Si `true`, el ejercicio requiere supervisión de un fisioterapeuta.
   * Se mostrará una advertencia visible en la UI.
   */
  requiresSupervision?: boolean;
}
