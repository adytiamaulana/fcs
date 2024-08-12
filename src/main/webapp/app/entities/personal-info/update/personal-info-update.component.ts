import { Component, inject, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAddress } from 'app/entities/address/address.model';
import { AddressService } from 'app/entities/address/service/address.service';
import { ICardType } from 'app/entities/card-type/card-type.model';
import { CardTypeService } from 'app/entities/card-type/service/card-type.service';
import { PersonalInfoService } from '../service/personal-info.service';
import { IPersonalInfo } from '../personal-info.model';
import { PersonalInfoFormService, PersonalInfoFormGroup } from './personal-info-form.service';

@Component({
  standalone: true,
  selector: 'jhi-personal-info-update',
  templateUrl: './personal-info-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PersonalInfoUpdateComponent implements OnInit {
  isSaving = false;
  personalInfo: IPersonalInfo | null = null;

  addressesCollection: IAddress[] = [];
  cardTypesCollection: ICardType[] = [];

  protected personalInfoService = inject(PersonalInfoService);
  protected personalInfoFormService = inject(PersonalInfoFormService);
  protected addressService = inject(AddressService);
  protected cardTypeService = inject(CardTypeService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PersonalInfoFormGroup = this.personalInfoFormService.createPersonalInfoFormGroup();

  compareAddress = (o1: IAddress | null, o2: IAddress | null): boolean => this.addressService.compareAddress(o1, o2);

  compareCardType = (o1: ICardType | null, o2: ICardType | null): boolean => this.cardTypeService.compareCardType(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ personalInfo }) => {
      this.personalInfo = personalInfo;
      if (personalInfo) {
        this.updateForm(personalInfo);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const personalInfo = this.personalInfoFormService.getPersonalInfo(this.editForm);
    if (personalInfo.id !== null) {
      this.subscribeToSaveResponse(this.personalInfoService.update(personalInfo));
    } else {
      this.subscribeToSaveResponse(this.personalInfoService.create(personalInfo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPersonalInfo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(personalInfo: IPersonalInfo): void {
    this.personalInfo = personalInfo;
    this.personalInfoFormService.resetForm(this.editForm, personalInfo);

    this.addressesCollection = this.addressService.addAddressToCollectionIfMissing<IAddress>(
      this.addressesCollection,
      personalInfo.address,
    );
    this.cardTypesCollection = this.cardTypeService.addCardTypeToCollectionIfMissing<ICardType>(
      this.cardTypesCollection,
      personalInfo.cardType,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.addressService
      .query({ filter: 'personalinfo-is-null' })
      .pipe(map((res: HttpResponse<IAddress[]>) => res.body ?? []))
      .pipe(
        map((addresses: IAddress[]) =>
          this.addressService.addAddressToCollectionIfMissing<IAddress>(addresses, this.personalInfo?.address),
        ),
      )
      .subscribe((addresses: IAddress[]) => (this.addressesCollection = addresses));

    this.cardTypeService
      .query({ filter: 'personalinfo-is-null' })
      .pipe(map((res: HttpResponse<ICardType[]>) => res.body ?? []))
      .pipe(
        map((cardTypes: ICardType[]) =>
          this.cardTypeService.addCardTypeToCollectionIfMissing<ICardType>(cardTypes, this.personalInfo?.cardType),
        ),
      )
      .subscribe((cardTypes: ICardType[]) => (this.cardTypesCollection = cardTypes));
  }
}
