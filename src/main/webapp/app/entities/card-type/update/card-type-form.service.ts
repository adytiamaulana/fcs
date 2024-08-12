import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICardType | NewCardType> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

type CardTypeFormRawValue = FormValueOf<ICardType>;

type NewCardTypeFormRawValue = FormValueOf<NewCardType>;

type CardTypeFormDefaults = Pick<NewCardType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

type CardTypeFormGroupContent = {
  id: FormControl<CardTypeFormRawValue['id'] | NewCardType['id']>;
  cardCode: FormControl<CardTypeFormRawValue['cardCode']>;
  cardName: FormControl<CardTypeFormRawValue['cardName']>;
  createdBy: FormControl<CardTypeFormRawValue['createdBy']>;
  createdAt: FormControl<CardTypeFormRawValue['createdAt']>;
  updatedBy: FormControl<CardTypeFormRawValue['updatedBy']>;
  updatedAt: FormControl<CardTypeFormRawValue['updatedAt']>;
  deletedBy: FormControl<CardTypeFormRawValue['deletedBy']>;
  deletedAt: FormControl<CardTypeFormRawValue['deletedAt']>;
};

export type CardTypeFormGroup = FormGroup<CardTypeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CardTypeFormService {
  createCardTypeFormGroup(cardType: CardTypeFormGroupInput = { id: null }): CardTypeFormGroup {
    const cardTypeRawValue = this.convertCardTypeToCardTypeRawValue({
      ...this.getFormDefaults(),
      ...cardType,
    });
    return new FormGroup<CardTypeFormGroupContent>({
      id: new FormControl(
        { value: cardTypeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      cardCode: new FormControl(cardTypeRawValue.cardCode, {
        validators: [Validators.required],
      }),
      cardName: new FormControl(cardTypeRawValue.cardName),
      createdBy: new FormControl(cardTypeRawValue.createdBy, {
        validators: [Validators.required],
      }),
      createdAt: new FormControl(cardTypeRawValue.createdAt, {
        validators: [Validators.required],
      }),
      updatedBy: new FormControl(cardTypeRawValue.updatedBy),
      updatedAt: new FormControl(cardTypeRawValue.updatedAt),
      deletedBy: new FormControl(cardTypeRawValue.deletedBy),
      deletedAt: new FormControl(cardTypeRawValue.deletedAt),
    });
  }

  getCardType(form: CardTypeFormGroup): ICardType | NewCardType {
    return this.convertCardTypeRawValueToCardType(form.getRawValue() as CardTypeFormRawValue | NewCardTypeFormRawValue);
  }

  resetForm(form: CardTypeFormGroup, cardType: CardTypeFormGroupInput): void {
    const cardTypeRawValue = this.convertCardTypeToCardTypeRawValue({ ...this.getFormDefaults(), ...cardType });
    form.reset(
      {
        ...cardTypeRawValue,
        id: { value: cardTypeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CardTypeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdAt: currentTime,
      updatedAt: currentTime,
      deletedAt: currentTime,
    };
  }

  private convertCardTypeRawValueToCardType(rawCardType: CardTypeFormRawValue | NewCardTypeFormRawValue): ICardType | NewCardType {
    return {
      ...rawCardType,
      createdAt: dayjs(rawCardType.createdAt, DATE_TIME_FORMAT),
      updatedAt: dayjs(rawCardType.updatedAt, DATE_TIME_FORMAT),
      deletedAt: dayjs(rawCardType.deletedAt, DATE_TIME_FORMAT),
    };
  }

  private convertCardTypeToCardTypeRawValue(
    cardType: ICardType | (Partial<NewCardType> & CardTypeFormDefaults),
  ): CardTypeFormRawValue | PartialWithRequiredKeyOf<NewCardTypeFormRawValue> {
    return {
      ...cardType,
      createdAt: cardType.createdAt ? cardType.createdAt.format(DATE_TIME_FORMAT) : undefined,
      updatedAt: cardType.updatedAt ? cardType.updatedAt.format(DATE_TIME_FORMAT) : undefined,
      deletedAt: cardType.deletedAt ? cardType.deletedAt.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
