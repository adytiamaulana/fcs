import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICardType, NewCardType } from '../card-type.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICardType for edit and NewCardTypeFormGroupInput for create.
 */
type CardTypeFormGroupInput = ICardType | PartialWithRequiredKeyOf<NewCardType>;

type CardTypeFormDefaults = Pick<NewCardType, 'id'>;

type CardTypeFormGroupContent = {
  id: FormControl<ICardType['id'] | NewCardType['id']>;
  cardCode: FormControl<ICardType['cardCode']>;
  cardName: FormControl<ICardType['cardName']>;
  createdBy: FormControl<ICardType['createdBy']>;
  updatedBy: FormControl<ICardType['updatedBy']>;
  deletedBy: FormControl<ICardType['deletedBy']>;
};

export type CardTypeFormGroup = FormGroup<CardTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CardTypeFormService {
  createCardTypeFormGroup(cardType: CardTypeFormGroupInput = { id: null }): CardTypeFormGroup {
    const cardTypeRawValue = {
      ...this.getFormDefaults(),
      ...cardType,
    };
    return new FormGroup<CardTypeFormGroupContent>({
      id: new FormControl(
        { value: cardTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      cardCode: new FormControl(cardTypeRawValue.cardCode),
      cardName: new FormControl(cardTypeRawValue.cardName),
      createdBy: new FormControl(cardTypeRawValue.createdBy),
      updatedBy: new FormControl(cardTypeRawValue.updatedBy),
      deletedBy: new FormControl(cardTypeRawValue.deletedBy),
    });
  }

  getCardType(form: CardTypeFormGroup): ICardType | NewCardType {
    return form.getRawValue() as ICardType | NewCardType;
  }

  resetForm(form: CardTypeFormGroup, cardType: CardTypeFormGroupInput): void {
    const cardTypeRawValue = { ...this.getFormDefaults(), ...cardType };
    form.reset(
      {
        ...cardTypeRawValue,
        id: { value: cardTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CardTypeFormDefaults {
    return {
      id: null,
    };
  }
}
