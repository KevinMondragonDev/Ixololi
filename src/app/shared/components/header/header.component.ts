/**
 * @fileoverview HeaderComponent — Cabecera de IXOLOLI (modo niños).
 * Logo y enlace único a "Inicio" (mapa de misiones).
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header
      class="sticky top-0 z-50 w-full border-b border-orange-100/60"
      style="background-color: #FFFBF8;">

      <div class="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-6">

        <!-- Logotipo -->
        <a routerLink="/"
           class="flex items-center gap-2.5 group focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg"
           aria-label="IXOLOLI — Ir al mapa de misiones">
          <div class="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
            <!-- Mascota Parada (Default) -->
            <img src="assets/images/MascotaParada.png" alt="Mascota" 
                 class="absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-opacity duration-300 opacity-100 group-hover:opacity-0" 
                 aria-hidden="true" />
            <!-- Mascota Brincando (Hover) -->
            <img src="assets/images/MascotaBrincando.png" alt="Mascota Brincando" 
                 class="absolute inset-0 h-full w-full object-contain drop-shadow-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
                 aria-hidden="true" />
          </div>
          <div class="flex items-center space-x-0.5 text-2xl font-black tracking-wider uppercase" style="font-family: 'Nunito', 'Varela Round', sans-serif;">
            <span class="text-ixololi-teal">I</span>
            <span class="text-ixololi-teal">X</span>
            <span class="text-ixololi-yellow">O</span>
            <span class="text-ixololi-coral">L</span>
            <span class="text-ixololi-blue">O</span>
            <span class="text-ixololi-teal">L</span>
            <span class="text-ixololi-coral">I</span>
          </div>
        </a>

        <!-- Navegación eliminada a petición del usuario -->

      </div>
    </header>
  `,
})
export class HeaderComponent {}
