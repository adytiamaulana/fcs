import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { PersonalInfoComponent } from './list/personal-info.component';
import { PersonalInfoDetailComponent } from './detail/personal-info-detail.component';
import { PersonalInfoUpdateComponent } from './update/personal-info-update.component';
import PersonalInfoResolve from './route/personal-info-routing-resolve.service';

const personalInfoRoute: Routes = [
  {
    path: '',
    component: PersonalInfoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonalInfoDetailComponent,
    resolve: {
      personalInfo: PersonalInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonalInfoUpdateComponent,
    resolve: {
      personalInfo: PersonalInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonalInfoUpdateComponent,
    resolve: {
      personalInfo: PersonalInfoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default personalInfoRoute;
