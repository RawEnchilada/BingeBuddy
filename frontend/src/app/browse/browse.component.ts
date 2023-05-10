import { Component, OnInit } from '@angular/core';
import api from 'src/api/api';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
    
    movies = api.movies;
    shows = api.shows;
    


    ngOnInit(): void {
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        } else {
            window.onbeforeunload = function () {
                window.scrollTo(0, 0);
            }
        }
    }



}
