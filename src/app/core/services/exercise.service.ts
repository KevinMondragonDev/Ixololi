/**
 * @fileoverview ExerciseService — Servicio principal de datos para IXOLOLI.
 *
 * Expone `categoryTypes`, `zones` y `exercises` como Angular Signals readonly.
 * Provee métodos computados para cada nivel de la jerarquía drill-down:
 *   Nivel 1: `categoryTypes`
 *   Nivel 2: `getZonesForType(typeId)` — solo zonas con ejercicios en ese tipo
 *   Nivel 3: `getExercisesByTypeAndZone(typeId, zoneId)`
 *
 * @module core/services
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, tap } from 'rxjs';

import { Exercise } from '../models/exercise.model';
import { CategoryType } from '../models/category-type.model';
import { Zone } from '../models/zone.model';

/** Estructura del JSON de datos de IXOLOLI. */
interface IxololiData {
  categoryTypes: CategoryType[];
  zones: Zone[];
  exercises: Exercise[];
}

/**
 * Servicio central de ejercicios de fisioterapia IXOLOLI.
 *
 * Singleton en root. Carga el JSON al instanciarse y mantiene
 * todos los datos en Signals reactivos.
 *
 * @example
 * ```typescript
 * private readonly svc = inject(ExerciseService);
 *
 * // Nivel 1
 * protected readonly types = this.svc.categoryTypes;
 *
 * // Nivel 2 — zonas disponibles para un tipo
 * protected readonly zones = this.svc.getZonesForType('ct-fortalecimiento');
 *
 * // Nivel 3 — ejercicios
 * protected readonly exercises = this.svc.getExercisesByTypeAndZone(
 *   'ct-fortalecimiento', 'zone-pelvic'
 * );
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ExerciseService {

  private static readonly DATA_URL = 'assets/data/ixololi-data.json';

  private readonly http = inject(HttpClient);

  // ── Estado interno ────────────────────────────────────────────────────

  private readonly _categoryTypes = signal<CategoryType[]>([]);
  private readonly _zones         = signal<Zone[]>([]);
  private readonly _exercises     = signal<Exercise[]>([]);
  private readonly _loading       = signal<boolean>(false);
  private readonly _error         = signal<string | null>(null);

  // ── API pública — Signals readonly ────────────────────────────────────

  /** Tipos de categoría clínica (Nivel 1 de la jerarquía). */
  readonly categoryTypes = this._categoryTypes.asReadonly();

  /** Zonas corporales disponibles (Nivel 2 de la jerarquía). */
  readonly zones = this._zones.asReadonly();

  /** Todos los ejercicios disponibles. */
  readonly exercises = this._exercises.asReadonly();

  /** `true` mientras se cargan los datos del JSON. */
  readonly loading = this._loading.asReadonly();

  /** Mensaje de error o `null` si no hay error. */
  readonly error = this._error.asReadonly();

  /** Total de ejercicios disponibles. */
  readonly totalExercises = computed(() => this._exercises().length);

  // ── Inicialización ────────────────────────────────────────────────────

  constructor() {
    this.loadData();
  }

  // ── Métodos públicos ──────────────────────────────────────────────────

  /**
   * Carga (o recarga) todos los datos desde el JSON.
   * Se llama automáticamente en el constructor.
   */
  loadData(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<IxololiData>(ExerciseService.DATA_URL).pipe(
      tap((data) => {
        this._categoryTypes.set(data.categoryTypes ?? []);
        this._zones.set(data.zones ?? []);
        this._exercises.set(data.exercises ?? []);
      }),
      catchError((err) => {
        console.error('[ExerciseService] Error cargando datos:', err);
        this._error.set('No se pudieron cargar los ejercicios. Inténtalo de nuevo.');
        return of({ categoryTypes: [], zones: [], exercises: [] } as IxololiData);
      })
    ).subscribe({
      complete: () => this._loading.set(false),
    });
  }

  /**
   * Retorna un Signal computado con las zonas que tienen al menos
   * un ejercicio del tipo de categoría dado.
   *
   * Usado para el Nivel 2 del drill-down: solo muestra zonas relevantes.
   *
   * @param typeId - ID del tipo de categoría. Ej: `'ct-fortalecimiento'`
   * @returns `Signal<Zone[]>` — zonas activas para ese tipo.
   */
  getZonesForType(typeId: string) {
    return computed(() => {
      const exercises = this._exercises();
      return this._zones().filter((zone) =>
        exercises.some(
          (ex) => ex.categoryTypeId === typeId && ex.zoneId === zone.id
        )
      );
    });
  }

  /**
   * Retorna un Signal computado con los ejercicios del tipo y zona dados.
   *
   * Usado para el Nivel 3 del drill-down.
   *
   * @param typeId - ID del tipo. Ej: `'ct-fortalecimiento'`
   * @param zoneId - ID de la zona. Ej: `'zone-pelvic'`
   * @returns `Signal<Exercise[]>`
   */
  getExercisesByTypeAndZone(typeId: string, zoneId: string) {
    return computed(() =>
      this._exercises().filter(
        (ex) => ex.categoryTypeId === typeId && ex.zoneId === zoneId
      )
    );
  }

  /**
   * Retorna un Observable con el ejercicio que coincide con el ID dado.
   * Usado en `ExerciseDetailComponent` via `toSignal + switchMap`.
   *
   * @param id - ID único del ejercicio. Ej: `'ex-001'`
   */
  getExerciseById(id: string): Observable<Exercise | undefined> {
    return this.http.get<IxololiData>(ExerciseService.DATA_URL).pipe(
      map((data) => data.exercises.find((ex) => ex.id === id)),
      catchError((err) => {
        console.error(`[ExerciseService] Error obteniendo ejercicio ${id}:`, err);
        return of(undefined);
      })
    );
  }
}
