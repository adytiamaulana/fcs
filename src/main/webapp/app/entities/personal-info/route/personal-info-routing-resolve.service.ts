import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPersonalInfo } from '../personal-info.model';
import { PersonalInfoService } from '../service/personal-info.service';

const personalInfoResolve = (route: ActivatedRouteSnapshot): Observable<null | IPersonalInfo> => {
  const id = route.params['id'];
  if (id) {
    return inject(PersonalInfoService)
      .find(id)
      .pipe(
        mergeMap((personalInfo: HttpResponse<IPersonalInfo>) => {
          if (personalInfo.body) {
            return of(personalInfo.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default personalInfoResolve;
