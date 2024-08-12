import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../personal-info.test-samples';

import { PersonalInfoFormService } from './personal-info-form.service';

describe('PersonalInfo Form Service', () => {
  let service: PersonalInfoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalInfoFormService);
  });

  describe('Service methods', () => {
    describe('createPersonalInfoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPersonalInfoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gender: expect.any(Object),
            birthDate: expect.any(Object),
            telephone: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
            address: expect.any(Object),
            cardType: expect.any(Object),
          }),
        );
      });

      it('passing IPersonalInfo should create a new form with FormGroup', () => {
        const formGroup = service.createPersonalInfoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            gender: expect.any(Object),
            birthDate: expect.any(Object),
            telephone: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
            address: expect.any(Object),
            cardType: expect.any(Object),
          }),
        );
      });
    });

    describe('getPersonalInfo', () => {
      it('should return NewPersonalInfo for default PersonalInfo initial value', () => {
        const formGroup = service.createPersonalInfoFormGroup(sampleWithNewData);

        const personalInfo = service.getPersonalInfo(formGroup) as any;

        expect(personalInfo).toMatchObject(sampleWithNewData);
      });

      it('should return NewPersonalInfo for empty PersonalInfo initial value', () => {
        const formGroup = service.createPersonalInfoFormGroup();

        const personalInfo = service.getPersonalInfo(formGroup) as any;

        expect(personalInfo).toMatchObject({});
      });

      it('should return IPersonalInfo', () => {
        const formGroup = service.createPersonalInfoFormGroup(sampleWithRequiredData);

        const personalInfo = service.getPersonalInfo(formGroup) as any;

        expect(personalInfo).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPersonalInfo should not enable id FormControl', () => {
        const formGroup = service.createPersonalInfoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPersonalInfo should disable id FormControl', () => {
        const formGroup = service.createPersonalInfoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
