import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ITaskHistory | NewTaskHistory> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type TaskHistoryFormRawValue = FormValueOf<ITaskHistory>;

type NewTaskHistoryFormRawValue = FormValueOf<NewTaskHistory>;

type TaskHistoryFormDefaults = Pick<NewTaskHistory, 'id' | 'startDate' | 'endDate'>;

type TaskHistoryFormGroupContent = {
  id: FormControl<TaskHistoryFormRawValue['id'] | NewTaskHistory['id']>;
  startDate: FormControl<TaskHistoryFormRawValue['startDate']>;
  endDate: FormControl<TaskHistoryFormRawValue['endDate']>;
  personalInfo: FormControl<TaskHistoryFormRawValue['personalInfo']>;
  applicationStatus: FormControl<TaskHistoryFormRawValue['applicationStatus']>;
};

export type TaskHistoryFormGroup = FormGroup<TaskHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TaskHistoryFormService {
  createTaskHistoryFormGroup(taskHistory: TaskHistoryFormGroupInput = { id: null }): TaskHistoryFormGroup {
    const taskHistoryRawValue = this.convertTaskHistoryToTaskHistoryRawValue({
      ...this.getFormDefaults(),
      ...taskHistory,
    });
    return new FormGroup<TaskHistoryFormGroupContent>({
      id: new FormControl(
        { value: taskHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(taskHistoryRawValue.startDate),
      endDate: new FormControl(taskHistoryRawValue.endDate),
      personalInfo: new FormControl(taskHistoryRawValue.personalInfo),
      applicationStatus: new FormControl(taskHistoryRawValue.applicationStatus),
    });
  }

  getTaskHistory(form: TaskHistoryFormGroup): ITaskHistory | NewTaskHistory {
    return this.convertTaskHistoryRawValueToTaskHistory(form.getRawValue() as TaskHistoryFormRawValue | NewTaskHistoryFormRawValue);
  }

  resetForm(form: TaskHistoryFormGroup, taskHistory: TaskHistoryFormGroupInput): void {
    const taskHistoryRawValue = this.convertTaskHistoryToTaskHistoryRawValue({ ...this.getFormDefaults(), ...taskHistory });
    form.reset(
      {
        ...taskHistoryRawValue,
        id: { value: taskHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TaskHistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertTaskHistoryRawValueToTaskHistory(
    rawTaskHistory: TaskHistoryFormRawValue | NewTaskHistoryFormRawValue,
  ): ITaskHistory | NewTaskHistory {
    return {
      ...rawTaskHistory,
      startDate: dayjs(rawTaskHistory.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawTaskHistory.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertTaskHistoryToTaskHistoryRawValue(
    taskHistory: ITaskHistory | (Partial<NewTaskHistory> & TaskHistoryFormDefaults),
  ): TaskHistoryFormRawValue | PartialWithRequiredKeyOf<NewTaskHistoryFormRawValue> {
    return {
      ...taskHistory,
      startDate: taskHistory.startDate ? taskHistory.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: taskHistory.endDate ? taskHistory.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
