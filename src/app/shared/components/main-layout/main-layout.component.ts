/**
 * @fileoverview MainLayoutComponent — Layout principal con header y router-outlet.
 *
 * Actúa como shell para todas las rutas que requieren la cabecera de navegación.
 * El Gateway (`/`) no usa este layout para mantener su diseño de pantalla completa.
 *
 * Estructura:
 * ```
 * <app-main-layout>
 *   <app-header />          ← Cabecera sticky con logo y nav
 *   <router-outlet />       ← Contenido de la ruta activa
 * </app-main-layout>
 * ```
 *
 * @module shared/components
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

/**
 * Layout principal de IXOLOLI.
 *
 * Envuelve todas las rutas internas (catálogos, detalle de ejercicio)
 * con la cabecera de navegación global. El Gateway es la única ruta
 * que renderiza sin este layout, ya que ocupa la pantalla completa.
 *
 * @example
 * En `app.routes.ts`:
 * ```typescript
 * {
 *   path: '',
 *   component: MainLayoutComponent,
 *   children: [
 *     { path: 'adultos/home', loadComponent: () => ... },
 *   ]
 * }
 * ```
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen flex flex-col"
         style="background-color: #FFFBF8; font-family: 'Nunito', sans-serif;">

      <!-- Cabecera global sticky -->
      <app-header />

      <!-- Contenido de la ruta activa -->
      <main id="main-content" class="flex-1">
        <router-outlet />
      </main>

      <!-- Footer mínimo accesible -->
      <footer class="border-t border-teal-100/50 py-5 px-6 text-center">
        <p class="text-xs font-semibold text-gray-400">
          🌿 IXOLOLI · Fisioterapia accesible para todos ·
          <span class="text-teal-600">WCAG 2.1 AA</span>
        </p>
      </footer>

    </div>
  `,
})
export class MainLayoutComponent {}
