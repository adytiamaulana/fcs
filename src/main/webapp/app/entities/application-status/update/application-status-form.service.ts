import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type ApplicationStatusFormDefaults = Pick<NewApplicationStatus, 'id'>;

type ApplicationStatusFormGroupContent = {
  id: FormControl<IApplicationStatus['id'] | NewApplicationStatus['id']>;
  code: FormControl<IApplicationStatus['code']>;
  status: FormControl<IApplicationStatus['status']>;
  createdBy: FormControl<IApplicationStatus['createdBy']>;
  createdAt: FormControl<IApplicationStatus['createdAt']>;
  updatedBy: FormControl<IApplicationStatus['updatedBy']>;
  updatedAt: FormControl<IApplicationStatus['updatedAt']>;
  deletedBy: FormControl<IApplicationStatus['deletedBy']>;
  deletedAt: FormControl<IApplicationStatus['deletedAt']>;
};

export type ApplicationStatusFormGroup = FormGroup<ApplicationStatusFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationStatusFormService {
  createApplicationStatusFormGroup(applicationStatus: ApplicationStatusFormGroupInput = { id: null }): ApplicationStatusFormGroup {
    const applicationStatusRawValue = {
      ...this.getFormDefaults(),
      ...applicationStatus,
    };
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
    return form.getRawValue() as IApplicationStatus | NewApplicationStatus;
  }

  resetForm(form: ApplicationStatusFormGroup, applicationStatus: ApplicationStatusFormGroupInput): void {
    const applicationStatusRawValue = { ...this.getFormDefaults(), ...applicationStatus };
    form.reset(
      {
        ...applicationStatusRawValue,
        id: { value: applicationStatusRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ApplicationStatusFormDefaults {
    return {
      id: null,
    };
  }
}
