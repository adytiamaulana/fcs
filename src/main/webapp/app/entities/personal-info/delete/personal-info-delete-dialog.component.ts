import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IPersonalInfo } from '../personal-info.model';
import { PersonalInfoService } from '../service/personal-info.service';

@Component({
  standalone: true,
  templateUrl: './personal-info-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PersonalInfoDeleteDialogComponent {
  personalInfo?: IPersonalInfo;

  protected personalInfoService = inject(PersonalInfoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personalInfoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
