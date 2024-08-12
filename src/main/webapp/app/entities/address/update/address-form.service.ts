import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

type AddressFormDefaults = Pick<NewAddress, 'id'>;

type AddressFormGroupContent = {
  id: FormControl<IAddress['id'] | NewAddress['id']>;
  address: FormControl<IAddress['address']>;
  country: FormControl<IAddress['country']>;
  province: FormControl<IAddress['province']>;
  city: FormControl<IAddress['city']>;
  district: FormControl<IAddress['district']>;
  village: FormControl<IAddress['village']>;
  postalCode: FormControl<IAddress['postalCode']>;
  telephone: FormControl<IAddress['telephone']>;
  createdBy: FormControl<IAddress['createdBy']>;
  updatedBy: FormControl<IAddress['updatedBy']>;
  deletedBy: FormControl<IAddress['deletedBy']>;
};

export type AddressFormGroup = FormGroup<AddressFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AddressFormService {
  createAddressFormGroup(address: AddressFormGroupInput = { id: null }): AddressFormGroup {
    const addressRawValue = {
      ...this.getFormDefaults(),
      ...address,
    };
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
      createdBy: new FormControl(addressRawValue.createdBy),
      updatedBy: new FormControl(addressRawValue.updatedBy),
      deletedBy: new FormControl(addressRawValue.deletedBy),
    });
  }

  getAddress(form: AddressFormGroup): IAddress | NewAddress {
    return form.getRawValue() as IAddress | NewAddress;
  }

  resetForm(form: AddressFormGroup, address: AddressFormGroupInput): void {
    const addressRawValue = { ...this.getFormDefaults(), ...address };
    form.reset(
      {
        ...addressRawValue,
        id: { value: addressRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AddressFormDefaults {
    return {
      id: null,
    };
  }
}
