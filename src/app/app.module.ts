import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BitcoinGraphComponent } from './components/bitcoin-graph/bitcoin-graph.component';
import 'chartjs-adapter-moment';
import { NaviComponent } from './components/navi/navi.component';


@NgModule({
  declarations: [
    AppComponent,
    BitcoinGraphComponent,
    NaviComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
