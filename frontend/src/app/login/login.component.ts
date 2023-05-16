import { Component } from '@angular/core';
import api from 'src/api/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    password: string = "";
    error: string = "";
    showPassword: boolean = false;

    toggleShowPassword() {
        this.showPassword = !this.showPassword;
    }

    login() {
        if (this.password.length < 1) {
            this.error = "Please enter a password";
            return;
        }
        
        api.createSession(this.password)
        .then(data => {
            if(data.status == 511){
                this.error = `User needs to be authorized, please follow this link: ${data.url}`;
                window.open(data.url);
            }else{
                window.location.href = '/browse';
            }
        }).catch(err => {
            this.error = err.error;
        });
    }

}
