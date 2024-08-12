import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'personal-info',
    data: { pageTitle: 'PersonalInfos' },
    loadChildren: () => import('./personal-info/personal-info.routes'),
  },
  {
    path: 'address',
    data: { pageTitle: 'Addresses' },
    loadChildren: () => import('./address/address.routes'),
  },
  {
    path: 'card-type',
    data: { pageTitle: 'CardTypes' },
    loadChildren: () => import('./card-type/card-type.routes'),
  },
  {
    path: 'application-status',
    data: { pageTitle: 'ApplicationStatuses' },
    loadChildren: () => import('./application-status/application-status.routes'),
  },
  {
    path: 'task-history',
    data: { pageTitle: 'TaskHistories' },
    loadChildren: () => import('./task-history/task-history.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
