import { Component, Input, OnInit } from '@angular/core';
import { computed } from 'mobx';
import api from 'src/api/api';
import IList from 'src/store/ilist';
import myList from 'src/store/mylists';
import { SingleView } from '../baseClasses/singleview.component';


/**
 * Small card showing data of a single movie or show.
 */
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent extends SingleView implements OnInit {


    @Input() override data: any = null;
    @Input() type: string = "movies";

    private maxTitleLength: number = 40;

    fullTitle: string = "";
    title: string = "";
    imagePath: string = "";
    rating: number = 0;
    voteCount: number = 0;

    get detailsUrl(): string{
        return `/${this.type}/${this.data.id}`;
    }    
    
    ngOnInit(): void {
        if(this.data != null && api.isAuthorized){
            this.fullTitle = (this.data.title ? this.data.title : this.data.name);
            this.title = this.fullTitle;
            if(this.title.length > this.maxTitleLength){
                this.title = this.title.substring(0, this.maxTitleLength - 3) + '...';
            }
            this.imagePath = this.data.poster_path ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : 'assets/missing.jpg';
            this.voteCount = this.data.vote_count;
            this.rating = this.data.vote_average;
    
            this.initLists(this.type);
        }

    }


}
