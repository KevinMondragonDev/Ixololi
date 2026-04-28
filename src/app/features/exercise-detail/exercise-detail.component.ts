/**
 * @fileoverview ExerciseDetailComponent — Vista de detalle de ejercicio.
 *
 * Diseñada para ser libre de distracciones: un solo ejercicio, centrado,
 * con tipografía grande y pasos visuales claros.
 *
 * Incluye:
 * - Reproductor de video interactivo (poster + iframe de YouTube al hacer Play)
 * - Lista vertical de pasos con indicadores de número en pasteles rotativos
 * - Sección de equipamiento y metadata clínica mínima
 *
 * Patrón Angular 21:
 * `input.required<string>()` → `toObservable` → `switchMap` → `toSignal`
 * `DomSanitizer` para sanear la URL del iframe de YouTube de forma segura.
 *
 * @module features/exercise-detail
 */

import { Component, inject, input, signal, computed } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { switchMap } from 'rxjs';

import { ExerciseService } from '../../core/services/exercise.service';

/**
 * Colores de fondo para los indicadores de número de paso.
 * Se aplican de forma cíclica según el índice del paso.
 */
const STEP_INDICATOR_COLORS = [
  { bg: 'bg-teal-100',   text: 'text-teal-800'   },
  { bg: 'bg-orange-100', text: 'text-orange-800'  },
  { bg: 'bg-yellow-100', text: 'text-yellow-800'  },
  { bg: 'bg-purple-100', text: 'text-purple-800'  },
];

/**
 * Componente de detalle de ejercicio — Vista libre de distracciones.
 *
 * Ruta: `/ejercicio/:id` (hijo de `MainLayoutComponent`).
 * El parámetro `:id` se recibe via `input.required<string>()` gracias
 * a `withComponentInputBinding()` configurado en `app.config.ts`.
 */
