/**
 * @fileoverview Gateway — Pantalla de bienvenida de IXOLOLI.
 *
 * Primer punto de contacto del usuario. Presenta la pregunta central
 * "¿Quién va a entrenar hoy?" y permite elegir entre perfil Adulto o Niño.
 *
 * Diseño: paleta pastel con tarjetas en tonos Menta (adulto) y Melocotón (niño).
 * Todo el texto es oscuro (gray-800/teal-900/orange-900) para máximo contraste.
 */

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Componente de selección de perfil — pantalla inicial de IXOLOLI.
 *
 * Responsabilidades:
 * - Mostrar la bienvenida con identidad visual IXOLOLI
 * - Permitir al usuario elegir su tipo de perfil (adulto / niño)
 * - Navegar al catálogo correspondiente
 */
@Component({
  selector: 'app-gateway',
  standalone: true,
  template: `
    <main
      id="main-content"
      class="min-h-screen flex flex-col items-center justify-center gap-10 px-6 py-16"
      style="background-color: #FFFBF8;">

      <!-- Logotipo + Tagline -->
      <header class="text-center animate-fade-in-up" style="animation-delay: 0s;">
        <div class="inline-flex items-center gap-3 mb-4">
          <!-- Ícono de marca -->
          <span class="text-4xl" role="img" aria-hidden="true">🌿</span>
          <h1 class="text-5xl font-extrabold tracking-tight text-gray-800"
              style="font-family: 'Nunito', sans-serif;">
            IXOLOLI
          </h1>
        </div>
        <p class="text-base font-semibold text-teal-600 uppercase tracking-widest">
          Fisioterapia accesible para todos
        </p>
      </header>

      <!-- Pregunta central -->
      <div class="animate-fade-in-up" style="animation-delay: 0.1s;">
        <h2 class="text-3xl md:text-4xl font-extrabold text-gray-800 text-center leading-snug"
            style="font-family: 'Nunito', sans-serif;">
          ¿Quién va a entrenar hoy?
        </h2>
        <p class="text-center text-gray-500 mt-2 font-medium">
          Elige tu perfil para ver los ejercicios que te corresponden.
        </p>
      </div>

      <!-- Tarjetas de selección -->
      <section
        aria-labelledby="profile-heading"
        class="flex flex-col sm:flex-row gap-6 w-full max-w-2xl animate-fade-in-up"
        style="animation-delay: 0.2s;">

        <h3 id="profile-heading" class="sr-only">Selección de perfil</h3>

        <!-- ── Tarjeta Adulto ── -->
        <button
          id="btn-adult-profile"
          (click)="navigateTo('adultos')"
          class="group flex-1 flex flex-col items-center gap-5 p-8
                 bg-teal-50 border-2 border-teal-200 rounded-3xl
                 shadow-sm hover:shadow-lg hover:-translate-y-1
                 transition-all duration-300 cursor-pointer text-left
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
          aria-label="Soy adulto — acceder al catálogo de ejercicios para adultos">

          <!-- Ícono -->
          <div class="w-20 h-20 rounded-2xl bg-teal-100 flex items-center justify-center
                      group-hover:bg-teal-200 transition-colors duration-300"
               aria-hidden="true">
            <span class="text-4xl">🧑‍⚕️</span>
          </div>

          <!-- Texto -->
          <div class="text-center">
            <p class="text-2xl font-extrabold text-teal-700"
               style="font-family: 'Nunito', sans-serif;">
              Soy Adulto
            </p>
            <p class="mt-1 text-sm font-medium text-gray-600">
              Ejercicios terapéuticos para adultos
            </p>
          </div>

          <!-- Botón de acción pastel -->
          <span class="w-full py-3 px-6 rounded-2xl text-center font-bold text-teal-900
                       bg-teal-200 group-hover:bg-teal-300 transition-colors duration-300
                       text-base">
            ¡Comenzar! →
          </span>
        </button>

        <!-- ── Tarjeta Niño ── -->
        <button
          id="btn-kids-profile"
          (click)="navigateTo('ninos')"
          class="group flex-1 flex flex-col items-center gap-5 p-8
                 bg-orange-50 border-2 border-orange-200 rounded-3xl
                 shadow-sm hover:shadow-lg hover:-translate-y-1
                 transition-all duration-300 cursor-pointer text-left
                 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-400"
          aria-label="Soy niño — acceder al catálogo de ejercicios para niños">

          <!-- Ícono -->
          <div class="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center
                      group-hover:bg-orange-200 transition-colors duration-300"
               aria-hidden="true">
            <span class="text-4xl">🧒</span>
          </div>

          <!-- Texto -->
          <div class="text-center">
            <p class="text-2xl font-extrabold text-orange-600"
               style="font-family: 'Nunito', sans-serif;">
              Soy Niño/a
            </p>
            <p class="mt-1 text-sm font-medium text-gray-600">
              Ejercicios divertidos y adaptados
            </p>
          </div>

          <!-- Botón de acción pastel -->
          <span class="w-full py-3 px-6 rounded-2xl text-center font-bold text-orange-900
                       bg-orange-200 group-hover:bg-orange-300 transition-colors duration-300
                       text-base">
            ¡Vamos! →
          </span>
        </button>

      </section>

      <!-- Footer de accesibilidad -->
      <footer class="animate-fade-in-up" style="animation-delay: 0.3s;">
        <p class="text-xs text-gray-400 font-medium text-center">
          🌐 Diseñado con accesibilidad extrema · WCAG 2.1 AA
        </p>
      </footer>

    </main>
  `,
})
export class GatewayComponent {
  private readonly router = inject(Router);

  /**
   * Navega al catálogo según el perfil seleccionado.
   * @param path - `'adultos'` o `'ninos'`
   */
  navigateTo(path: 'adultos' | 'ninos'): void {
    this.router.navigate([path]);
  }
}
