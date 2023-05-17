import { Component } from '@angular/core';
import api from 'src/api/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    searchType: string = 'movies';
    searchQuery: string = '';

    search(){
        api.checkSessionStatus().then(data => {
            if(api.isAuthorized && this.searchQuery.length > 0){
                window.location.href = `/search/${this.searchType}/${this.searchQuery}`;
            }
        });        
    }

    logout() {
        api.deleteSession().then(data => {
            if(data){
                window.location.href = '/';
            }
        });
    }

}
