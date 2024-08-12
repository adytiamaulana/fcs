import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../application-status.test-samples';

import { ApplicationStatusFormService } from './application-status-form.service';

describe('ApplicationStatus Form Service', () => {
  let service: ApplicationStatusFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationStatusFormService);
  });

  describe('Service methods', () => {
    describe('createApplicationStatusFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createApplicationStatusFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });

      it('passing IApplicationStatus should create a new form with FormGroup', () => {
        const formGroup = service.createApplicationStatusFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            status: expect.any(Object),
            createdBy: expect.any(Object),
            updatedBy: expect.any(Object),
            deletedBy: expect.any(Object),
          }),
        );
      });
    });

    describe('getApplicationStatus', () => {
      it('should return NewApplicationStatus for default ApplicationStatus initial value', () => {
        const formGroup = service.createApplicationStatusFormGroup(sampleWithNewData);

        const applicationStatus = service.getApplicationStatus(formGroup) as any;

        expect(applicationStatus).toMatchObject(sampleWithNewData);
      });

      it('should return NewApplicationStatus for empty ApplicationStatus initial value', () => {
        const formGroup = service.createApplicationStatusFormGroup();

        const applicationStatus = service.getApplicationStatus(formGroup) as any;

        expect(applicationStatus).toMatchObject({});
      });

      it('should return IApplicationStatus', () => {
        const formGroup = service.createApplicationStatusFormGroup(sampleWithRequiredData);

        const applicationStatus = service.getApplicationStatus(formGroup) as any;

        expect(applicationStatus).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IApplicationStatus should not enable id FormControl', () => {
        const formGroup = service.createApplicationStatusFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewApplicationStatus should disable id FormControl', () => {
        const formGroup = service.createApplicationStatusFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
