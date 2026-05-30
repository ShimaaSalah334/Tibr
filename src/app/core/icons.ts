/**
 * Font Awesome SVG/Core Approach — Documentation & Reference
 *
 * ----------------------------------------------------------------
 * WHY THIS APPROACH?
 * ----------------------------------------------------------------
 * The old CSS/webfont approach (`@fortawesome/fontawesome-free`)
 * bundled ALL 1,600+ icons into the CSS file (~55 kB), regardless
 * of which icons were actually used. The SVG/core approach only
 * ships the icons you explicitly import — smaller bundle, faster
 * loads.
 *
 * ----------------------------------------------------------------
 * HOW IT WORKS
 * ----------------------------------------------------------------
 * 1. Icons are registered globally via `FaIconLibrary` at the app
 *    config level (see `app.config.ts`). This makes them available
 *    anywhere without per-component imports.
 *
 * 2. In templates, use `<fa-icon [icon]="['fas', 'shopping-cart']" />`
 *    instead of `<i class="fas fa-shopping-cart"></i>`.
 *
 *    The prefix is the icon style:
 *      'fas' = solid   (from @fortawesome/free-solid-svg-icons)
 *      'far' = regular (from @fortawesome/free-regular-svg-icons)
 *      'fab' = brands  (from @fortawesome/free-brands-svg-icons)
 *
 * 3. The consuming component needs to import `FontAwesomeModule`
 *    (or `FaIconComponent` directly for finer control).
 *
 * ----------------------------------------------------------------
 * HOW TO USE IN A COMPONENT
 * ----------------------------------------------------------------
 * In your standalone component:
 *
 *   import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
 *
 *   @Component({
 *     imports: [FontAwesomeModule],
 *     ...
 *   })
 *   export class MyComponent {}
 *
 * In the template:
 *
 *   <fa-icon [icon]="['fas', 'shopping-cart']" />
 *   <fa-icon [icon]="['fas', 'spinner']" [spin]="true" />
 *   <fa-icon [icon]="['fas', 'user']" class="text-primary" />
 *
 * ----------------------------------------------------------------
 * HOW TO ADD A NEW ICON
 * ----------------------------------------------------------------
 * 1. Import the icon from the appropriate package:
 *      import { faMyIcon } from '@fortawesome/free-solid-svg-icons';
 *
 * 2. Add it to the `addIcons()` call below.
 *
 * 3. Use it in templates with its kebab-case name:
 *      <fa-icon [icon]="['fas', 'my-icon']" />
 *
 *    The camelCase import name (`faMyIcon`) is automatically
 *    converted to kebab-case (`my-icon`) for template usage.
 *
 * ----------------------------------------------------------------
 * PACKAGES INSTALLED
 * ----------------------------------------------------------------
 * - @fortawesome/angular-fontawesome@3 (Angular component)
 * - @fortawesome/fontawesome-svg-core    (SVG rendering engine)
 * - @fortawesome/free-solid-svg-icons   (Solid style icons)
 * - @fortawesome/free-regular-svg-icons (Regular style icons)
 * - @fortawesome/free-brands-svg-icons  (Brand icons)
 *
 * The old @fortawesome/fontawesome-free package was removed.
 * ----------------------------------------------------------------
 */

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faShoppingCart,
  faUser,
  faTrash,
  faEye,
  faTimes,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faFilter,
  faSearch,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export function registerIcons(library: FaIconLibrary): void {
  library.addIcons(
    faShoppingCart,
    faUser,
    faTrash,
    faEye,
    faTimes,
    faCheck,
    faChevronLeft,
    faChevronRight,
    faFilter,
    faSearch,
    faSpinner,
  );
}