@Component({
  selector: 'app-exercise-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="pb-20" style="background-color: #FFFBF8;">

      <!-- ─── Estado de carga ─── -->
      @if (!exercise() && !loadError()) {
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
          <div class="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center
                      animate-pulse">
            <span class="text-3xl" aria-hidden="true">🌿</span>
          </div>
          <p class="text-gray-500 font-semibold text-lg" role="status" aria-live="polite">
            Cargando ejercicio...
          </p>
        </div>
      }

      <!-- ─── Estado de error ─── -->
      @if (loadError()) {
        <div class="max-w-lg mx-auto mt-20 px-5 text-center" role="alert">
          <span class="text-6xl block mb-4" aria-hidden="true">😔</span>
          <h1 class="text-2xl font-extrabold text-gray-800 mb-2"
              style="font-family: 'Nunito', sans-serif;">
            No encontramos este ejercicio
          </h1>
          <p class="text-gray-500 font-medium mb-6">
            Es posible que el enlace sea incorrecto o el ejercicio haya sido removido.
          </p>
          <a routerLink="/adultos/home"
             class="inline-block px-6 py-3 rounded-2xl font-bold text-sm
                    bg-teal-200 text-teal-900 hover:bg-teal-300 transition-colors">
            ← Volver al catálogo
          </a>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════
           VISTA PRINCIPAL DEL EJERCICIO
           ═══════════════════════════════════════════════════════ -->
      @if (exercise()) {
        <article class="max-w-2xl mx-auto px-4 md:px-6 pt-8 animate-scale-in">

          <!-- ── TÍTULO CENTRADO ── -->
          <header class="text-center mb-8">
            <!-- Categoría pill -->
            <span class="inline-block text-xs font-extrabold uppercase tracking-widest
                         text-teal-600 bg-teal-100 px-3 py-1 rounded-full mb-4">
              💪 Ejercicio de Fisioterapia
            </span>

            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight"
                style="font-family: 'Nunito', sans-serif;">
              {{ exercise()!.title }}
            </h1>

            <p class="mt-3 text-gray-500 font-medium leading-relaxed max-w-lg mx-auto">
              {{ exercise()!.description }}
            </p>

            <!-- Chips de metadata (mínimos) -->
            <div class="flex flex-wrap items-center justify-center gap-2 mt-5">
              <span class="px-3 py-1.5 rounded-full text-xs font-bold
                           bg-teal-50 text-teal-700 border border-teal-100">
                ⏱ {{ exercise()!.durationMinutes }} min
              </span>

              <span class="px-3 py-1.5 rounded-full text-xs font-bold
                           bg-gray-100 text-gray-700 border border-gray-200">
                📊 {{ getDifficultyLabel(exercise()!.difficulty) }}
              </span>

              @if (exercise()!.sets && exercise()!.repetitions) {
                <span class="px-3 py-1.5 rounded-full text-xs font-bold
                             bg-yellow-50 text-yellow-800 border border-yellow-100">
                  🔁 {{ exercise()!.repetitions }} rep × {{ exercise()!.sets }} series
                </span>
              }

              @if (exercise()!.requiresSupervision) {
                <span class="px-3 py-1.5 rounded-full text-xs font-bold
                             bg-orange-100 text-orange-800 border border-orange-200"
                      role="note">
                  👨‍⚕️ Requiere supervisión
                </span>
              }
            </div>
          </header>

          <!-- ── REPRODUCTOR DE VIDEO ── -->
          <section class="mb-10" aria-labelledby="video-heading">
            <h2 id="video-heading" class="sr-only">Demostración en video</h2>

            @if (exercise()!.videoUrl) {

              <!-- Contenedor del reproductor -->
              <div class="relative bg-slate-100 rounded-3xl shadow-md overflow-hidden
                          aspect-video w-full">

                @if (!isPlaying()) {
                  <!-- ── Poster con botón Play ── -->
                  <button
                    class="absolute inset-0 w-full h-full group focus-visible:outline-none
                           focus-visible:ring-4 focus-visible:ring-teal-400 focus-visible:ring-inset"
                    (click)="playVideo()"
                    aria-label="Reproducir video de demostración del ejercicio">

                    <!-- Imagen de fondo (poster) -->
                    <img [src]="exercise()!.imageUrl"
                         [alt]="exercise()!.title"
                         class="w-full h-full object-cover" />

                    <!-- Overlay oscuro suave -->
                    <div class="absolute inset-0 bg-gray-900/20
                                group-hover:bg-gray-900/30 transition-colors duration-300">
                    </div>

                    <!-- Botón Play central -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90
                                  flex items-center justify-center shadow-lg
                                  group-hover:scale-110 group-hover:bg-white
                                  transition-all duration-300">
                        <!-- Triángulo de Play usando CSS border trick -->
                        <svg class="w-9 h-9 md:w-11 md:h-11 text-teal-600 translate-x-0.5"
                             viewBox="0 0 24 24" fill="currentColor"
                             aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    <!-- Etiqueta de video -->
                    <div class="absolute bottom-4 left-4">
                      <span class="inline-flex items-center gap-1.5 text-xs font-bold
                                   bg-white/90 text-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                        🎬 Ver demostración
                      </span>
                    </div>
                  </button>

                } @else {
                  <!-- ── Iframe de YouTube (cargado solo al hacer Play) ── -->
                  <iframe
                    [src]="safeVideoUrl()"
                    class="w-full h-full"
                    title="Video de demostración del ejercicio"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media;
                           gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy">
                  </iframe>
                }
              </div>

              <!-- Instrucción de accesibilidad -->
              <p class="text-center text-xs text-gray-400 font-medium mt-2">
                Activa los subtítulos en el video si los necesitas
              </p>

            } @else {
              <!-- Sin video — mostrar imagen grande -->
              <div class="relative bg-slate-100 rounded-3xl shadow-md overflow-hidden
                          aspect-video w-full">
                <img [src]="exercise()!.imageUrl"
                     [alt]="exercise()!.title"
                     class="w-full h-full object-cover" />
                <div class="absolute bottom-4 left-4">
                  <span class="inline-flex items-center gap-1.5 text-xs font-bold
                               bg-white/90 text-gray-800 px-3 py-1.5 rounded-full shadow-sm">
                    🖼️ Imagen de referencia
                  </span>
                </div>
              </div>
            }
          </section>

          <!-- ── PASOS DEL EJERCICIO ── -->
          @if (exercise()!.steps && exercise()!.steps!.length > 0) {
            <section class="mb-10" aria-labelledby="steps-heading">

              <h2 id="steps-heading"
                  class="text-2xl font-extrabold text-gray-800 mb-6"
                  style="font-family: 'Nunito', sans-serif;">
                📋 Instrucciones paso a paso
              </h2>

              <ol class="flex flex-col gap-4" role="list">
                @for (step of exercise()!.steps!; track step.stepNumber; let i = $index) {
                  <li class="bg-white rounded-2xl shadow-sm border border-gray-100
                              p-4 flex items-start gap-4"
                      role="listitem">

                    <!-- Indicador de número — círculo pastel grande -->
                    <div class="flex-shrink-0 w-12 h-12 rounded-full flex items-center
                                justify-center text-xl font-extrabold"
                         [class]="getStepBg(i) + ' ' + getStepText(i)"
                         [attr.aria-label]="'Paso ' + step.stepNumber">
                      {{ step.stepNumber }}
                    </div>

                    <!-- Contenido del paso -->
                    <div class="flex-1 min-w-0">
                      <p class="text-gray-800 text-lg font-semibold leading-relaxed">
                        {{ step.instruction }}
                      </p>

                      <!-- Imagen ilustrativa del paso -->
                      @if (step.imageUrl) {
                        <img [src]="step.imageUrl"
                             [alt]="'Ilustración del paso ' + step.stepNumber"
                             class="mt-3 w-full max-h-48 object-cover rounded-xl"
                             loading="lazy" />
                      }

                      <!-- Duración del paso -->
                      @if (step.durationSeconds) {
                        <div class="mt-3 inline-flex items-center gap-1.5
                                    bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full">
                          <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24"
                               fill="none" stroke="currentColor" stroke-width="2"
                               aria-hidden="true">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span class="text-xs font-extrabold">
                            {{ step.durationSeconds }} segundos
                          </span>
                        </div>
                      }
                    </div>
                  </li>
                }
              </ol>
            </section>
          }

          <!-- ── EQUIPAMIENTO ── -->
          @if (exercise()!.equipment && exercise()!.equipment!.length > 0) {
            <section class="mb-10" aria-labelledby="equipment-heading">
              <h2 id="equipment-heading"
                  class="text-2xl font-extrabold text-gray-800 mb-4"
                  style="font-family: 'Nunito', sans-serif;">
                🎒 Material que necesitas
              </h2>
              <ul class="flex flex-wrap gap-2.5">
                @for (item of exercise()!.equipment!; track item) {
                  <li class="px-4 py-2 text-sm font-bold text-gray-800
                             bg-white border border-gray-200 rounded-2xl shadow-sm">
                    {{ item }}
                  </li>
                }
              </ul>
            </section>
          }

          <!-- ── AVISO DE SUPERVISIÓN ── -->
          @if (exercise()!.requiresSupervision) {
            <aside class="mb-10 p-5 bg-orange-50 border-l-4 border-orange-400
                          rounded-2xl flex items-start gap-4"
                   role="note" aria-label="Aviso de supervisión requerida">
              <span class="text-3xl flex-shrink-0" aria-hidden="true">⚠️</span>
              <div>
                <p class="font-extrabold text-orange-900 text-base"
                   style="font-family: 'Nunito', sans-serif;">
                  Este ejercicio requiere supervisión
                </p>
                <p class="text-orange-800 font-medium text-sm mt-1">
                  Por favor realiza este ejercicio con la guía de tu fisioterapeuta
                  para evitar lesiones y asegurar la técnica correcta.
                </p>
              </div>
            </aside>
          }

          <!-- ── CTA FINAL ── -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <a routerLink="/"
               class="flex-1 py-4 text-center rounded-2xl font-extrabold text-sm
                      bg-teal-200 text-teal-900 hover:bg-teal-300
                      transition-all duration-200 hover:-translate-y-0.5 shadow-sm
                      focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-400">
              ← Volver al catálogo
            </a>
            <a routerLink="/"
               class="flex-1 py-4 text-center rounded-2xl font-extrabold text-sm
                      bg-white text-gray-800 border border-gray-200 hover:bg-gray-50
                      transition-all duration-200 hover:-translate-y-0.5 shadow-sm
                      focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-300">
              🏠 Inicio
            </a>
          </div>

        </article>
      }
    </div>
  `,
})
export class ExerciseDetailComponent {

  /** ID del ejercicio, inyectado desde el parámetro de ruta `:id`. */
  readonly id = input.required<string>();

  private readonly svc       = inject(ExerciseService);
  private readonly sanitizer = inject(DomSanitizer);

  /** Controla si el iframe de YouTube está activo (reemplaza al poster). */
  readonly isPlaying = signal(false);

  /**
   * Signal reactivo del ejercicio.
   * Flujo: `toObservable(id)` → `switchMap(getExerciseById)` → `toSignal`.
   */
  readonly exercise = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => this.svc.getExerciseById(id))
    )
  );

  /**
   * Signal para detectar error de carga (ejercicio no encontrado).
   * Es `true` cuando los datos ya cargaron pero el ejercicio es `undefined`.
   */
  readonly loadError = computed(
    () => !this.svc.loading() && this.exercise() === undefined
  );

  /**
   * URL del video saneada para el iframe.
   * Convierte la URL de YouTube a embed y la marca como segura con `DomSanitizer`.
   * Se recalcula automáticamente cuando cambia el ejercicio.
   *
   * @returns `SafeResourceUrl` — URL segura para `[src]` del iframe.
   */
  readonly safeVideoUrl = computed<SafeResourceUrl>(() => {
    const rawUrl = this.exercise()?.videoUrl ?? '';
    // Añadir autoplay=1 y parámetros de privacidad mejorada
    const embedUrl = rawUrl.includes('?')
      ? `${rawUrl}&autoplay=1&rel=0`
      : `${rawUrl}?autoplay=1&rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  });

  /**
   * Activa la reproducción del video.
   * Reemplaza el poster estático con el iframe de YouTube.
   */
  playVideo(): void {
    this.isPlaying.set(true);
  }

  /**
   * Clase de fondo para el indicador de número de paso (cíclica).
   * @param stepIndex - Índice del paso (0-based).
   */
  getStepBg(stepIndex: number): string {
    return STEP_INDICATOR_COLORS[stepIndex % STEP_INDICATOR_COLORS.length].bg;
  }

  /**
   * Clase de texto para el indicador de número de paso (cíclica).
   * @param stepIndex - Índice del paso (0-based).
   */
  getStepText(stepIndex: number): string {
    return STEP_INDICATOR_COLORS[stepIndex % STEP_INDICATOR_COLORS.length].text;
  }

  /**
   * Etiqueta en español para el nivel de dificultad.
   * @param difficulty - `'beginner' | 'intermediate' | 'advanced'`
   */
  getDifficultyLabel(difficulty: string): string {
    const map: Record<string, string> = {
      beginner:     'Principiante',
      intermediate: 'Intermedio',
      advanced:     'Avanzado',
    };
    return map[difficulty] ?? difficulty;
  }
}
