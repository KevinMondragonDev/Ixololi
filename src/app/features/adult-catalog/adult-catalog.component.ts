/**
 * @fileoverview AdultCatalogComponent — Deshabilitado en esta versión.
 *
 * La plataforma IXOLOLI está actualmente enfocada en el perfil pediátrico.
 * Este componente se mantiene como placeholder y redirige automáticamente
 * al mapa de misiones de niños.
 */

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adult-catalog',
  standalone: true,
  template: `<div class="min-h-screen flex items-center justify-center">
    <p class="text-gray-400 font-semibold">Redirigiendo...</p>
  </div>`,
})
export class AdultCatalogComponent {
  constructor() {
    inject(Router).navigate(['/'], { replaceUrl: true });
  }
}
