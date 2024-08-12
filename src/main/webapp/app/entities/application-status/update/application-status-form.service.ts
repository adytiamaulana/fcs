import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IApplicationStatus, NewApplicationStatus } from '../application-status.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplicationStatus for edit and NewApplicationStatusFormGroupInput for create.
 */
type ApplicationStatusFormGroupInput = IApplicationStatus | PartialWithRequiredKeyOf<NewApplicationStatus>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IApplicationStatus | NewApplicationStatus> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type ApplicationStatusFormRawValue = FormValueOf<IApplicationStatus>;

type NewApplicationStatusFormRawValue = FormValueOf<NewApplicationStatus>;

type ApplicationStatusFormDefaults = Pick<NewApplicationStatus, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type ApplicationStatusFormGroupContent = {
  id: FormControl<ApplicationStatusFormRawValue['id'] | NewApplicationStatus['id']>;
  code: FormControl<ApplicationStatusFormRawValue['code']>;
  status: FormControl<ApplicationStatusFormRawValue['status']>;
  createdBy: FormControl<ApplicationStatusFormRawValue['createdBy']>;
  createdAt: FormControl<ApplicationStatusFormRawValue['createdAt']>;
  updatedBy: FormControl<ApplicationStatusFormRawValue['updatedBy']>;
  updatedAt: FormControl<ApplicationStatusFormRawValue['updatedAt']>;
  deletedBy: FormControl<ApplicationStatusFormRawValue['deletedBy']>;
  deletedAt: FormControl<ApplicationStatusFormRawValue['deletedAt']>;
};

export type ApplicationStatusFormGroup = FormGroup<ApplicationStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationStatusFormService {
  createApplicationStatusFormGroup(applicationStatus: ApplicationStatusFormGroupInput = { id: null }): ApplicationStatusFormGroup {
    const applicationStatusRawValue = this.convertApplicationStatusToApplicationStatusRawValue({
      ...this.getFormDefaults(),
      ...applicationStatus,
    });
    return new FormGroup<ApplicationStatusFormGroupContent>({
      id: new FormControl(
        { value: applicationStatusRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(applicationStatusRawValue.code),
      status: new FormControl(applicationStatusRawValue.status),
      createdBy: new FormControl(applicationStatusRawValue.createdBy),
      createdAt: new FormControl(applicationStatusRawValue.createdAt),
      updatedBy: new FormControl(applicationStatusRawValue.updatedBy),
      updatedAt: new FormControl(applicationStatusRawValue.updatedAt),
      deletedBy: new FormControl(applicationStatusRawValue.deletedBy),
      deletedAt: new FormControl(applicationStatusRawValue.deletedAt),
    });
  }

  getApplicationStatus(form: ApplicationStatusFormGroup): IApplicationStatus | NewApplicationStatus {
    return this.convertApplicationStatusRawValueToApplicationStatus(
      form.getRawValue() as ApplicationStatusFormRawValue | NewApplicationStatusFormRawValue,
    );
  }

  resetForm(form: ApplicationStatusFormGroup, applicationStatus: ApplicationStatusFormGroupInput): void {
    const applicationStatusRawValue = this.convertApplicationStatusToApplicationStatusRawValue({
      ...this.getFormDefaults(),
      ...applicationStatus,
    });
    form.reset(
      {
        ...applicationStatusRawValue,
        id: { value: applicationStatusRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ApplicationStatusFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertApplicationStatusRawValueToApplicationStatus(
    rawApplicationStatus: ApplicationStatusFormRawValue | NewApplicationStatusFormRawValue,
  ): IApplicationStatus | NewApplicationStatus {
    return {
      ...rawApplicationStatus,
      createdAt: dayjs(rawApplicationStatus.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawApplicationStatus.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawApplicationStatus.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertApplicationStatusToApplicationStatusRawValue(
    applicationStatus: IApplicationStatus | (Partial<NewApplicationStatus> & ApplicationStatusFormDefaults),
  ): ApplicationStatusFormRawValue | PartialWithRequiredKeyOf<NewApplicationStatusFormRawValue> {
    return {
      ...applicationStatus,
      createdAt: applicationStatus.createdAt ? applicationStatus.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: applicationStatus.updatedAt ? applicationStatus.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: applicationStatus.deletedAt ? applicationStatus.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
