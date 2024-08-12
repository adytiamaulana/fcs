import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ApplicationStatusComponent } from './list/application-status.component';
import { ApplicationStatusDetailComponent } from './detail/application-status-detail.component';
import { ApplicationStatusUpdateComponent } from './update/application-status-update.component';
import ApplicationStatusResolve from './route/application-status-routing-resolve.service';

const applicationStatusRoute: Routes = [
  {
    path: '',
    component: ApplicationStatusComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ApplicationStatusDetailComponent,
    resolve: {
      applicationStatus: ApplicationStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ApplicationStatusUpdateComponent,
    resolve: {
      applicationStatus: ApplicationStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ApplicationStatusUpdateComponent,
    resolve: {
      applicationStatus: ApplicationStatusResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default applicationStatusRoute;
