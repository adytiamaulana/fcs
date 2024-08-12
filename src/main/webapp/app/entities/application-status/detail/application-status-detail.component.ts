import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IApplicationStatus } from '../application-status.model';

@Component({
  standalone: true,
  selector: 'jhi-application-status-detail',
  templateUrl: './application-status-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ApplicationStatusDetailComponent {
  applicationStatus = input<IApplicationStatus | null>(null);

  previousState(): void {
    window.history.back();
  }
}
