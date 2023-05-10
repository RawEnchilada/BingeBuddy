import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { MobxAngularModule } from 'mobx-angular';
import { BrowseComponent } from './browse/browse.component';
import { MyListComponent } from './mylist/mylist.component';
import { CardViewComponent } from './cardview/cardview.component';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    BrowseComponent,
    MyListComponent,
    CardViewComponent,
    CardComponent
  ],
  imports: [
    MobxAngularModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
