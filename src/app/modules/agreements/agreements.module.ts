import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AgreementsRoutingModule } from './agreements-routing.module';
import { UserAgreementComponent } from './user-agreement.component';

@NgModule({
  declarations: [UserAgreementComponent],
  imports: [SharedModule, CommonModule, AgreementsRoutingModule]
})
export class AgreementsModule {}
