/**
 * @fileoverview Rutas de IXOLOLI — Plataforma 100% enfocada en niños.
 *
 * - `/`              → Redirect a `/ninos/mapa` (sin pantalla de bienvenida)
 * - `/ninos/mapa`    → KidsCatalogComponent  (dentro de MainLayout)
 * - `/ejercicio/:id` → ExerciseDetailComponent (dentro de MainLayout)
 *
 * El perfil adulto está deshabilitado en esta versión.
 */

import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  // ── Rutas con Layout ────────────────────────────────────────────────
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/kids-catalog/kids-catalog.component').then(
            (m) => m.KidsCatalogComponent
          ),
        title: 'IXOLOLI — ¡Tu Mapa de Misiones!',
      },
      {
        path: 'ejercicio/:id',
        loadComponent: () =>
          import('./features/exercise-detail/exercise-detail.component').then(
            (m) => m.ExerciseDetailComponent
          ),
        title: 'IXOLOLI — Detalle de Ejercicio',
      },
    ],
  },

  // ── Fallback ─────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
