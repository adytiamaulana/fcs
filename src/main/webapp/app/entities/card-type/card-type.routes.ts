import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CardTypeComponent } from './list/card-type.component';
import { CardTypeDetailComponent } from './detail/card-type-detail.component';
import { CardTypeUpdateComponent } from './update/card-type-update.component';
import CardTypeResolve from './route/card-type-routing-resolve.service';

const cardTypeRoute: Routes = [
  {
    path: '',
    component: CardTypeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CardTypeDetailComponent,
    resolve: {
      cardType: CardTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CardTypeUpdateComponent,
    resolve: {
      cardType: CardTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CardTypeUpdateComponent,
    resolve: {
      cardType: CardTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cardTypeRoute;
