import { Component } from '@angular/core';
import api from 'src/api/api';
import { computed } from 'mobx-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    @computed get isAuthorized(): boolean{
        return api.isAuthorized;
    } 
}
