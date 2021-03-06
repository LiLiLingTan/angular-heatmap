import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HIGHCHARTS_MODULES, ChartModule } from 'angular-highcharts';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SigmaContourplotComponent } from './contour-map/contour-map.component';
import { ConfigService } from './config.service';

@NgModule({
  imports:      [ BrowserModule, ChartModule, FormsModule, HttpClientModule ],
  declarations: [ AppComponent, SigmaContourplotComponent ],
  providers: [ ConfigService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
