/**
 * @fileoverview Configuración de renderizado SSR por ruta para IXOLOLI.
 *
 * Define el modo de renderizado de cada ruta en el servidor:
 * - Rutas estáticas (`/`, `/adultos`, `/ninos`) → Prerender (HTML estático, máximo SEO)
 * - Ruta dinámica (`/ejercicio/:id`) → Server (SSR por request, necesita el ID para prerender)
 *
 * @see https://angular.dev/guide/ssr#server-routing
 */

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    /** Rutas estáticas: se prerenderan en build time para máxima performance. */
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'adultos',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'ninos',
    renderMode: RenderMode.Prerender,
  },
  {
    /**
     * Ruta dinámica con parámetro `:id`.
     * Se usa `RenderMode.Server` para renderizar bajo demanda,
     * ya que no conocemos todos los IDs posibles en build time.
     */
    path: 'ejercicio/:id',
    renderMode: RenderMode.Server,
  },
  {
    /** Fallback para cualquier ruta no definida. */
    path: '**',
    renderMode: RenderMode.Server,
  },
];
