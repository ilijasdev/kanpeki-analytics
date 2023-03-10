import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AppService } from './app.service';
import { ContractsService } from './contracts.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { KeysPipe } from './components/pipes/keys-pipe';
import { SharedComponentsModule } from './components/shared-components.module';
import { DialogOverviewExampleDialog } from './components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    KeysPipe,
    DialogOverviewExampleDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    SharedComponentsModule
  ],
  providers: [AppService, ContractsService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
