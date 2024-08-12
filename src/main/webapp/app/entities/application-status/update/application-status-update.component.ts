import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IApplicationStatus } from '../application-status.model';
import { ApplicationStatusService } from '../service/application-status.service';
import { ApplicationStatusFormService, ApplicationStatusFormGroup } from './application-status-form.service';

@Component({
  standalone: true,
  selector: 'jhi-application-status-update',
  templateUrl: './application-status-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ApplicationStatusUpdateComponent implements OnInit {
  isSaving = false;
  applicationStatus: IApplicationStatus | null = null;

  protected applicationStatusService = inject(ApplicationStatusService);
  protected applicationStatusFormService = inject(ApplicationStatusFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ApplicationStatusFormGroup = this.applicationStatusFormService.createApplicationStatusFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ applicationStatus }) => {
      this.applicationStatus = applicationStatus;
      if (applicationStatus) {
        this.updateForm(applicationStatus);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const applicationStatus = this.applicationStatusFormService.getApplicationStatus(this.editForm);
    if (applicationStatus.id !== null) {
      this.subscribeToSaveResponse(this.applicationStatusService.update(applicationStatus));
    } else {
      this.subscribeToSaveResponse(this.applicationStatusService.create(applicationStatus));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplicationStatus>>): void {
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

  protected updateForm(applicationStatus: IApplicationStatus): void {
    this.applicationStatus = applicationStatus;
    this.applicationStatusFormService.resetForm(this.editForm, applicationStatus);
  }
}
