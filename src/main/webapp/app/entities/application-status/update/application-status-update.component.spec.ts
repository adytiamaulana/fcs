import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { ApplicationStatusService } from '../service/application-status.service';
import { IApplicationStatus } from '../application-status.model';
import { ApplicationStatusFormService } from './application-status-form.service';

import { ApplicationStatusUpdateComponent } from './application-status-update.component';

describe('ApplicationStatus Management Update Component', () => {
  let comp: ApplicationStatusUpdateComponent;
  let fixture: ComponentFixture<ApplicationStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let applicationStatusFormService: ApplicationStatusFormService;
  let applicationStatusService: ApplicationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApplicationStatusUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ApplicationStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    applicationStatusFormService = TestBed.inject(ApplicationStatusFormService);
    applicationStatusService = TestBed.inject(ApplicationStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const applicationStatus: IApplicationStatus = { id: 456 };

      activatedRoute.data = of({ applicationStatus });
      comp.ngOnInit();

      expect(comp.applicationStatus).toEqual(applicationStatus);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationStatus>>();
      const applicationStatus = { id: 123 };
      jest.spyOn(applicationStatusFormService, 'getApplicationStatus').mockReturnValue(applicationStatus);
      jest.spyOn(applicationStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationStatus }));
      saveSubject.complete();

      // THEN
      expect(applicationStatusFormService.getApplicationStatus).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(applicationStatusService.update).toHaveBeenCalledWith(expect.objectContaining(applicationStatus));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationStatus>>();
      const applicationStatus = { id: 123 };
      jest.spyOn(applicationStatusFormService, 'getApplicationStatus').mockReturnValue({ id: null });
      jest.spyOn(applicationStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationStatus: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: applicationStatus }));
      saveSubject.complete();

      // THEN
      expect(applicationStatusFormService.getApplicationStatus).toHaveBeenCalled();
      expect(applicationStatusService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IApplicationStatus>>();
      const applicationStatus = { id: 123 };
      jest.spyOn(applicationStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ applicationStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(applicationStatusService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
