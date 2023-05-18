import { Component } from '@angular/core';
import myList from 'src/store/mylists';


/**
 * My list page containing multiple lists of movies and shows, that show the user's saved items.
 */
@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.css']
})
export class MyListComponent {
    
    movies = myList.movies;
    shows = myList.shows;
}
