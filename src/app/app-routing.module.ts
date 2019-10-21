import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

// The empty path in the second route represents the default path for the application,
// the place to go when the path in the URL is empty, as it typically is at the start.
// This default route redirects to the route for the /helloPage URL and,
// therefore, will display the HelloPageComponent.

// The ** path in the last route is a wildcard.
// The router will select this route if the requested URL
// doesn't match any paths for routes defined earlier in the configuration.
// This is useful for displaying a "404 - Not Found" page or redirecting to another route.
const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
  { path: 'resources', loadChildren: () => import('./modules/resources/resources.module').then(m => m.ResourcesModule) },
  { path: 'responses', loadChildren: () => import('./modules/responses/responses.module').then(m => m.ResponsesModule) },
  { path: 'requests', loadChildren: () => import('./modules/requests/requests.module').then(m => m.RequestsModule) },
  // Fallback when no prior routes is matched
//  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
