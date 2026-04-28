/**
 * @fileoverview KidsCatalogComponent — Navegación Drill-Down de 3 niveles.
 *
 * El usuario navega progresivamente:
 *   Nivel 1 → Tipo de ejercicio (Fortalecimiento / Estiramientos)
 *   Nivel 2 → Zona corporal (Miembros Torácicos / Miembros Pélvicos)
 *   Nivel 3 → Lista de ejercicios → tap → /ejercicio/:id
 *
 * Estado manejado con Angular Signals. Sin cambio de ruta entre niveles.
 * Breadcrumbs actualizados en cada transición. Botón "Volver" siempre visible.
 *
 * @module features/kids-catalog
 */

import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ExerciseService } from '../../core/services/exercise.service';
import { CategoryType } from '../../core/models/category-type.model';
import { Zone } from '../../core/models/zone.model';

/** Crumb de navegación para el breadcrumb trail. */
interface Breadcrumb {
  label: string;
  level: number;
}

/** Paleta visual asignada a cada tipo de categoría. */
interface TypePalette {
  heroBg: string;
  cardBg: string;
  cardBorder: string;
  btnBg: string;
  btnText: string;
  badgeBg: string;
  badgeText: string;
}

/** Paleta visual asignada a cada zona corporal. */
interface ZonePalette {
  cardBg: string;
  cardBorder: string;
  btnBg: string;
  btnText: string;
  iconBg: string;
}

const TYPE_PALETTES: Record<string, TypePalette> = {
  'ct-fortalecimiento': {
    heroBg:     'bg-teal-100',
    cardBg:     'bg-teal-50',
    cardBorder: 'border-teal-200',
    btnBg:      'bg-teal-300',
    btnText:    'text-teal-900',
    badgeBg:    'bg-teal-200',
    badgeText:  'text-teal-800',
  },
  'ct-estiramientos': {
    heroBg:     'bg-orange-100',
    cardBg:     'bg-orange-50',
    cardBorder: 'border-orange-200',
    btnBg:      'bg-orange-300',
    btnText:    'text-orange-900',
    badgeBg:    'bg-orange-200',
    badgeText:  'text-orange-800',
  },
};

const ZONE_PALETTES: Record<string, ZonePalette> = {
  'zone-thoracic': {
    cardBg:     'bg-blue-50',
    cardBorder: 'border-blue-200',
    btnBg:      'bg-blue-200',
    btnText:    'text-blue-900',
    iconBg:     'bg-blue-100',
  },
  'zone-pelvic': {
    cardBg:     'bg-purple-50',
    cardBorder: 'border-purple-200',
    btnBg:      'bg-purple-200',
    btnText:    'text-purple-900',
    iconBg:     'bg-purple-100',
  },
};

const DEFAULT_TYPE_PALETTE: TypePalette = {
  heroBg: 'bg-gray-100', cardBg: 'bg-gray-50', cardBorder: 'border-gray-200',
  btnBg: 'bg-gray-200', btnText: 'text-gray-900', badgeBg: 'bg-gray-200', badgeText: 'text-gray-800',
};

const DEFAULT_ZONE_PALETTE: ZonePalette = {
  cardBg: 'bg-gray-50', cardBorder: 'border-gray-200', btnBg: 'bg-gray-200',
  btnText: 'text-gray-900', iconBg: 'bg-gray-100',
};

const CTA_PHRASES = ['¡Jugar!', '¡A la misión!', '¡Vamos!', '¡Empezar!'];

/**
 * Catálogo de niños con navegación Drill-Down.
 * Ruta: `/ninos/mapa` (hijo de `MainLayoutComponent`).
 */
