import { NgModule, inject } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { MyListComponent } from './mylist/mylist.component';
import { contentGuard, loginGuard } from './auth.guard';


  
const routes: Routes = [
    {path: '', component: LoginComponent, canActivate: [loginGuard()]},
    {path: 'browse', component: BrowseComponent, canActivate: [contentGuard()]},
    {path: 'mylist', component: MyListComponent, canActivate: [contentGuard()]}
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
