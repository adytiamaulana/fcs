import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITaskHistory, NewTaskHistory } from '../task-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITaskHistory for edit and NewTaskHistoryFormGroupInput for create.
 */
type TaskHistoryFormGroupInput = ITaskHistory | PartialWithRequiredKeyOf<NewTaskHistory>;

type TaskHistoryFormDefaults = Pick<NewTaskHistory, 'id'>;

type TaskHistoryFormGroupContent = {
  id: FormControl<ITaskHistory['id'] | NewTaskHistory['id']>;
  branch: FormControl<ITaskHistory['branch']>;
  startDate: FormControl<ITaskHistory['startDate']>;
  endDate: FormControl<ITaskHistory['endDate']>;
  personalInfo: FormControl<ITaskHistory['personalInfo']>;
  applicationStatus: FormControl<ITaskHistory['applicationStatus']>;
};

export type TaskHistoryFormGroup = FormGroup<TaskHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskHistoryFormService {
  createTaskHistoryFormGroup(taskHistory: TaskHistoryFormGroupInput = { id: null }): TaskHistoryFormGroup {
    const taskHistoryRawValue = {
      ...this.getFormDefaults(),
      ...taskHistory,
    };
    return new FormGroup<TaskHistoryFormGroupContent>({
      id: new FormControl(
        { value: taskHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      branch: new FormControl(taskHistoryRawValue.branch),
      startDate: new FormControl(taskHistoryRawValue.startDate),
      endDate: new FormControl(taskHistoryRawValue.endDate),
      personalInfo: new FormControl(taskHistoryRawValue.personalInfo),
      applicationStatus: new FormControl(taskHistoryRawValue.applicationStatus),
    });
  }

  getTaskHistory(form: TaskHistoryFormGroup): ITaskHistory | NewTaskHistory {
    return form.getRawValue() as ITaskHistory | NewTaskHistory;
  }

  resetForm(form: TaskHistoryFormGroup, taskHistory: TaskHistoryFormGroupInput): void {
    const taskHistoryRawValue = { ...this.getFormDefaults(), ...taskHistory };
    form.reset(
      {
        ...taskHistoryRawValue,
        id: { value: taskHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskHistoryFormDefaults {
    return {
      id: null,
    };
  }
}
