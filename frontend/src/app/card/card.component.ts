import { Component, Input, OnInit } from '@angular/core';
import { computed } from 'mobx';
import { List, myList } from 'src/store/mylists';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {


    @Input() data: any = null;
    @Input() type: string = "movie";

    watchlist!: List;
    favorites!: List;

    private maxTitleLength: number = 40;

    fullTitle: string = "";
    title: string = "";
    imagePath: string = "";
    rating: number = 0;
    voteCount: number = 0;
    
    
    ngOnInit(): void {
        this.fullTitle = (this.data.title ? this.data.title : this.data.name);
        this.title = this.fullTitle;
        if(this.title.length > this.maxTitleLength){
            this.title = this.title.substring(0, this.maxTitleLength - 3) + '...';
        }
        this.imagePath = this.data.poster_path ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : 'assets/missing.jpg';
        this.voteCount = this.data.vote_count;
        this.rating = this.data.vote_average;

        if(this.type === 'movie'){
            this.watchlist = myList.movies.watchlist;
            this.favorites = myList.movies.favorites;
        }else{
            this.watchlist = myList.shows.watchlist;
            this.favorites = myList.shows.favorites;
        }

    }

    toggleWatchlist(){
        if(this.isInWatchlist){
            //this.watchlist.remove(this.data.id);
        }else{
            this.watchlist.add(this.data.id);
        }
    }

    @computed get isInWatchlist(): boolean{
        return this.watchlist.list.find((item: any) => item.id === this.data.id) !== undefined;
    }

    @computed get isInFavorites(): boolean{
        return this.favorites.list.find((item: any) => item.id === this.data.id) !== undefined;
    }


}
