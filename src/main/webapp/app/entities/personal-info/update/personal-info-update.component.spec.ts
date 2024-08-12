import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject, from } from 'rxjs';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { ICardType } from 'app/entities/card-type/card-type.model';
import { CardTypeService } from 'app/entities/card-type/service/card-type.service';
import { IPersonalInfo } from '../personal-info.model';
import { PersonalInfoService } from '../service/personal-info.service';
import { PersonalInfoFormService } from './personal-info-form.service';

import { PersonalInfoUpdateComponent } from './personal-info-update.component';

describe('PersonalInfo Management Update Component', () => {
  let comp: PersonalInfoUpdateComponent;
  let fixture: ComponentFixture<PersonalInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let personalInfoFormService: PersonalInfoFormService;
  let personalInfoService: PersonalInfoService;
  let addressService: AddressService;
  let cardTypeService: CardTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonalInfoUpdateComponent],
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
      .overrideTemplate(PersonalInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PersonalInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    personalInfoFormService = TestBed.inject(PersonalInfoFormService);
    personalInfoService = TestBed.inject(PersonalInfoService);
    addressService = TestBed.inject(AddressService);
    cardTypeService = TestBed.inject(CardTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call address query and add missing value', () => {
      const personalInfo: IPersonalInfo = { id: 456 };
      const address: IAddress = { id: 24612 };
      personalInfo.address = address;

      const addressCollection: IAddress[] = [{ id: 21720 }];
      jest.spyOn(addressService, 'query').mockReturnValue(of(new HttpResponse({ body: addressCollection })));
      const expectedCollection: IAddress[] = [address, ...addressCollection];
      jest.spyOn(addressService, 'addAddressToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ personalInfo });
      comp.ngOnInit();

      expect(addressService.query).toHaveBeenCalled();
      expect(addressService.addAddressToCollectionIfMissing).toHaveBeenCalledWith(addressCollection, address);
      expect(comp.addressesCollection).toEqual(expectedCollection);
    });

    it('Should call cardType query and add missing value', () => {
      const personalInfo: IPersonalInfo = { id: 456 };
      const cardType: ICardType = { id: 20496 };
      personalInfo.cardType = cardType;

      const cardTypeCollection: ICardType[] = [{ id: 22441 }];
      jest.spyOn(cardTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: cardTypeCollection })));
      const expectedCollection: ICardType[] = [cardType, ...cardTypeCollection];
      jest.spyOn(cardTypeService, 'addCardTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ personalInfo });
      comp.ngOnInit();

      expect(cardTypeService.query).toHaveBeenCalled();
      expect(cardTypeService.addCardTypeToCollectionIfMissing).toHaveBeenCalledWith(cardTypeCollection, cardType);
      expect(comp.cardTypesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const personalInfo: IPersonalInfo = { id: 456 };
      const address: IAddress = { id: 29499 };
      personalInfo.address = address;
      const cardType: ICardType = { id: 4723 };
      personalInfo.cardType = cardType;

      activatedRoute.data = of({ personalInfo });
      comp.ngOnInit();

      expect(comp.addressesCollection).toContain(address);
      expect(comp.cardTypesCollection).toContain(cardType);
      expect(comp.personalInfo).toEqual(personalInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonalInfo>>();
      const personalInfo = { id: 123 };
      jest.spyOn(personalInfoFormService, 'getPersonalInfo').mockReturnValue(personalInfo);
      jest.spyOn(personalInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personalInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personalInfo }));
      saveSubject.complete();

      // THEN
      expect(personalInfoFormService.getPersonalInfo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(personalInfoService.update).toHaveBeenCalledWith(expect.objectContaining(personalInfo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonalInfo>>();
      const personalInfo = { id: 123 };
      jest.spyOn(personalInfoFormService, 'getPersonalInfo').mockReturnValue({ id: null });
      jest.spyOn(personalInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personalInfo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: personalInfo }));
      saveSubject.complete();

      // THEN
      expect(personalInfoFormService.getPersonalInfo).toHaveBeenCalled();
      expect(personalInfoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPersonalInfo>>();
      const personalInfo = { id: 123 };
      jest.spyOn(personalInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ personalInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(personalInfoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAddress', () => {
      it('Should forward to addressService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(addressService, 'compareAddress');
        comp.compareAddress(entity, entity2);
        expect(addressService.compareAddress).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCardType', () => {
      it('Should forward to cardTypeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(cardTypeService, 'compareCardType');
        comp.compareCardType(entity, entity2);
        expect(cardTypeService.compareCardType).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
