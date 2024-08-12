import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPersonalInfo } from 'app/entities/personal-info/personal-info.model';
import { PersonalInfoService } from 'app/entities/personal-info/service/personal-info.service';
import { IApplicationStatus } from 'app/entities/application-status/application-status.model';
import { ApplicationStatusService } from 'app/entities/application-status/service/application-status.service';
import { TaskHistoryService } from '../service/task-history.service';
import { ITaskHistory } from '../task-history.model';
import { TaskHistoryFormService, TaskHistoryFormGroup } from './task-history-form.service';

@Component({
  standalone: true,
  selector: 'jhi-task-history-update',
  templateUrl: './task-history-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TaskHistoryUpdateComponent implements OnInit {
  isSaving = false;
  taskHistory: ITaskHistory | null = null;

  personalInfosCollection: IPersonalInfo[] = [];
  applicationStatusesCollection: IApplicationStatus[] = [];

  protected taskHistoryService = inject(TaskHistoryService);
  protected taskHistoryFormService = inject(TaskHistoryFormService);
  protected personalInfoService = inject(PersonalInfoService);
  protected applicationStatusService = inject(ApplicationStatusService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TaskHistoryFormGroup = this.taskHistoryFormService.createTaskHistoryFormGroup();

  comparePersonalInfo = (o1: IPersonalInfo | null, o2: IPersonalInfo | null): boolean =>
    this.personalInfoService.comparePersonalInfo(o1, o2);

  compareApplicationStatus = (o1: IApplicationStatus | null, o2: IApplicationStatus | null): boolean =>
    this.applicationStatusService.compareApplicationStatus(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ taskHistory }) => {
      this.taskHistory = taskHistory;
      if (taskHistory) {
        this.updateForm(taskHistory);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const taskHistory = this.taskHistoryFormService.getTaskHistory(this.editForm);
    if (taskHistory.id !== null) {
      this.subscribeToSaveResponse(this.taskHistoryService.update(taskHistory));
    } else {
      this.subscribeToSaveResponse(this.taskHistoryService.create(taskHistory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskHistory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(taskHistory: ITaskHistory): void {
    this.taskHistory = taskHistory;
    this.taskHistoryFormService.resetForm(this.editForm, taskHistory);

    this.personalInfosCollection = this.personalInfoService.addPersonalInfoToCollectionIfMissing<IPersonalInfo>(
      this.personalInfosCollection,
      taskHistory.personalInfo,
    );
    this.applicationStatusesCollection = this.applicationStatusService.addApplicationStatusToCollectionIfMissing<IApplicationStatus>(
      this.applicationStatusesCollection,
      taskHistory.applicationStatus,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.personalInfoService
      .query({ filter: 'taskhistory-is-null' })
      .pipe(map((res: HttpResponse<IPersonalInfo[]>) => res.body ?? []))
      .pipe(
        map((personalInfos: IPersonalInfo[]) =>
          this.personalInfoService.addPersonalInfoToCollectionIfMissing<IPersonalInfo>(personalInfos, this.taskHistory?.personalInfo),
        ),
      )
      .subscribe((personalInfos: IPersonalInfo[]) => (this.personalInfosCollection = personalInfos));

    this.applicationStatusService
      .query({ filter: 'taskhistory-is-null' })
      .pipe(map((res: HttpResponse<IApplicationStatus[]>) => res.body ?? []))
      .pipe(
        map((applicationStatuses: IApplicationStatus[]) =>
          this.applicationStatusService.addApplicationStatusToCollectionIfMissing<IApplicationStatus>(
            applicationStatuses,
            this.taskHistory?.applicationStatus,
          ),
        ),
      )
      .subscribe((applicationStatuses: IApplicationStatus[]) => (this.applicationStatusesCollection = applicationStatuses));
  }
}
