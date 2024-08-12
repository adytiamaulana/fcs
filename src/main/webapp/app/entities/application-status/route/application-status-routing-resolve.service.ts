import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IApplicationStatus } from '../application-status.model';
import { ApplicationStatusService } from '../service/application-status.service';

const applicationStatusResolve = (route: ActivatedRouteSnapshot): Observable<null | IApplicationStatus> => {
  const id = route.params['id'];
  if (id) {
    return inject(ApplicationStatusService)
      .find(id)
      .pipe(
        mergeMap((applicationStatus: HttpResponse<IApplicationStatus>) => {
          if (applicationStatus.body) {
            return of(applicationStatus.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default applicationStatusResolve;
