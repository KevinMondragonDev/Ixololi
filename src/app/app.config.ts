/**
 * @fileoverview Configuración principal de la aplicación IXOLOLI.
 *
 * Registra los providers globales: router con preloadAllModules,
 * HttpClient con Fetch API (compatible con SSR), e hidratación del cliente.
 */

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  withComponentInputBinding,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';

/**
 * Configuración global de la aplicación Angular.
 *
 * - `provideRouter`: habilita routing con preload de módulos lazy y binding de inputs
 * - `provideHttpClient(withFetch())`: usa Fetch API (requerido para SSR)
 * - `provideClientHydration`: habilita hidratación del cliente con event replay
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding()
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
  ],
};
