import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonalInfo, NewPersonalInfo } from '../personal-info.model';

export type PartialUpdatePersonalInfo = Partial<IPersonalInfo> & Pick<IPersonalInfo, 'id'>;

type RestOf<T extends IPersonalInfo | NewPersonalInfo> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestPersonalInfo = RestOf<IPersonalInfo>;

export type NewRestPersonalInfo = RestOf<NewPersonalInfo>;

export type PartialUpdateRestPersonalInfo = RestOf<PartialUpdatePersonalInfo>;

export type EntityResponseType = HttpResponse<IPersonalInfo>;
export type EntityArrayResponseType = HttpResponse<IPersonalInfo[]>;

@Injectable({ providedIn: 'root' })
export class PersonalInfoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personal-infos');

  create(personalInfo: NewPersonalInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personalInfo);
    return this.http
      .post<RestPersonalInfo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(personalInfo: IPersonalInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personalInfo);
    return this.http
      .put<RestPersonalInfo>(`${this.resourceUrl}/${this.getPersonalInfoIdentifier(personalInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(personalInfo: PartialUpdatePersonalInfo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(personalInfo);
    return this.http
      .patch<RestPersonalInfo>(`${this.resourceUrl}/${this.getPersonalInfoIdentifier(personalInfo)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPersonalInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPersonalInfo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPersonalInfoIdentifier(personalInfo: Pick<IPersonalInfo, 'id'>): number {
    return personalInfo.id;
  }

  comparePersonalInfo(o1: Pick<IPersonalInfo, 'id'> | null, o2: Pick<IPersonalInfo, 'id'> | null): boolean {
    return o1 && o2 ? this.getPersonalInfoIdentifier(o1) === this.getPersonalInfoIdentifier(o2) : o1 === o2;
  }

  addPersonalInfoToCollectionIfMissing<Type extends Pick<IPersonalInfo, 'id'>>(
    personalInfoCollection: Type[],
    ...personalInfosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const personalInfos: Type[] = personalInfosToCheck.filter(isPresent);
    if (personalInfos.length > 0) {
      const personalInfoCollectionIdentifiers = personalInfoCollection.map(personalInfoItem =>
        this.getPersonalInfoIdentifier(personalInfoItem),
      );
      const personalInfosToAdd = personalInfos.filter(personalInfoItem => {
        const personalInfoIdentifier = this.getPersonalInfoIdentifier(personalInfoItem);
        if (personalInfoCollectionIdentifiers.includes(personalInfoIdentifier)) {
          return false;
        }
        personalInfoCollectionIdentifiers.push(personalInfoIdentifier);
        return true;
      });
      return [...personalInfosToAdd, ...personalInfoCollection];
    }
    return personalInfoCollection;
  }

  protected convertDateFromClient<T extends IPersonalInfo | NewPersonalInfo | PartialUpdatePersonalInfo>(personalInfo: T): RestOf<T> {
    return {
      ...personalInfo,
      createdAt: personalInfo.createdAt?.format(DATE_FORMAT) ?? null,
      updatedAt: personalInfo.updatedAt?.format(DATE_FORMAT) ?? null,
      deletedAt: personalInfo.deletedAt?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPersonalInfo: RestPersonalInfo): IPersonalInfo {
    return {
      ...restPersonalInfo,
      createdAt: restPersonalInfo.createdAt ? dayjs(restPersonalInfo.createdAt) : undefined,
      updatedAt: restPersonalInfo.updatedAt ? dayjs(restPersonalInfo.updatedAt) : undefined,
      deletedAt: restPersonalInfo.deletedAt ? dayjs(restPersonalInfo.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPersonalInfo>): HttpResponse<IPersonalInfo> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPersonalInfo[]>): HttpResponse<IPersonalInfo[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
