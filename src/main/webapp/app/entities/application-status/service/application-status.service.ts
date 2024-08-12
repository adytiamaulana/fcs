import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicationStatus, NewApplicationStatus } from '../application-status.model';

export type PartialUpdateApplicationStatus = Partial<IApplicationStatus> & Pick<IApplicationStatus, 'id'>;

export type EntityResponseType = HttpResponse<IApplicationStatus>;
export type EntityArrayResponseType = HttpResponse<IApplicationStatus[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationStatusService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/application-statuses');

  create(applicationStatus: NewApplicationStatus): Observable<EntityResponseType> {
    return this.http.post<IApplicationStatus>(this.resourceUrl, applicationStatus, { observe: 'response' });
  }

  update(applicationStatus: IApplicationStatus): Observable<EntityResponseType> {
    return this.http.put<IApplicationStatus>(
      `${this.resourceUrl}/${this.getApplicationStatusIdentifier(applicationStatus)}`,
      applicationStatus,
      { observe: 'response' },
    );
  }

  partialUpdate(applicationStatus: PartialUpdateApplicationStatus): Observable<EntityResponseType> {
    return this.http.patch<IApplicationStatus>(
      `${this.resourceUrl}/${this.getApplicationStatusIdentifier(applicationStatus)}`,
      applicationStatus,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IApplicationStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IApplicationStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getApplicationStatusIdentifier(applicationStatus: Pick<IApplicationStatus, 'id'>): number {
    return applicationStatus.id;
  }

  compareApplicationStatus(o1: Pick<IApplicationStatus, 'id'> | null, o2: Pick<IApplicationStatus, 'id'> | null): boolean {
    return o1 && o2 ? this.getApplicationStatusIdentifier(o1) === this.getApplicationStatusIdentifier(o2) : o1 === o2;
  }

  addApplicationStatusToCollectionIfMissing<Type extends Pick<IApplicationStatus, 'id'>>(
    applicationStatusCollection: Type[],
    ...applicationStatusesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const applicationStatuses: Type[] = applicationStatusesToCheck.filter(isPresent);
    if (applicationStatuses.length > 0) {
      const applicationStatusCollectionIdentifiers = applicationStatusCollection.map(applicationStatusItem =>
        this.getApplicationStatusIdentifier(applicationStatusItem),
      );
      const applicationStatusesToAdd = applicationStatuses.filter(applicationStatusItem => {
        const applicationStatusIdentifier = this.getApplicationStatusIdentifier(applicationStatusItem);
        if (applicationStatusCollectionIdentifiers.includes(applicationStatusIdentifier)) {
          return false;
        }
        applicationStatusCollectionIdentifiers.push(applicationStatusIdentifier);
        return true;
      });
      return [...applicationStatusesToAdd, ...applicationStatusCollection];
    }
    return applicationStatusCollection;
  }
}
