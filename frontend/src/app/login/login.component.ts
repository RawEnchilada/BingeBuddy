import { Component } from '@angular/core';
import api from 'src/api/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    password: string = "";

    login() {
        api.createSession(this.password).then(data => {
            window.location.href = '/browse';
        });               
    }

}
