import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPersonalInfo, NewPersonalInfo } from '../personal-info.model';

export type PartialUpdatePersonalInfo = Partial<IPersonalInfo> & Pick<IPersonalInfo, 'id'>;

export type EntityResponseType = HttpResponse<IPersonalInfo>;
export type EntityArrayResponseType = HttpResponse<IPersonalInfo[]>;

@Injectable({ providedIn: 'root' })
export class PersonalInfoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/personal-infos');

  create(personalInfo: NewPersonalInfo): Observable<EntityResponseType> {
    return this.http.post<IPersonalInfo>(this.resourceUrl, personalInfo, { observe: 'response' });
  }

  update(personalInfo: IPersonalInfo): Observable<EntityResponseType> {
    return this.http.put<IPersonalInfo>(`${this.resourceUrl}/${this.getPersonalInfoIdentifier(personalInfo)}`, personalInfo, {
      observe: 'response',
    });
  }

  partialUpdate(personalInfo: PartialUpdatePersonalInfo): Observable<EntityResponseType> {
    return this.http.patch<IPersonalInfo>(`${this.resourceUrl}/${this.getPersonalInfoIdentifier(personalInfo)}`, personalInfo, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPersonalInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPersonalInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
