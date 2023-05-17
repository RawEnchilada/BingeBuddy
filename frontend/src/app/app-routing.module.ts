import { NgModule, inject } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BrowseComponent } from './browse/browse.component';
import { MyListComponent } from './mylist/mylist.component';
import { contentGuard, loginGuard } from './auth.guard';
import { DetailsComponent } from './details/details.component';
import { SearchComponent } from './search/search.component';


  
const routes: Routes = [
    {path: '', component: LoginComponent, canActivate: [loginGuard()]},
    {path: 'browse', component: BrowseComponent, canActivate: [contentGuard()]},
    {path: 'mylist', component: MyListComponent, canActivate: [contentGuard()]},
    {path: 'search/:type/:query', component: SearchComponent, canActivate: [contentGuard()]},
    {path: ':type/:id', component: DetailsComponent, canActivate: [contentGuard()]},
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
