import { Component } from '@angular/core';
import myList from 'src/store/mylists';

@Component({
  selector: 'app-mylist',
  templateUrl: './mylist.component.html',
  styleUrls: ['./mylist.component.css']
})
export class MyListComponent {
    
    movies = myList.movies;
    shows = myList.shows;
}
