import { Component, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    Button
  ],
  template: `
    <div class="flex w-full justify-content-end mt-2">
      <p-button
        type="button"
        label="Close"
        icon="pi pi-times"
        size="small" (onClick)="closeDialog()"/>
    </div>
  `,
  styles: ``
})
export class Footer {
  ref = inject(DynamicDialogRef);

  closeDialog() {
    this.ref.close();
  }
}
