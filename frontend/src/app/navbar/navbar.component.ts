import { Component } from '@angular/core';
import api from 'src/api/api';

/**
 * Navigation bar with search and logout.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

    searchType: string = 'movies';
    searchQuery: string = '';

    /**
     * Navigate to the search page with the given query.
     */
    search(){
        api.checkSessionStatus().then(data => {
            if(api.isAuthorized && this.searchQuery.length > 0){
                window.location.href = `/search/${this.searchType}/${this.searchQuery}`;
            }
        });        
    }

    /**
     * Logout the user.
     */
    logout() {
        api.deleteSession().then(data => {
            if(data){
                window.location.href = '/';
            }
        });
    }

}
