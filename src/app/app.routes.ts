/**
 * @fileoverview Definición de rutas principales de IXOLOLI.
 *
 * Usa lazy loading para cada feature module. Esto asegura que el bundle
 * inicial sea pequeño y que cada sección cargue solo cuando se necesita.
 *
 * Rutas disponibles:
 * - `/`             — Gateway (pantalla de bienvenida y selección de perfil)
 * - `/adultos`      — Catálogo de ejercicios para adultos
 * - `/ninos`        — Catálogo de ejercicios para niños
 * - `/ejercicio/:id`— Detalle de un ejercicio específico
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/gateway/gateway.component').then(
        (m) => m.GatewayComponent
      ),
    title: 'IXOLOLI — Plataforma de Fisioterapia Accesible',
  },
  {
    path: 'adultos',
    loadComponent: () =>
      import('./features/adult-catalog/adult-catalog.component').then(
        (m) => m.AdultCatalogComponent
      ),
    title: 'IXOLOLI — Ejercicios para Adultos',
  },
  {
    path: 'ninos',
    loadComponent: () =>
      import('./features/kids-catalog/kids-catalog.component').then(
        (m) => m.KidsCatalogComponent
      ),
    title: 'IXOLOLI — Ejercicios para Niños',
  },
  {
    path: 'ejercicio/:id',
    loadComponent: () =>
      import('./features/exercise-detail/exercise-detail.component').then(
        (m) => m.ExerciseDetailComponent
      ),
    title: 'IXOLOLI — Detalle de Ejercicio',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
