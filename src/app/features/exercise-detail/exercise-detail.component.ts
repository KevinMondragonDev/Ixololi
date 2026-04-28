/**
 * @fileoverview Exercise Detail — Vista de detalle de un ejercicio de fisioterapia.
 *
 * Identidad visual: fondo crema, tarjeta blanca con rounded-2xl, fuente Nunito,
 * badges pastel (menta/amarillo/naranja), texto gris carbón siempre.
 * Pasos presentados con numeración teal y fondo suave.
 *
 * Patrón reactivo Angular 21:
 * - `input.required<string>()` recibe `:id` del router via `withComponentInputBinding`.
 * - `toObservable(this.id).pipe(switchMap(...))` → `toSignal()` para reactividad completa.
 */

import { Component, inject, input } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ExerciseService } from '../../core/services/exercise.service';

/** Mapa de dificultad → clases de badge pastel */
const DIFFICULTY_STYLES: Record<string, string> = {
  beginner:     'bg-teal-100 text-teal-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced:     'bg-pink-100 text-pink-800',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner:     'Principiante',
  intermediate: 'Intermedio',
  advanced:     'Avanzado',
};

/**
 * Componente de detalle de ejercicio.
 * Usa `input.required<string>()` + `toObservable` + `switchMap` + `toSignal`.
 */
@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="background-color: #FFFBF8; min-height: 100vh;">
      <div class="max-w-2xl mx-auto px-5 py-10">

        <a routerLink="/"
           class="inline-flex items-center gap-2 text-sm font-bold text-teal-600
                  hover:text-teal-800 transition-colors mb-8"
           aria-label="Volver al inicio">
          ← Volver
        </a>

        @if (exercise()) {
          <article class="bg-white rounded-3xl shadow-md overflow-hidden animate-scale-in">

            <!-- Imagen principal -->
            <div class="relative overflow-hidden">
              <img [src]="exercise()!.imageUrl"
                   [alt]="'Imagen del ejercicio: ' + exercise()!.title"
                   class="w-full h-60 md:h-72 object-cover" />

              <!-- Badge de dificultad sobre imagen -->
              <span class="absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full"
                    [class]="getDifficultyStyle(exercise()!.difficulty)">
                {{ getDifficultyLabel(exercise()!.difficulty) }}
              </span>
            </div>

            <div class="p-7 md:p-9 flex flex-col gap-7">

              <!-- Encabezado -->
              <header>
                <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800 leading-snug"
                    style="font-family: 'Nunito', sans-serif;">
                  {{ exercise()!.title }}
                </h1>
                <p class="mt-3 text-gray-600 font-medium leading-relaxed">
                  {{ exercise()!.description }}
                </p>
              </header>

              <!-- Metadatos en chips -->
              <div class="flex flex-wrap gap-2"
                   role="list"
                   aria-label="Características del ejercicio">

                <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700"
                      role="listitem">
                  ⏱ {{ exercise()!.durationMinutes }} min
                </span>

                @if (exercise()!.repetitions) {
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-50 text-yellow-800"
                        role="listitem">
                    🔁 {{ exercise()!.repetitions }} rep × {{ exercise()!.sets }} series
                  </span>
                }

                @if (exercise()!.requiresSupervision) {
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800"
                        role="alert">
                    ⚠️ Requiere supervisión profesional
                  </span>
                }
              </div>

              <!-- Pasos del ejercicio -->
              @if (exercise()!.steps && exercise()!.steps!.length > 0) {
                <section aria-labelledby="steps-heading">
                  <h2 id="steps-heading"
                      class="text-lg font-extrabold text-gray-800 mb-4"
                      style="font-family: 'Nunito', sans-serif;">
                    📋 Pasos del ejercicio
                  </h2>
                  <ol class="flex flex-col gap-4">
                    @for (step of exercise()!.steps!; track step.stepNumber) {
                      <li class="flex gap-4 p-5 bg-teal-50 border border-teal-100 rounded-2xl">
                        <span class="flex-shrink-0 w-9 h-9 rounded-full flex items-center
                                     justify-center font-extrabold text-sm
                                     bg-teal-200 text-teal-900"
                              [attr.aria-label]="'Paso ' + step.stepNumber">
                          {{ step.stepNumber }}
                        </span>
                        <div class="flex-1">
                          <p class="text-gray-700 font-medium leading-relaxed">
                            {{ step.instruction }}
                          </p>
                          @if (step.durationSeconds) {
                            <span class="mt-2 inline-block text-xs font-bold text-teal-600">
                              ⏱ {{ step.durationSeconds }} segundos
                            </span>
                          }
                        </div>
                      </li>
                    }
                  </ol>
                </section>
              }

              <!-- Equipamiento -->
              @if (exercise()!.equipment && exercise()!.equipment!.length > 0) {
                <section aria-labelledby="equipment-heading">
                  <h2 id="equipment-heading"
                      class="text-lg font-extrabold text-gray-800 mb-3"
                      style="font-family: 'Nunito', sans-serif;">
                    🎒 Material necesario
                  </h2>
                  <ul class="flex flex-wrap gap-2">
                    @for (item of exercise()!.equipment!; track item) {
                      <li class="px-3 py-1.5 text-sm font-semibold
                                 bg-orange-50 text-orange-800 rounded-2xl border border-orange-100">
                        {{ item }}
                      </li>
                    }
                  </ul>
                </section>
              }

              <!-- Volver CTA -->
              <a routerLink="/"
                 class="w-full py-3.5 text-center rounded-2xl font-bold text-sm
                        bg-teal-200 text-teal-900 hover:bg-teal-300
                        transition-colors duration-200 mt-2">
                ← Volver al inicio
              </a>

            </div>
          </article>

        } @else {
          <div class="flex flex-col items-center justify-center py-24 gap-4">
            <span class="text-5xl animate-bounce" aria-hidden="true">🌀</span>
            <p class="text-gray-500 font-semibold" role="status" aria-live="polite">
              Cargando ejercicio...
            </p>
          </div>
        }

      </div>
    </div>
  `,
})
export class ExerciseDetailComponent {
  /** ID del ejercicio inyectado desde el parámetro de ruta `:id`. */
  readonly id = input.required<string>();

  private readonly exerciseService = inject(ExerciseService);

  /**
   * Signal reactivo del ejercicio actual.
   * `toObservable(this.id)` → `switchMap(getExerciseById)` → `toSignal`
   */
  readonly exercise = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.exerciseService.getExerciseById(id))
    )
  );

  getDifficultyStyle(difficulty: string): string {
    return DIFFICULTY_STYLES[difficulty] ?? 'bg-gray-100 text-gray-700';
  }

  getDifficultyLabel(difficulty: string): string {
    return DIFFICULTY_LABELS[difficulty] ?? difficulty;
  }
}
