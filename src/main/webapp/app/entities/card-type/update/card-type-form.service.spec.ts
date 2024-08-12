import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../card-type.test-samples';

import { CardTypeFormService } from './card-type-form.service';

describe('CardType Form Service', () => {
  let service: CardTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardTypeFormService);
  });

  describe('Service methods', () => {
    describe('createCardTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCardTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardCode: expect.any(Object),
            cardName: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });

      it('passing ICardType should create a new form with FormGroup', () => {
        const formGroup = service.createCardTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cardCode: expect.any(Object),
            cardName: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getCardType', () => {
      it('should return NewCardType for default CardType initial value', () => {
        const formGroup = service.createCardTypeFormGroup(sampleWithNewData);

        const cardType = service.getCardType(formGroup) as any;

        expect(cardType).toMatchObject(sampleWithNewData);
      });

      it('should return NewCardType for empty CardType initial value', () => {
        const formGroup = service.createCardTypeFormGroup();

        const cardType = service.getCardType(formGroup) as any;

        expect(cardType).toMatchObject({});
      });

      it('should return ICardType', () => {
        const formGroup = service.createCardTypeFormGroup(sampleWithRequiredData);

        const cardType = service.getCardType(formGroup) as any;

        expect(cardType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICardType should not enable id FormControl', () => {
        const formGroup = service.createCardTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCardType should disable id FormControl', () => {
        const formGroup = service.createCardTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
