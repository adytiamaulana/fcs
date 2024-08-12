import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IPersonalInfo } from '../personal-info.model';

@Component({
  standalone: true,
  selector: 'jhi-personal-info-detail',
  templateUrl: './personal-info-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PersonalInfoDetailComponent {
  personalInfo = input<IPersonalInfo | null>(null);

  previousState(): void {
    window.history.back();
  }
}
