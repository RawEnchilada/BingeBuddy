import { Component, OnInit } from '@angular/core';
import { computed } from 'mobx-angular';
import api from 'src/api/api';

/**
 * Browse page containing multiple lists of movies and shows.
 */
@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent{
    
    movies = api.movies;
    shows = api.shows;


}
