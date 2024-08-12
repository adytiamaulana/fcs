import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IPersonalInfo } from 'app/entities/personal-info/personal-info.model';
import { PersonalInfoService } from 'app/entities/personal-info/service/personal-info.service';
import { IApplicationStatus } from 'app/entities/application-status/application-status.model';
import { ApplicationStatusService } from 'app/entities/application-status/service/application-status.service';
import { ITaskHistory } from '../task-history.model';
import { TaskHistoryService } from '../service/task-history.service';
import { TaskHistoryFormService } from './task-history-form.service';

import { TaskHistoryUpdateComponent } from './task-history-update.component';

describe('TaskHistory Management Update Component', () => {
  let comp: TaskHistoryUpdateComponent;
  let fixture: ComponentFixture<TaskHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let taskHistoryFormService: TaskHistoryFormService;
  let taskHistoryService: TaskHistoryService;
  let personalInfoService: PersonalInfoService;
  let applicationStatusService: ApplicationStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskHistoryUpdateComponent],
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
      .overrideTemplate(TaskHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TaskHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskHistoryFormService = TestBed.inject(TaskHistoryFormService);
    taskHistoryService = TestBed.inject(TaskHistoryService);
    personalInfoService = TestBed.inject(PersonalInfoService);
    applicationStatusService = TestBed.inject(ApplicationStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call personalInfo query and add missing value', () => {
      const taskHistory: ITaskHistory = { id: 456 };
      const personalInfo: IPersonalInfo = { id: 30693 };
      taskHistory.personalInfo = personalInfo;

      const personalInfoCollection: IPersonalInfo[] = [{ id: 17604 }];
      jest.spyOn(personalInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: personalInfoCollection })));
      const expectedCollection: IPersonalInfo[] = [personalInfo, ...personalInfoCollection];
      jest.spyOn(personalInfoService, 'addPersonalInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ taskHistory });
      comp.ngOnInit();

      expect(personalInfoService.query).toHaveBeenCalled();
      expect(personalInfoService.addPersonalInfoToCollectionIfMissing).toHaveBeenCalledWith(personalInfoCollection, personalInfo);
      expect(comp.personalInfosCollection).toEqual(expectedCollection);
    });

    it('Should call applicationStatus query and add missing value', () => {
      const taskHistory: ITaskHistory = { id: 456 };
      const applicationStatus: IApplicationStatus = { id: 5792 };
      taskHistory.applicationStatus = applicationStatus;

      const applicationStatusCollection: IApplicationStatus[] = [{ id: 24019 }];
      jest.spyOn(applicationStatusService, 'query').mockReturnValue(of(new HttpResponse({ body: applicationStatusCollection })));
      const expectedCollection: IApplicationStatus[] = [applicationStatus, ...applicationStatusCollection];
      jest.spyOn(applicationStatusService, 'addApplicationStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ taskHistory });
      comp.ngOnInit();

      expect(applicationStatusService.query).toHaveBeenCalled();
      expect(applicationStatusService.addApplicationStatusToCollectionIfMissing).toHaveBeenCalledWith(
        applicationStatusCollection,
        applicationStatus,
      );
      expect(comp.applicationStatusesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const taskHistory: ITaskHistory = { id: 456 };
      const personalInfo: IPersonalInfo = { id: 3177 };
      taskHistory.personalInfo = personalInfo;
      const applicationStatus: IApplicationStatus = { id: 3056 };
      taskHistory.applicationStatus = applicationStatus;

      activatedRoute.data = of({ taskHistory });
      comp.ngOnInit();

      expect(comp.personalInfosCollection).toContain(personalInfo);
      expect(comp.applicationStatusesCollection).toContain(applicationStatus);
      expect(comp.taskHistory).toEqual(taskHistory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskHistory>>();
      const taskHistory = { id: 123 };
      jest.spyOn(taskHistoryFormService, 'getTaskHistory').mockReturnValue(taskHistory);
      jest.spyOn(taskHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskHistory }));
      saveSubject.complete();

      // THEN
      expect(taskHistoryFormService.getTaskHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(taskHistory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskHistory>>();
      const taskHistory = { id: 123 };
      jest.spyOn(taskHistoryFormService, 'getTaskHistory').mockReturnValue({ id: null });
      jest.spyOn(taskHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: taskHistory }));
      saveSubject.complete();

      // THEN
      expect(taskHistoryFormService.getTaskHistory).toHaveBeenCalled();
      expect(taskHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITaskHistory>>();
      const taskHistory = { id: 123 };
      jest.spyOn(taskHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ taskHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskHistoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePersonalInfo', () => {
      it('Should forward to personalInfoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(personalInfoService, 'comparePersonalInfo');
        comp.comparePersonalInfo(entity, entity2);
        expect(personalInfoService.comparePersonalInfo).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareApplicationStatus', () => {
      it('Should forward to applicationStatusService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicationStatusService, 'compareApplicationStatus');
        comp.compareApplicationStatus(entity, entity2);
        expect(applicationStatusService.compareApplicationStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
