import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITaskHistory, NewTaskHistory } from '../task-history.model';

export type PartialUpdateTaskHistory = Partial<ITaskHistory> & Pick<ITaskHistory, 'id'>;

type RestOf<T extends ITaskHistory | NewTaskHistory> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestTaskHistory = RestOf<ITaskHistory>;

export type NewRestTaskHistory = RestOf<NewTaskHistory>;

export type PartialUpdateRestTaskHistory = RestOf<PartialUpdateTaskHistory>;

export type EntityResponseType = HttpResponse<ITaskHistory>;
export type EntityArrayResponseType = HttpResponse<ITaskHistory[]>;

@Injectable({ providedIn: 'root' })
export class TaskHistoryService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/task-histories');

  create(taskHistory: NewTaskHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(taskHistory);
    return this.http
      .post<RestTaskHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(taskHistory: ITaskHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(taskHistory);
    return this.http
      .put<RestTaskHistory>(`${this.resourceUrl}/${this.getTaskHistoryIdentifier(taskHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(taskHistory: PartialUpdateTaskHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(taskHistory);
    return this.http
      .patch<RestTaskHistory>(`${this.resourceUrl}/${this.getTaskHistoryIdentifier(taskHistory)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTaskHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTaskHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTaskHistoryIdentifier(taskHistory: Pick<ITaskHistory, 'id'>): number {
    return taskHistory.id;
  }

  compareTaskHistory(o1: Pick<ITaskHistory, 'id'> | null, o2: Pick<ITaskHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskHistoryIdentifier(o1) === this.getTaskHistoryIdentifier(o2) : o1 === o2;
  }

  addTaskHistoryToCollectionIfMissing<Type extends Pick<ITaskHistory, 'id'>>(
    taskHistoryCollection: Type[],
    ...taskHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const taskHistories: Type[] = taskHistoriesToCheck.filter(isPresent);
    if (taskHistories.length > 0) {
      const taskHistoryCollectionIdentifiers = taskHistoryCollection.map(taskHistoryItem => this.getTaskHistoryIdentifier(taskHistoryItem));
      const taskHistoriesToAdd = taskHistories.filter(taskHistoryItem => {
        const taskHistoryIdentifier = this.getTaskHistoryIdentifier(taskHistoryItem);
        if (taskHistoryCollectionIdentifiers.includes(taskHistoryIdentifier)) {
          return false;
        }
        taskHistoryCollectionIdentifiers.push(taskHistoryIdentifier);
        return true;
      });
      return [...taskHistoriesToAdd, ...taskHistoryCollection];
    }
    return taskHistoryCollection;
  }

  protected convertDateFromClient<T extends ITaskHistory | NewTaskHistory | PartialUpdateTaskHistory>(taskHistory: T): RestOf<T> {
    return {
      ...taskHistory,
      startDate: taskHistory.startDate?.format(DATE_FORMAT) ?? null,
      endDate: taskHistory.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restTaskHistory: RestTaskHistory): ITaskHistory {
    return {
      ...restTaskHistory,
      startDate: restTaskHistory.startDate ? dayjs(restTaskHistory.startDate) : undefined,
      endDate: restTaskHistory.endDate ? dayjs(restTaskHistory.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTaskHistory>): HttpResponse<ITaskHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTaskHistory[]>): HttpResponse<ITaskHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
