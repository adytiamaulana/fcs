import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAddress, NewAddress } from '../address.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAddress for edit and NewAddressFormGroupInput for create.
 */
type AddressFormGroupInput = IAddress | PartialWithRequiredKeyOf<NewAddress>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAddress | NewAddress> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type AddressFormRawValue = FormValueOf<IAddress>;

type NewAddressFormRawValue = FormValueOf<NewAddress>;

type AddressFormDefaults = Pick<NewAddress, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type AddressFormGroupContent = {
  id: FormControl<AddressFormRawValue['id'] | NewAddress['id']>;
  address: FormControl<AddressFormRawValue['address']>;
  country: FormControl<AddressFormRawValue['country']>;
  province: FormControl<AddressFormRawValue['province']>;
  city: FormControl<AddressFormRawValue['city']>;
  district: FormControl<AddressFormRawValue['district']>;
  village: FormControl<AddressFormRawValue['village']>;
  postalCode: FormControl<AddressFormRawValue['postalCode']>;
  telephone: FormControl<AddressFormRawValue['telephone']>;
  createdBy: FormControl<AddressFormRawValue['createdBy']>;
  createdAt: FormControl<AddressFormRawValue['createdAt']>;
  updatedBy: FormControl<AddressFormRawValue['updatedBy']>;
  updatedAt: FormControl<AddressFormRawValue['updatedAt']>;
  deletedBy: FormControl<AddressFormRawValue['deletedBy']>;
  deletedAt: FormControl<AddressFormRawValue['deletedAt']>;
};

export type AddressFormGroup = FormGroup<AddressFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AddressFormService {
  createAddressFormGroup(address: AddressFormGroupInput = { id: null }): AddressFormGroup {
    const addressRawValue = this.convertAddressToAddressRawValue({
      ...this.getFormDefaults(),
      ...address,
    });
    return new FormGroup<AddressFormGroupContent>({
      id: new FormControl(
        { value: addressRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      address: new FormControl(addressRawValue.address),
      country: new FormControl(addressRawValue.country),
      province: new FormControl(addressRawValue.province),
      city: new FormControl(addressRawValue.city),
      district: new FormControl(addressRawValue.district),
      village: new FormControl(addressRawValue.village),
      postalCode: new FormControl(addressRawValue.postalCode),
      telephone: new FormControl(addressRawValue.telephone),
      createdBy: new FormControl(addressRawValue.createdBy, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(addressRawValue.createdAt, {
        validators: [Validators.required],
      }),
      updatedBy: new FormControl(addressRawValue.updatedBy),
      updatedAt: new FormControl(addressRawValue.updatedAt),
      deletedBy: new FormControl(addressRawValue.deletedBy),
      deletedAt: new FormControl(addressRawValue.deletedAt),
    });
  }

  getAddress(form: AddressFormGroup): IAddress | NewAddress {
    return this.convertAddressRawValueToAddress(form.getRawValue() as AddressFormRawValue | NewAddressFormRawValue);
  }

  resetForm(form: AddressFormGroup, address: AddressFormGroupInput): void {
    const addressRawValue = this.convertAddressToAddressRawValue({ ...this.getFormDefaults(), ...address });
    form.reset(
      {
        ...addressRawValue,
        id: { value: addressRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AddressFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertAddressRawValueToAddress(rawAddress: AddressFormRawValue | NewAddressFormRawValue): IAddress | NewAddress {
    return {
      ...rawAddress,
      createdAt: dayjs(rawAddress.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawAddress.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawAddress.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertAddressToAddressRawValue(
    address: IAddress | (Partial<NewAddress> & AddressFormDefaults),
  ): AddressFormRawValue | PartialWithRequiredKeyOf<NewAddressFormRawValue> {
    return {
      ...address,
      createdAt: address.createdAt ? address.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: address.updatedAt ? address.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: address.deletedAt ? address.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
