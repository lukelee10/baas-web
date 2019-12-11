import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserAgreementComponent } from './user-agreement.component';

const routes: Routes = [{ path: '', component: UserAgreementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgreementsRoutingModule {}
