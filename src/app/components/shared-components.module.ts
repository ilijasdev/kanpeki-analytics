import { NgModule } from '@angular/core';
import { KaeSpinnerComponent } from './loader/kae-loader.component';

@NgModule({
  declarations: [
    KaeSpinnerComponent
  ],
  exports: [
    KaeSpinnerComponent
  ]
})
export class SharedComponentsModule { }
