import { Component, Input, OnInit } from '@angular/core';
import { computed } from 'mobx';
import api from 'src/api/api';
import IList from 'src/store/ilist';
import myList from 'src/store/mylists';

@Component({
  selector: 'app-singleview',
  templateUrl: './singleview.component.html'
})
export abstract class SingleView{

    data: any = null;

    watchlist!: IList;
    favourites!: IList;

    isInWatchlist: boolean = false;
    isInFavourites: boolean = false;


    initLists(type:string){
        if(type === 'movies'){
            this.watchlist = myList.movies.watchlist;
            this.favourites = myList.movies.favourites;
        }else{
            this.watchlist = myList.shows.watchlist;
            this.favourites = myList.shows.favourites;
        }

        this.getIsInWatchlist();
        this.getIsInFavourites();
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
        if(!this.watchlist || !this.watchlist.list.find || this.data == null)return false;
        else this.isInWatchlist = (this.watchlist.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInWatchlist;
    }

    getIsInFavourites(): boolean{
        if(!this.favourites || !this.favourites.list.find || this.data == null)return false;
        else this.isInFavourites = (this.favourites.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInFavourites;
    }


}
