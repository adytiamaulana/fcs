import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPersonalInfo } from '../personal-info.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../personal-info.test-samples';

import { PersonalInfoService, RestPersonalInfo } from './personal-info.service';

const requireRestSample: RestPersonalInfo = {
  ...sampleWithRequiredData,
  createdAt: sampleWithRequiredData.createdAt?.format(DATE_FORMAT),
  updatedAt: sampleWithRequiredData.updatedAt?.format(DATE_FORMAT),
  deletedAt: sampleWithRequiredData.deletedAt?.format(DATE_FORMAT),
};

describe('PersonalInfo Service', () => {
  let service: PersonalInfoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPersonalInfo | IPersonalInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PersonalInfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a PersonalInfo', () => {
      const personalInfo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(personalInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PersonalInfo', () => {
      const personalInfo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(personalInfo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PersonalInfo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PersonalInfo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PersonalInfo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPersonalInfoToCollectionIfMissing', () => {
      it('should add a PersonalInfo to an empty array', () => {
        const personalInfo: IPersonalInfo = sampleWithRequiredData;
        expectedResult = service.addPersonalInfoToCollectionIfMissing([], personalInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personalInfo);
      });

      it('should not add a PersonalInfo to an array that contains it', () => {
        const personalInfo: IPersonalInfo = sampleWithRequiredData;
        const personalInfoCollection: IPersonalInfo[] = [
          {
            ...personalInfo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPersonalInfoToCollectionIfMissing(personalInfoCollection, personalInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PersonalInfo to an array that doesn't contain it", () => {
        const personalInfo: IPersonalInfo = sampleWithRequiredData;
        const personalInfoCollection: IPersonalInfo[] = [sampleWithPartialData];
        expectedResult = service.addPersonalInfoToCollectionIfMissing(personalInfoCollection, personalInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personalInfo);
      });

      it('should add only unique PersonalInfo to an array', () => {
        const personalInfoArray: IPersonalInfo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const personalInfoCollection: IPersonalInfo[] = [sampleWithRequiredData];
        expectedResult = service.addPersonalInfoToCollectionIfMissing(personalInfoCollection, ...personalInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const personalInfo: IPersonalInfo = sampleWithRequiredData;
        const personalInfo2: IPersonalInfo = sampleWithPartialData;
        expectedResult = service.addPersonalInfoToCollectionIfMissing([], personalInfo, personalInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(personalInfo);
        expect(expectedResult).toContain(personalInfo2);
      });

      it('should accept null and undefined values', () => {
        const personalInfo: IPersonalInfo = sampleWithRequiredData;
        expectedResult = service.addPersonalInfoToCollectionIfMissing([], null, personalInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(personalInfo);
      });

      it('should return initial array if no PersonalInfo is added', () => {
        const personalInfoCollection: IPersonalInfo[] = [sampleWithRequiredData];
        expectedResult = service.addPersonalInfoToCollectionIfMissing(personalInfoCollection, undefined, null);
        expect(expectedResult).toEqual(personalInfoCollection);
      });
    });

    describe('comparePersonalInfo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePersonalInfo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePersonalInfo(entity1, entity2);
        const compareResult2 = service.comparePersonalInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePersonalInfo(entity1, entity2);
        const compareResult2 = service.comparePersonalInfo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePersonalInfo(entity1, entity2);
        const compareResult2 = service.comparePersonalInfo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
