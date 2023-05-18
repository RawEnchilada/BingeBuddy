import { Component, Input, OnInit } from '@angular/core';
import { computed } from 'mobx';
import api from 'src/api/api';
import IList from 'src/store/ilist';
import myList from 'src/store/mylists';

/**
 * Base class for a single media.
 */
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

    /**
     * Initializes the lists.
     * @param type 'movies' or 'shows'
     */
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

    /**
     * Set if this media is in the watchlist or not.
     */
    toggleWatchlist(event:any){
        event.stopPropagation();
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

    /**
     * Set if this media is in the favourites or not.
     */
    toggleFavourite(event:any){
        event.stopPropagation();
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

    /**
     * @returns true if this media is in the watchlist, false otherwise.
     */
    getIsInWatchlist(): boolean{
        if(!this.watchlist || !this.watchlist.list.find || this.data == null)return false;
        else this.isInWatchlist = (this.watchlist.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInWatchlist;
    }

    /**
     * @returns true if this media is in the favourites, false otherwise.
     */
    getIsInFavourites(): boolean{
        if(!this.favourites || !this.favourites.list.find || this.data == null)return false;
        else this.isInFavourites = (this.favourites.list.find((item: any) => item.id === this.data.id) !== undefined);
        return this.isInFavourites;
    }


}
