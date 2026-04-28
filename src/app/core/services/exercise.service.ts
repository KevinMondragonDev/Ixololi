/**
 * @fileoverview Servicio principal de ejercicios para la plataforma IXOLOLI.
 *
 * Carga los datos de ejercicios y categorías desde un JSON local usando
 * `HttpClient`, y los expone como Angular Signals para que los componentes
 * puedan consumirlos de forma reactiva y eficiente.
 *
 * @module core/services
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, map, catchError, of, tap } from 'rxjs';

import { Exercise } from '../models/exercise.model';
import { Category } from '../models/category.model';

/**
 * Estructura del JSON de datos mockeados de IXOLOLI.
 * Corresponde al shape del archivo `assets/data/ixololi-data.json`.
 */
interface IxololiData {
  /** Lista de todas las categorías de ejercicios. */
  categories: Category[];
  /** Lista de todos los ejercicios disponibles en la plataforma. */
  exercises: Exercise[];
}

/**
 * Servicio de ejercicios de fisioterapia.
 *
 * Responsabilidades:
 * - Cargar datos desde `assets/data/ixololi-data.json`
 * - Exponer `Signal<Exercise[]>` y `Signal<Category[]>` para la UI
 * - Proveer Signals computados para filtrado por categoría y tipo de usuario
 * - Exponer Observables para casos de uso puntuales (ej: detalle de ejercicio)
 *
 * @example
 * ```typescript
 * // En un componente:
 * private readonly exerciseService = inject(ExerciseService);
 *
 * // Consumir todos los ejercicios reactivamente:
 * protected readonly exercises = this.exerciseService.exercises;
 *
 * // Filtrar por categoría:
 * protected readonly shoulderExercises = this.exerciseService.getExercisesByCategory('cat-shoulder');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  /** URL relativa al JSON de datos. Servido desde `public/assets/` via Angular build. */
  private static readonly DATA_URL = 'assets/data/ixololi-data.json';

  private readonly http = inject(HttpClient);

  // =========================================================
  // ESTADO INTERNO — Signals privados
  // =========================================================

  /**
   * Signal interno que almacena todas las categorías cargadas desde el JSON.
   * No se expone directamente; se usa `categories` (readonly) hacia afuera.
   */
  private readonly _categories = signal<Category[]>([]);

  /**
   * Signal interno que almacena todos los ejercicios cargados desde el JSON.
   */
  private readonly _exercises = signal<Exercise[]>([]);

  /**
   * Signal que indica si los datos están siendo cargados.
   */
  private readonly _loading = signal<boolean>(false);

  /**
   * Signal que almacena el mensaje de error si la carga falla.
   * `null` si no hay error.
   */
  private readonly _error = signal<string | null>(null);

  // =========================================================
  // API PÚBLICA — Signals de solo lectura
  // =========================================================

  /**
   * Signal de solo lectura con todas las categorías disponibles.
   * Reactivo: los componentes que lo consumen se actualizan automáticamente.
   */
  readonly categories = this._categories.asReadonly();

  /**
   * Signal de solo lectura con todos los ejercicios disponibles.
   * Reactivo: los componentes que lo consumen se actualizan automáticamente.
   */
  readonly exercises = this._exercises.asReadonly();

  /**
   * Signal de solo lectura que indica si hay una carga en progreso.
   * Útil para mostrar skeletons o spinners en la UI.
   */
  readonly loading = this._loading.asReadonly();

  /**
   * Signal de solo lectura con el error actual, o `null` si no hay error.
   * Útil para mostrar mensajes de error accesibles en la UI.
   */
  readonly error = this._error.asReadonly();

  /**
   * Signal computado con el total de ejercicios disponibles.
   * Se recalcula automáticamente cuando cambian `_exercises`.
   */
  readonly totalExercises = computed(() => this._exercises().length);

  /**
   * Signal computado con el total de categorías disponibles.
   */
  readonly totalCategories = computed(() => this._categories().length);

  // =========================================================
  // INICIALIZACIÓN
  // =========================================================

  constructor() {
    // Carga automática al instanciar el servicio (singleton en root).
    this.loadData();
  }

  // =========================================================
  // MÉTODOS PÚBLICOS
  // =========================================================

  /**
   * Carga todos los datos del JSON de IXOLOLI y actualiza los Signals internos.
   *
   * Este método se llama automáticamente en el constructor, pero puede
   * invocarse manualmente para recargar datos (ej: pull-to-refresh).
   *
   * @returns `void`
   *
   * @example
   * ```typescript
   * // Forzar recarga de datos:
   * this.exerciseService.loadData();
   * ```
   */
  loadData(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<IxololiData>(ExerciseService.DATA_URL).pipe(
      tap((data) => {
        this._categories.set(data.categories ?? []);
        this._exercises.set(data.exercises ?? []);
      }),
      catchError((err) => {
        console.error('[ExerciseService] Error cargando datos:', err);
        this._error.set(
          'No se pudieron cargar los ejercicios. Por favor, inténtalo de nuevo.'
        );
        return of({ categories: [], exercises: [] } as IxololiData);
      })
    ).subscribe({
      complete: () => this._loading.set(false),
    });
  }

  /**
   * Retorna un Signal computado con los ejercicios filtrados por categoría.
   *
   * @param categoryId - El ID de la categoría a filtrar. Ej: `'cat-shoulder'`.
   * @returns `Signal<Exercise[]>` — Signal computado con los ejercicios de esa categoría.
   *
   * @example
   * ```typescript
   * // En un componente:
   * protected readonly shoulderExercises =
   *   this.exerciseService.getExercisesByCategory('cat-shoulder');
   *
   * // En el template:
   * @for (ex of shoulderExercises(); track ex.id) { ... }
   * ```
   */
  getExercisesByCategory(categoryId: string) {
    return computed(() =>
      this._exercises().filter((ex) => ex.categoryId === categoryId)
    );
  }

  /**
   * Retorna un Signal computado con los ejercicios filtrados por tipo de usuario.
   *
   * @param userType - `'adult'` | `'kids'`
   * @returns `Signal<Exercise[]>` — ejercicios para ese tipo de usuario (incluye `'all'`).
   *
   * @example
   * ```typescript
   * protected readonly kidsExercises =
   *   this.exerciseService.getExercisesByUserType('kids');
   * ```
   */
  getExercisesByUserType(userType: 'adult' | 'kids') {
    return computed(() =>
      this._exercises().filter(
        (ex) => ex.targetUserType === userType || ex.targetUserType === 'all'
      )
    );
  }

  /**
   * Retorna un Observable con el ejercicio que coincide con el ID dado.
   *
   * Útil para la página de detalle de un ejercicio, donde se navega
   * con el ID en la URL y se necesita un Observable para `AsyncPipe` o `toSignal`.
   *
   * @param id - El ID único del ejercicio. Ej: `'ex-001'`.
   * @returns `Observable<Exercise | undefined>` — emite el ejercicio encontrado, o `undefined`.
   *
   * @example
   * ```typescript
   * // En el componente de detalle:
   * const exerciseId = this.route.snapshot.paramMap.get('id') ?? '';
   * protected readonly exercise = toSignal(
   *   this.exerciseService.getExerciseById(exerciseId)
   * );
   * ```
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

  /**
   * Retorna un Observable con la categoría que coincide con el slug dado.
   *
   * @param slug - Slug URL-friendly de la categoría. Ej: `'hombro'`.
   * @returns `Observable<Category | undefined>`
   *
   * @example
   * ```typescript
   * this.exerciseService.getCategoryBySlug('rodilla').subscribe((cat) => {
   *   if (cat) console.log(cat.name); // 'Rodilla'
   * });
   * ```
   */
  getCategoryBySlug(slug: string): Observable<Category | undefined> {
    return this.http.get<IxololiData>(ExerciseService.DATA_URL).pipe(
      map((data) => data.categories.find((cat) => cat.slug === slug)),
      catchError(() => of(undefined))
    );
  }
}
