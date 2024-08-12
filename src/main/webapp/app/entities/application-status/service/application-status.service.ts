import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicationStatus, NewApplicationStatus } from '../application-status.model';

export type PartialUpdateApplicationStatus = Partial<IApplicationStatus> & Pick<IApplicationStatus, 'id'>;

type RestOf<T extends IApplicationStatus | NewApplicationStatus> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestApplicationStatus = RestOf<IApplicationStatus>;

export type NewRestApplicationStatus = RestOf<NewApplicationStatus>;

export type PartialUpdateRestApplicationStatus = RestOf<PartialUpdateApplicationStatus>;

export type EntityResponseType = HttpResponse<IApplicationStatus>;
export type EntityArrayResponseType = HttpResponse<IApplicationStatus[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationStatusService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/application-statuses');

  create(applicationStatus: NewApplicationStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationStatus);
    return this.http
      .post<RestApplicationStatus>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(applicationStatus: IApplicationStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationStatus);
    return this.http
      .put<RestApplicationStatus>(`${this.resourceUrl}/${this.getApplicationStatusIdentifier(applicationStatus)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(applicationStatus: PartialUpdateApplicationStatus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationStatus);
    return this.http
      .patch<RestApplicationStatus>(`${this.resourceUrl}/${this.getApplicationStatusIdentifier(applicationStatus)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestApplicationStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestApplicationStatus[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
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

  protected convertDateFromClient<T extends IApplicationStatus | NewApplicationStatus | PartialUpdateApplicationStatus>(
    applicationStatus: T,
  ): RestOf<T> {
    return {
      ...applicationStatus,
      createdAt: applicationStatus.createdAt?.toJSON() ?? null,
      updatedAt: applicationStatus.updatedAt?.toJSON() ?? null,
      deletedAt: applicationStatus.deletedAt?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restApplicationStatus: RestApplicationStatus): IApplicationStatus {
    return {
      ...restApplicationStatus,
      createdAt: restApplicationStatus.createdAt ? dayjs(restApplicationStatus.createdAt) : undefined,
      updatedAt: restApplicationStatus.updatedAt ? dayjs(restApplicationStatus.updatedAt) : undefined,
      deletedAt: restApplicationStatus.deletedAt ? dayjs(restApplicationStatus.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestApplicationStatus>): HttpResponse<IApplicationStatus> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestApplicationStatus[]>): HttpResponse<IApplicationStatus[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
