import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { TaskHistoryComponent } from './list/task-history.component';
import { TaskHistoryDetailComponent } from './detail/task-history-detail.component';
import { TaskHistoryUpdateComponent } from './update/task-history-update.component';
import TaskHistoryResolve from './route/task-history-routing-resolve.service';

const taskHistoryRoute: Routes = [
  {
    path: '',
    component: TaskHistoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaskHistoryDetailComponent,
    resolve: {
      taskHistory: TaskHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaskHistoryUpdateComponent,
    resolve: {
      taskHistory: TaskHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaskHistoryUpdateComponent,
    resolve: {
      taskHistory: TaskHistoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskHistoryRoute;
