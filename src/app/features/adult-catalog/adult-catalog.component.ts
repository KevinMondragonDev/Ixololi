/**
 * @fileoverview Adult Catalog — Catálogo de ejercicios para adultos.
 *
 * Muestra todos los ejercicios disponibles para el perfil adulto,
 * consumidos desde `ExerciseService` via Signals.
 *
 * @todo Implementar UI completa de catálogo con cards y filtros (Fase 2).
 */

import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../core/services/exercise.service';

/**
 * Componente de catálogo de ejercicios para adultos.
 * Consume `ExerciseService` y muestra ejercicios filtrados por tipo `'adult'`.
 */
@Component({
  selector: 'app-adult-catalog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen p-8" style="background-color: #f8fafa;">

      <header class="mb-8">
        <a routerLink="/" class="text-sm font-medium mb-4 inline-block"
           style="color: #2C7A7B;" aria-label="Volver a la pantalla de inicio">
          ← Inicio
        </a>
        <h1 class="text-3xl font-bold" style="color: #1a2e2e;">
          Ejercicios para Adultos
        </h1>
        <p class="mt-2 text-gray-600">
          {{ exerciseService.totalExercises() }} ejercicio(s) disponibles
        </p>
      </header>

      @if (exerciseService.loading()) {
        <p class="text-gray-500" role="status" aria-live="polite">Cargando ejercicios...</p>
      }

      @if (exerciseService.error()) {
        <p class="text-red-600" role="alert">{{ exerciseService.error() }}</p>
      }

      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        @for (exercise of adultExercises(); track exercise.id) {
          <li>
            <a [routerLink]="['/ejercicio', exercise.id]"
               class="block bg-white rounded-2xl shadow-md hover:shadow-lg
                      transition-all duration-300 hover:-translate-y-1 overflow-hidden"
               [attr.aria-label]="'Ver ejercicio: ' + exercise.title">
              <img [src]="exercise.imageUrl"
                   [alt]="exercise.title"
                   class="w-full h-48 object-cover"
                   loading="lazy" />
              <div class="p-5">
                <h2 class="text-lg font-semibold text-gray-800">{{ exercise.title }}</h2>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ exercise.description }}</p>
                <span class="mt-3 inline-block text-xs font-medium px-3 py-1 rounded-full"
                      style="background-color: #e6f4f4; color: #2C7A7B;">
                  {{ exercise.durationMinutes }} min · {{ exercise.difficulty }}
                </span>
              </div>
            </a>
          </li>
        } @empty {
          <li class="col-span-full text-gray-500">No hay ejercicios disponibles.</li>
        }
      </ul>

    </main>
  `,
})
export class AdultCatalogComponent {
  readonly exerciseService = inject(ExerciseService);

  /** Signal computado con ejercicios filtrados para adultos. */
  readonly adultExercises = this.exerciseService.getExercisesByUserType('adult');
}
