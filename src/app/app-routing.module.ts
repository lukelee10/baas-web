import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

import { AuthenticationGuard } from './core/guards/authentication.guard';

// Lazy Loading Feature Modules
// By default, NgModules are eagerly loaded, which means that as soon as the app loads,
// so do all the NgModules, whether or not they are immediately necessary.
// For large apps with lots of routes, consider lazy loading—a design pattern that loads NgModules as needed.
// Lazy loading helps keep initial bundle sizes smaller, which in turn helps decrease load times.
// For more information please read https://angular.io/guide/lazy-loading-ngmodules

// The ** path in the last route is a wildcard.
// The router will select this route if the requested URL
// doesn't match any paths for routes defined earlier in the configuration.
// This is useful for displaying a "404 - Not Found" page or redirecting to another route.
const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'announcements',
        loadChildren: () => import('./modules/announcements/announcements.module').then(m => m.AnnouncementsModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'requests',
        loadChildren: () => import('./modules/requests/requests.module').then(m => m.RequestsModule)
      },
      {
        path: 'resources',
        loadChildren: () => import('./modules/resources/resources.module').then(m => m.ResourcesModule)
      },
      {
        path: 'responses',
        loadChildren: () => import('./modules/responses/responses.module').then(m => m.ResponsesModule)
      },
    ]
  },
  // Fallback when no prior routes is matched
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
