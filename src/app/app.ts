/**
 * @fileoverview Componente raíz de la aplicación IXOLOLI.
 *
 * Solo actúa como shell: renderiza el `<router-outlet>` para que
 * el router cargue el componente de cada ruta de forma lazy.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raíz de IXOLOLI.
 * Shell minimalista que delega toda la UI al sistema de routing.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <!-- Skip link para accesibilidad por teclado -->
    <a href="#main-content" class="skip-link">
      Saltar al contenido principal
    </a>
    <router-outlet />
  `,
})
export class App {}
