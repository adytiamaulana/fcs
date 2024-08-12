import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type PersonalInfoFormDefaults = Pick<NewPersonalInfo, 'id'>;

type PersonalInfoFormGroupContent = {
  id: FormControl<IPersonalInfo['id'] | NewPersonalInfo['id']>;
  name: FormControl<IPersonalInfo['name']>;
  gender: FormControl<IPersonalInfo['gender']>;
  birthDate: FormControl<IPersonalInfo['birthDate']>;
  telephone: FormControl<IPersonalInfo['telephone']>;
  createdBy: FormControl<IPersonalInfo['createdBy']>;
  updatedBy: FormControl<IPersonalInfo['updatedBy']>;
  deletedBy: FormControl<IPersonalInfo['deletedBy']>;
  address: FormControl<IPersonalInfo['address']>;
  cardType: FormControl<IPersonalInfo['cardType']>;
};

export type PersonalInfoFormGroup = FormGroup<PersonalInfoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PersonalInfoFormService {
  createPersonalInfoFormGroup(personalInfo: PersonalInfoFormGroupInput = { id: null }): PersonalInfoFormGroup {
    const personalInfoRawValue = {
      ...this.getFormDefaults(),
      ...personalInfo,
    };
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
      updatedBy: new FormControl(personalInfoRawValue.updatedBy),
      deletedBy: new FormControl(personalInfoRawValue.deletedBy),
      address: new FormControl(personalInfoRawValue.address),
      cardType: new FormControl(personalInfoRawValue.cardType),
    });
  }

  getPersonalInfo(form: PersonalInfoFormGroup): IPersonalInfo | NewPersonalInfo {
    return form.getRawValue() as IPersonalInfo | NewPersonalInfo;
  }

  resetForm(form: PersonalInfoFormGroup, personalInfo: PersonalInfoFormGroupInput): void {
    const personalInfoRawValue = { ...this.getFormDefaults(), ...personalInfo };
    form.reset(
      {
        ...personalInfoRawValue,
        id: { value: personalInfoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PersonalInfoFormDefaults {
    return {
      id: null,
    };
  }
}
