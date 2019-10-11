import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateRequestComponent } from './requests/create-request/create-request.component';
import { NewUserComponent } from './admin/new-user/new-user.component';
import { NotfoundComponent } from './errorpages/notfound/notfound.component';
import { RequestsComponent } from './requests/requests/requests.component';
import { UsersMgmtComponent } from './admin/users-mgmt/users-mgmt.component';


// The empty path in the sewcond route represents the default path for the application,
// the place to go when the path in the URL is empty, as it typically is at the start.
// This default route redirects to the route for the /helloPage URL and,
// therefore, will display the HelloPageComponent.

// The ** path in the last route is a wildcard.
// The router will select this route if the requested URL
// doesn't match any paths for routes defined earlier in the configuration.
// This is useful for displaying a "404 - Not Found" page or redirecting to another route.
const routes: Routes = [
  {
    path: 'requests',
    component: RequestsComponent,
  },
  {
    path: 'createrequest',
    component: CreateRequestComponent,
  },
  {
    path: 'createuser',
    component: NewUserComponent,
  },
  {
    path: 'usermanagement',
    component: UsersMgmtComponent,
  },
  {
    path: '',
    redirectTo: '/createrequest',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
