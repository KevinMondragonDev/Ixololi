/**
 * @fileoverview Kids Catalog — Catálogo de ejercicios para niños.
 *
 * Identidad visual: paleta melocotón/naranja pastel, fuente Nunito bold,
 * tarjetas con rounded-3xl, fondo crema. Texto siempre oscuro.
 */

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../core/services/exercise.service';

/**
 * Catálogo para el perfil niño. Filtra ejercicios con `targetUserType === 'kids' | 'all'`.
 */
@Component({
  selector: 'app-kids-catalog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="background-color: #FFFBF8; min-height: 100vh;">

      <!-- Header -->
      <header class="px-6 pt-10 pb-6 max-w-4xl mx-auto">
        <a routerLink="/"
           class="inline-flex items-center gap-2 text-sm font-bold text-orange-500
                  hover:text-orange-700 transition-colors mb-6"
           aria-label="Volver al inicio">
          ← Inicio
        </a>

        <div class="flex items-center gap-4">
          <span class="text-4xl" aria-hidden="true">🧒</span>
          <div>
            <h1 class="text-3xl font-extrabold text-gray-800"
                style="font-family: 'Nunito', sans-serif;">
              ¡Hora de moverse!
            </h1>
            <p class="text-sm font-semibold text-orange-500 mt-1">
              Ejercicios divertidos solo para ti
            </p>
          </div>
        </div>
      </header>

      <main id="main-content" class="px-6 pb-16 max-w-4xl mx-auto">

        @if (exerciseService.loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            @for (i of [1,2]; track i) {
              <div class="bg-orange-50 rounded-3xl h-72 animate-pulse"></div>
            }
          </div>
        }

        @if (exerciseService.error()) {
          <div class="bg-pink-50 border border-pink-200 rounded-2xl p-6 text-center" role="alert">
            <p class="text-pink-800 font-semibold">{{ exerciseService.error() }}</p>
          </div>
        }

        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-5" role="list">
          @for (exercise of kidsExercises(); track exercise.id; let i = $index) {
            <li [class]="'stagger-' + ((i % 4) + 1) + ' animate-fade-in-up'">
              <a [routerLink]="['/ejercicio', exercise.id]"
                 class="flex flex-col bg-orange-50 border-2 border-orange-100 rounded-3xl
                        shadow-sm hover:shadow-lg hover:-translate-y-1
                        transition-all duration-300 overflow-hidden h-full"
                 [attr.aria-label]="'Ver ejercicio: ' + exercise.title">

                <img [src]="exercise.imageUrl"
                     [alt]="exercise.title"
                     class="w-full h-52 object-cover"
                     loading="lazy" />

                <div class="flex flex-col flex-1 p-6 gap-3">
                  <h2 class="text-xl font-extrabold text-gray-800"
                      style="font-family: 'Nunito', sans-serif;">
                    {{ exercise.title }}
                  </h2>
                  <p class="text-sm text-gray-600 font-medium leading-relaxed flex-1">
                    {{ exercise.description }}
                  </p>

                  <span class="w-full py-3 text-center rounded-2xl text-sm font-bold
                               bg-orange-200 text-orange-900 hover:bg-orange-300
                               transition-colors duration-200">
                    ¡Ver ejercicio! →
                  </span>
                </div>
              </a>
            </li>
          } @empty {
            <li class="col-span-full text-center py-16">
              <p class="text-gray-400 font-semibold">¡Pronto habrá ejercicios para ti!</p>
            </li>
          }
        </ul>
      </main>
    </div>
  `,
})
export class KidsCatalogComponent {
  readonly exerciseService = inject(ExerciseService);
  readonly kidsExercises = this.exerciseService.getExercisesByUserType('kids');
}