@Component({
  selector: 'app-kids-catalog',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="pb-20" style="background-color: #FFFBF8;">

      <!-- ═══════════════════════════════════════════════════════
           HERO UNIFICADO
           ═══════════════════════════════════════════════════════ -->
      <section class="mx-4 mt-6 md:mx-8 lg:mx-12 rounded-3xl overflow-hidden shadow-sm"
               aria-labelledby="kids-hero-heading">

        <!-- Franja naranja: identidad -->
        <div class="bg-orange-100 px-7 pt-7 pb-5 md:px-10 relative overflow-hidden">
          <div class="absolute -top-5 -right-5 w-32 h-32 rounded-full
                      bg-orange-200/40 pointer-events-none" aria-hidden="true"></div>

          <div class="flex items-center justify-between gap-4">
            <div class="flex-1 animate-fade-in-up">
              <span class="inline-flex items-center gap-1 text-xs font-extrabold uppercase
                           tracking-widest text-orange-700 bg-orange-200 px-3 py-1 rounded-full mb-2">
                🗺️ Mapa de Misiones
              </span>
              <h1 id="kids-hero-heading"
                  class="text-2xl md:text-3xl font-extrabold text-orange-900 leading-tight"
                  style="font-family: 'Nunito', sans-serif;">
                ¡Tu Misión de Hoy!
              </h1>
              <p class="text-orange-800 font-semibold text-sm mt-1 max-w-xs">
                Tu fisio preparó estas misiones especiales para ti. 💪
              </p>
            </div>
            <div class="flex-shrink-0 relative animate-fade-in-up stagger-2 group cursor-pointer" aria-hidden="true">
              <div class="relative h-28 w-24 animate-bounce" style="animation-duration: 3s;">
                <!-- Parada (Default) -->
                <img src="assets/images/MascotaParada.png" alt="Mascota" 
                     class="absolute inset-0 h-full w-full object-contain drop-shadow-lg transition-transform duration-300 opacity-100 group-hover:opacity-0 group-hover:scale-110" />
                <!-- Brincando (Hover) -->
                <img src="assets/images/MascotaBrincando.png" alt="Mascota Brincando" 
                     class="absolute inset-0 h-full w-full object-contain drop-shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </div>

        <!-- Franja blanca: about + stats -->
        <div class="bg-white px-7 py-5 md:px-10">
          <p class="text-gray-600 font-medium leading-relaxed text-sm">
            <strong class="text-gray-800">IXOLOLI</strong> es una propuesta de
            <strong class="text-teal-700">fisioterapia accesible</strong> para crear ejercicios
            personalizados y dar seguimiento cercano a los pacientes. 💚
          </p>
          <div class="flex flex-wrap gap-2 mt-3">
            <span class="inline-flex items-center gap-1 text-xs font-bold
                         bg-teal-50 text-teal-800 px-3 py-1.5 rounded-full border border-teal-100">
              💻 Software for Everyone · Kevin Mondragón
            </span>
            <span class="inline-flex items-center gap-1 text-xs font-bold
                         bg-orange-50 text-orange-800 px-3 py-1.5 rounded-full border border-orange-100">
              🌸 IXOLOLI · Ix Ololiuhqui Salinas
            </span>
          </div>
          <div class="border-t border-gray-100 mt-4 mb-3"></div>
          <div class="flex gap-4">
            <div class="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2">
              <span class="text-base" aria-hidden="true">💪</span>
              <div>
                <p class="text-xs font-bold text-gray-400 uppercase leading-none">Tipos</p>
                <p class="text-lg font-extrabold text-gray-800 leading-tight">
                  {{ svc.categoryTypes().length }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-2">
              <span class="text-base" aria-hidden="true">⭐</span>
              <div>
                <p class="text-xs font-bold text-gray-400 uppercase leading-none">Ejercicios</p>
                <p class="text-lg font-extrabold text-gray-800 leading-tight">
                  {{ svc.totalExercises() }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════════
           BARRA DE NAVEGACIÓN — Volver / Inicio
           ═══════════════════════════════════════════════════════ -->
      @if (currentLevel() > 1) {
        <nav class="mx-4 mt-4 md:mx-8 lg:mx-12"
             aria-label="Navegación de regreso">

          <!-- Fila de botones + ruta -->
          <div class="flex items-center gap-3">

            <!-- Botón Volver — siempre visible, grande y táctil -->
            <button (click)="goBack()"
                    class="flex items-center gap-2 px-5 py-3 rounded-2xl
                           bg-white border-2 border-gray-200 shadow-sm
                           text-sm font-extrabold text-gray-800
                           hover:bg-gray-50 hover:border-gray-300
                           active:scale-95 transition-all duration-150
                           focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-gray-400"
                    aria-label="Volver al nivel anterior">
              ← Volver
            </button>

            <!-- Botón Inicio — solo si estamos en nivel 3 -->
            @if (currentLevel() === 3) {
              <button (click)="goToLevel(0)"
                      class="flex items-center gap-2 px-5 py-3 rounded-2xl
                             bg-orange-100 border-2 border-orange-200 shadow-sm
                             text-sm font-extrabold text-orange-900
                             hover:bg-orange-200 active:scale-95
                             transition-all duration-150
                             focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-orange-400"
                      aria-label="Ir al inicio">
                🏠 Inicio
              </button>
            }

            <!-- Ruta de contexto (solo texto, sin clic) -->
            <p class="text-xs text-gray-400 font-semibold truncate hidden sm:block">
              @for (crumb of breadcrumbs(); track crumb.level; let last = $last) {
                @if (!last) { {{ crumb.label }} › }
                @else { <strong class="text-gray-600">{{ crumb.label }}</strong> }
              }
            </p>

          </div>
        </nav>
      }

      <!-- ═══════════════════════════════════════════════════════
           ESTADO DE CARGA / ERROR
           ═══════════════════════════════════════════════════════ -->
      @if (svc.loading()) {
        <div class="mx-4 mt-6 md:mx-8 lg:mx-12 grid grid-cols-2 gap-4"
             role="status" aria-label="Cargando">
          @for (i of [1,2]; track i) {
            <div class="h-40 rounded-3xl bg-orange-50 animate-pulse"></div>
          }
        </div>
      }

      @if (svc.error()) {
        <div class="mx-4 mt-6 md:mx-8 lg:mx-12 bg-pink-50 border border-pink-200
                    rounded-3xl p-8 text-center" role="alert">
          <span class="text-5xl block mb-3" aria-hidden="true">😢</span>
          <p class="text-pink-800 font-extrabold mb-4">{{ svc.error() }}</p>
          <button (click)="svc.loadData()"
                  class="px-5 py-2.5 rounded-2xl font-bold bg-orange-200
                         text-orange-900 hover:bg-orange-300 transition-colors">
            🔄 Reintentar
          </button>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════
           NIVEL 1 — TIPOS DE EJERCICIO
           ═══════════════════════════════════════════════════════ -->
      @if (!svc.loading() && !svc.error() && currentLevel() === 1) {
        <div class="mx-4 mt-6 md:mx-8 lg:mx-12 animate-fade-in-up">

          <h2 class="text-xl font-extrabold text-gray-800 mb-4"
              style="font-family: 'Nunito', sans-serif;">
            ¿Qué tipo de ejercicio vas a hacer?
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (type of svc.categoryTypes(); track type.id) {
              <button (click)="selectType(type)"
                      class="flex flex-col items-start p-6 rounded-3xl border-2
                             text-left hover:-translate-y-1 hover:shadow-lg
                             transition-all duration-300 shadow-sm
                             focus-visible:outline-none focus-visible:ring-3
                             focus-visible:ring-teal-400"
                      [class]="getTypePalette(type.id).cardBg + ' ' + getTypePalette(type.id).cardBorder"
                      [attr.aria-label]="'Seleccionar: ' + type.name">

                <span class="text-5xl mb-4" aria-hidden="true">{{ type.emoji }}</span>

                <h3 class="text-xl font-extrabold text-gray-800 mb-1"
                    style="font-family: 'Nunito', sans-serif;">
                  {{ type.name }}
                </h3>
                <p class="text-sm font-medium text-gray-600 mb-5 leading-relaxed">
                  {{ type.description }}
                </p>

                <span class="w-full py-2.5 text-center rounded-2xl text-sm font-extrabold
                             transition-colors duration-200"
                      [class]="getTypePalette(type.id).btnBg + ' ' + getTypePalette(type.id).btnText">
                  Seleccionar →
                </span>
              </button>
            }
          </div>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════
           NIVEL 2 — ZONAS CORPORALES
           ═══════════════════════════════════════════════════════ -->
      @if (!svc.loading() && !svc.error() && currentLevel() === 2 && selectedType()) {
        <div class="mx-4 mt-6 md:mx-8 lg:mx-12 animate-fade-in-up">

          <h2 class="text-xl font-extrabold text-gray-800 mb-1"
              style="font-family: 'Nunito', sans-serif;">
            {{ selectedType()!.emoji }} {{ selectedType()!.name }}
          </h2>
          <p class="text-sm text-gray-500 font-medium mb-5">
            ¿Cuál parte del cuerpo vas a trabajar?
          </p>

          <div class="flex flex-col gap-4">
            @for (zone of availableZones(); track zone.id) {
              <button (click)="selectZone(zone)"
                      class="flex items-center gap-5 p-5 rounded-3xl border-2
                             text-left hover:-translate-y-0.5 hover:shadow-lg
                             transition-all duration-300 shadow-sm w-full
                             focus-visible:outline-none focus-visible:ring-3
                             focus-visible:ring-teal-400"
                      [class]="getZonePalette(zone.id).cardBg + ' ' + getZonePalette(zone.id).cardBorder"
                      [attr.aria-label]="'Seleccionar zona: ' + zone.name">

                <!-- Ícono de zona -->
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center
                            text-3xl flex-shrink-0 shadow-sm"
                     [class]="getZonePalette(zone.id).iconBg"
                     aria-hidden="true">
                  {{ zone.emoji }}
                </div>

                <!-- Texto -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-extrabold text-gray-800"
                      style="font-family: 'Nunito', sans-serif;">
                    {{ zone.name }}
                  </h3>
                  <p class="text-xs font-medium text-gray-500 mt-0.5">
                    {{ zone.description }}
                  </p>
                  <!-- Conteo de ejercicios disponibles -->
                  <span class="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full"
                        [class]="getTypePalette(selectedType()!.id).badgeBg + ' ' + getTypePalette(selectedType()!.id).badgeText">
                    {{ countExercises(selectedType()!.id, zone.id) }} ejercicios
                  </span>
                </div>

                <span class="text-2xl text-gray-400 flex-shrink-0" aria-hidden="true">›</span>
              </button>
            }
          </div>
        </div>
      }

      <!-- ═══════════════════════════════════════════════════════
           NIVEL 3 — EJERCICIOS
           ═══════════════════════════════════════════════════════ -->
      @if (!svc.loading() && !svc.error() && currentLevel() === 3 && selectedType() && selectedZone()) {
        <div class="mx-4 mt-6 md:mx-8 lg:mx-12 animate-fade-in-up">

          <h2 class="text-xl font-extrabold text-gray-800 mb-1"
              style="font-family: 'Nunito', sans-serif;">
            {{ selectedZone()!.emoji }} {{ selectedZone()!.name }}
          </h2>
          <p class="text-sm text-gray-500 font-medium mb-5">
            {{ selectedType()!.name }} · ¡Elige tu misión!
          </p>

          @if (currentExercises().length > 0) {
            <div class="grid grid-cols-2 gap-4">
              @for (exercise of currentExercises(); track exercise.id; let i = $index) {
                <article class="flex flex-col rounded-3xl border-2 overflow-hidden
                                hover:-translate-y-1 hover:shadow-lg
                                transition-all duration-300 shadow-sm group"
                         [class]="getTypePalette(selectedType()!.id).cardBg + ' ' +
                                  getTypePalette(selectedType()!.id).cardBorder">
                  <a [routerLink]="['/ejercicio', exercise.id]"
                     class="flex flex-col h-full focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset"
                     [attr.aria-label]="'Iniciar: ' + exercise.title">

                    <div class="relative overflow-hidden">
                      <img [src]="exercise.imageUrl"
                           [alt]="exercise.title"
                           class="w-full h-32 object-cover
                                  group-hover:scale-105 transition-transform duration-500"
                           loading="lazy" />
                      @if (exercise.requiresSupervision) {
                        <span class="absolute top-2 right-2 text-xs bg-white/90
                                     text-yellow-800 font-bold px-2 py-0.5 rounded-full shadow-sm">
                          👨‍⚕️
                        </span>
                      }
                    </div>

                    <div class="flex flex-col flex-1 p-3 gap-2">
                      <h3 class="text-xs font-extrabold text-gray-800 leading-snug line-clamp-2"
                          style="font-family: 'Nunito', sans-serif;">
                        {{ exercise.title }}
                      </h3>
                      <span class="mt-auto w-full py-2 text-center rounded-2xl
                                   text-xs font-extrabold transition-colors duration-200"
                            [class]="getTypePalette(selectedType()!.id).btnBg + ' ' +
                                     getTypePalette(selectedType()!.id).btnText">
                        {{ getCtaPhrase(i) }}
                      </span>
                    </div>
                  </a>
                </article>
              }
            </div>
          } @else {
            <div class="flex flex-col items-center py-16 gap-3 text-center
                        bg-gray-50 rounded-3xl border border-gray-100">
              <span class="text-5xl" aria-hidden="true">🌱</span>
              <p class="text-gray-500 font-semibold">
                Tu fisio aún no asignó ejercicios aquí.
              </p>
            </div>
          }
        </div>
      }



    </div>
  `,
})
export class KidsCatalogComponent {

  readonly svc = inject(ExerciseService);

  // ── Estado de navegación ─────────────────────────────────────────────

  /** Tipo de categoría seleccionado (Nivel 1). `null` = en Nivel 1. */
  readonly selectedType = signal<CategoryType | null>(null);

  /** Zona corporal seleccionada (Nivel 2). `null` = en Nivel 2. */
  readonly selectedZone = signal<Zone | null>(null);

  /** Nivel actual de la navegación (1, 2 o 3). */
  readonly currentLevel = computed<number>(() => {
    if (!this.selectedType()) return 1;
    if (!this.selectedZone()) return 2;
    return 3;
  });

  /** Breadcrumbs actualizados en cada transición. */
  readonly breadcrumbs = computed<Breadcrumb[]>(() => {
    const crumbs: Breadcrumb[] = [{ label: '🏠 Inicio', level: 0 }];
    if (this.selectedType())
      crumbs.push({ label: this.selectedType()!.name, level: 1 });
    if (this.selectedZone())
      crumbs.push({ label: this.selectedZone()!.name, level: 2 });
    return crumbs;
  });

  /** Zonas disponibles para el tipo seleccionado. */
  readonly availableZones = computed<Zone[]>(() => {
    const type = this.selectedType();
    if (!type) return [];
    return this.svc.zones().filter((zone) =>
      this.svc.exercises().some(
        (ex) => ex.categoryTypeId === type.id && ex.zoneId === zone.id
      )
    );
  });

  /** Ejercicios del tipo + zona seleccionados. */
  readonly currentExercises = computed(() => {
    const type = this.selectedType();
    const zone = this.selectedZone();
    if (!type || !zone) return [];
    return this.svc.exercises().filter(
      (ex) => ex.categoryTypeId === type.id && ex.zoneId === zone.id
    );
  });

  // ── Navegación ───────────────────────────────────────────────────────

  selectType(type: CategoryType): void {
    this.selectedType.set(type);
    this.selectedZone.set(null);
  }

  selectZone(zone: Zone): void {
    this.selectedZone.set(zone);
  }

  goBack(): void {
    if (this.selectedZone()) {
      this.selectedZone.set(null);
    } else {
      this.selectedType.set(null);
    }
  }

  goToLevel(level: number): void {
    if (level === 0) {
      this.selectedType.set(null);
      this.selectedZone.set(null);
    } else if (level === 1) {
      this.selectedZone.set(null);
    }
  }

  // ── Helpers de estilo ────────────────────────────────────────────────

  getTypePalette(typeId: string): TypePalette {
    return TYPE_PALETTES[typeId] ?? DEFAULT_TYPE_PALETTE;
  }

  getZonePalette(zoneId: string): ZonePalette {
    return ZONE_PALETTES[zoneId] ?? DEFAULT_ZONE_PALETTE;
  }

  countExercises(typeId: string, zoneId: string): number {
    return this.svc.exercises().filter(
      (ex) => ex.categoryTypeId === typeId && ex.zoneId === zoneId
    ).length;
  }

  getCtaPhrase(index: number): string {
    return CTA_PHRASES[index % CTA_PHRASES.length];
  }
}
