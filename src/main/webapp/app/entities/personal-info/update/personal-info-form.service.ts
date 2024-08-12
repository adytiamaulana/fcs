import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPersonalInfo, NewPersonalInfo } from '../personal-info.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPersonalInfo for edit and NewPersonalInfoFormGroupInput for create.
 */
type PersonalInfoFormGroupInput = IPersonalInfo | PartialWithRequiredKeyOf<NewPersonalInfo>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IPersonalInfo | NewPersonalInfo> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type PersonalInfoFormRawValue = FormValueOf<IPersonalInfo>;

type NewPersonalInfoFormRawValue = FormValueOf<NewPersonalInfo>;

type PersonalInfoFormDefaults = Pick<NewPersonalInfo, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type PersonalInfoFormGroupContent = {
  id: FormControl<PersonalInfoFormRawValue['id'] | NewPersonalInfo['id']>;
  name: FormControl<PersonalInfoFormRawValue['name']>;
  gender: FormControl<PersonalInfoFormRawValue['gender']>;
  birthDate: FormControl<PersonalInfoFormRawValue['birthDate']>;
  telephone: FormControl<PersonalInfoFormRawValue['telephone']>;
  createdBy: FormControl<PersonalInfoFormRawValue['createdBy']>;
  createdAt: FormControl<PersonalInfoFormRawValue['createdAt']>;
  updatedBy: FormControl<PersonalInfoFormRawValue['updatedBy']>;
  updatedAt: FormControl<PersonalInfoFormRawValue['updatedAt']>;
  deletedBy: FormControl<PersonalInfoFormRawValue['deletedBy']>;
  deletedAt: FormControl<PersonalInfoFormRawValue['deletedAt']>;
  address: FormControl<PersonalInfoFormRawValue['address']>;
  cardType: FormControl<PersonalInfoFormRawValue['cardType']>;
};

export type PersonalInfoFormGroup = FormGroup<PersonalInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonalInfoFormService {
  createPersonalInfoFormGroup(personalInfo: PersonalInfoFormGroupInput = { id: null }): PersonalInfoFormGroup {
    const personalInfoRawValue = this.convertPersonalInfoToPersonalInfoRawValue({
      ...this.getFormDefaults(),
      ...personalInfo,
    });
    return new FormGroup<PersonalInfoFormGroupContent>({
      id: new FormControl(
        { value: personalInfoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(personalInfoRawValue.name),
      gender: new FormControl(personalInfoRawValue.gender),
      birthDate: new FormControl(personalInfoRawValue.birthDate),
      telephone: new FormControl(personalInfoRawValue.telephone),
      createdBy: new FormControl(personalInfoRawValue.createdBy),
      createdAt: new FormControl(personalInfoRawValue.createdAt),
      updatedBy: new FormControl(personalInfoRawValue.updatedBy),
      updatedAt: new FormControl(personalInfoRawValue.updatedAt),
      deletedBy: new FormControl(personalInfoRawValue.deletedBy),
      deletedAt: new FormControl(personalInfoRawValue.deletedAt),
      address: new FormControl(personalInfoRawValue.address),
      cardType: new FormControl(personalInfoRawValue.cardType),
    });
  }

  getPersonalInfo(form: PersonalInfoFormGroup): IPersonalInfo | NewPersonalInfo {
    return this.convertPersonalInfoRawValueToPersonalInfo(form.getRawValue() as PersonalInfoFormRawValue | NewPersonalInfoFormRawValue);
  }

  resetForm(form: PersonalInfoFormGroup, personalInfo: PersonalInfoFormGroupInput): void {
    const personalInfoRawValue = this.convertPersonalInfoToPersonalInfoRawValue({ ...this.getFormDefaults(), ...personalInfo });
    form.reset(
      {
        ...personalInfoRawValue,
        id: { value: personalInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PersonalInfoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertPersonalInfoRawValueToPersonalInfo(
    rawPersonalInfo: PersonalInfoFormRawValue | NewPersonalInfoFormRawValue,
  ): IPersonalInfo | NewPersonalInfo {
    return {
      ...rawPersonalInfo,
      createdAt: dayjs(rawPersonalInfo.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawPersonalInfo.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawPersonalInfo.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertPersonalInfoToPersonalInfoRawValue(
    personalInfo: IPersonalInfo | (Partial<NewPersonalInfo> & PersonalInfoFormDefaults),
  ): PersonalInfoFormRawValue | PartialWithRequiredKeyOf<NewPersonalInfoFormRawValue> {
    return {
      ...personalInfo,
      createdAt: personalInfo.createdAt ? personalInfo.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: personalInfo.updatedAt ? personalInfo.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: personalInfo.deletedAt ? personalInfo.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
