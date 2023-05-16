import { Component, Input, OnInit } from '@angular/core';
import { computed } from 'mobx';
import api from 'src/api/api';
import IList from 'src/store/ilist';
import myList from 'src/store/mylists';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {


    @Input() data: any = null;
    @Input() type: string = "movies";

    watchlist!: IList;
    favourites!: IList;

    private maxTitleLength: number = 40;

    fullTitle: string = "";
    title: string = "";
    imagePath: string = "";
    rating: number = 0;
    voteCount: number = 0;

    isInWatchlist: boolean = false;
    isInFavourites: boolean = false;
    
    
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
    
            if(this.type === 'movies'){
                this.watchlist = myList.movies.watchlist;
                this.favourites = myList.movies.favourites;
            }else{
                this.watchlist = myList.shows.watchlist;
                this.favourites = myList.shows.favourites;
            }

            this.getIsInWatchlist();
            this.getIsInFavourites();
        }

    }

    toggleWatchlist(){
        (async () => {
            if(this.isInWatchlist){
                await this.watchlist.remove(this.data.id);
            }else{
                const item = {
                    id: this.data.id,
                    title: this.data.title,
                    name: this.data.name,
                    poster_path: this.data.poster_path,
                    vote_average: this.data.vote_average,
                    vote_count: this.data.vote_count
                };
                await this.watchlist.add(item);
            }
        }).bind(this)().then(()=>{
            this.getIsInWatchlist();
        });
    }

    toggleFavourite(){
        (async () => {
            if(this.isInFavourites){
                await this.favourites.remove(this.data.id);
            }else{
                const item = {
                    id: this.data.id,
                    title: this.data.title,
                    name: this.data.name,
                    poster_path: this.data.poster_path,
                    vote_average: this.data.vote_average,
                    vote_count: this.data.vote_count
                };
                await this.favourites.add(item);
            }
        }).bind(this)().then(()=>{
            this.getIsInFavourites();
        });
    }

    getIsInWatchlist(): boolean{
        if(!this.watchlist || !this.watchlist.list.find)return false;
        else this.isInWatchlist = (this.watchlist.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInWatchlist;
    }

    getIsInFavourites(): boolean{
        if(!this.favourites || !this.favourites.list.find)return false;
        else this.isInFavourites = (this.favourites.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInFavourites;
    }


}
