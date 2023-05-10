import { Component } from '@angular/core';
import api from 'src/api/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    logout() {
        api.deleteSession().then(data => {
            if(data){
                window.location.href = '/';
            }
        });
    }

}
