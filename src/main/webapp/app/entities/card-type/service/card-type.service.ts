import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICardType, NewCardType } from '../card-type.model';

export type PartialUpdateCardType = Partial<ICardType> & Pick<ICardType, 'id'>;

type RestOf<T extends ICardType | NewCardType> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RestCardType = RestOf<ICardType>;

export type NewRestCardType = RestOf<NewCardType>;

export type PartialUpdateRestCardType = RestOf<PartialUpdateCardType>;

export type EntityResponseType = HttpResponse<ICardType>;
export type EntityArrayResponseType = HttpResponse<ICardType[]>;

@Injectable({ providedIn: 'root' })
export class CardTypeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/card-types');

  create(cardType: NewCardType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardType);
    return this.http
      .post<RestCardType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(cardType: ICardType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardType);
    return this.http
      .put<RestCardType>(`${this.resourceUrl}/${this.getCardTypeIdentifier(cardType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(cardType: PartialUpdateCardType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(cardType);
    return this.http
      .patch<RestCardType>(`${this.resourceUrl}/${this.getCardTypeIdentifier(cardType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCardType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCardType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCardTypeIdentifier(cardType: Pick<ICardType, 'id'>): number {
    return cardType.id;
  }

  compareCardType(o1: Pick<ICardType, 'id'> | null, o2: Pick<ICardType, 'id'> | null): boolean {
    return o1 && o2 ? this.getCardTypeIdentifier(o1) === this.getCardTypeIdentifier(o2) : o1 === o2;
  }

  addCardTypeToCollectionIfMissing<Type extends Pick<ICardType, 'id'>>(
    cardTypeCollection: Type[],
    ...cardTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cardTypes: Type[] = cardTypesToCheck.filter(isPresent);
    if (cardTypes.length > 0) {
      const cardTypeCollectionIdentifiers = cardTypeCollection.map(cardTypeItem => this.getCardTypeIdentifier(cardTypeItem));
      const cardTypesToAdd = cardTypes.filter(cardTypeItem => {
        const cardTypeIdentifier = this.getCardTypeIdentifier(cardTypeItem);
        if (cardTypeCollectionIdentifiers.includes(cardTypeIdentifier)) {
          return false;
        }
        cardTypeCollectionIdentifiers.push(cardTypeIdentifier);
        return true;
      });
      return [...cardTypesToAdd, ...cardTypeCollection];
    }
    return cardTypeCollection;
  }

  protected convertDateFromClient<T extends ICardType | NewCardType | PartialUpdateCardType>(cardType: T): RestOf<T> {
    return {
      ...cardType,
      createdAt: cardType.createdAt?.format(DATE_FORMAT) ?? null,
      updatedAt: cardType.updatedAt?.format(DATE_FORMAT) ?? null,
      deletedAt: cardType.deletedAt?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCardType: RestCardType): ICardType {
    return {
      ...restCardType,
      createdAt: restCardType.createdAt ? dayjs(restCardType.createdAt) : undefined,
      updatedAt: restCardType.updatedAt ? dayjs(restCardType.updatedAt) : undefined,
      deletedAt: restCardType.deletedAt ? dayjs(restCardType.deletedAt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCardType>): HttpResponse<ICardType> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCardType[]>): HttpResponse<ICardType[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
