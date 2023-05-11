import { makeObservable, observable } from "mobx";
import api from "src/api/api";


export class List{
    @observable list: Array<any> = [];

    private localStorageKey: string;
    private getListFunction: () => Promise<any>;
    
    constructor(localStorageKey: string, getList: () => Promise<any>, addToList: (id: number) => Promise<boolean>){
        this.localStorageKey = localStorageKey;
        this.getListFunction = getList;
        this.add = addToList;
        if (localStorage.getItem(localStorageKey) !== null) {
            this.list = JSON.parse(localStorage.getItem(localStorageKey) || '');
        }else{
            this.refresh();
        }
        makeObservable(this);
    }

    add: (id: number) => Promise<boolean>;
    
    async refresh(){
        this.list = await this.getListFunction();        
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.list));
    }

}



class MyList{

    movies = {
        watchlist: new List('mwatchlist',api.movies.getWatchlist.bind(api.movies), api.addToWatchlist.bind(api.movies)),
        favorites: new List('mfavorites',api.movies.getFavourites.bind(api.movies), api.addToFavourites.bind(api.movies))
    }

    shows = {
        watchlist: new List('swatchlist',api.shows.getWatchlist.bind(api.shows), api.addToWatchlist.bind(api.shows)),
        favorites: new List('sfavorites',api.shows.getFavourites.bind(api.shows), api.addToFavourites.bind(api.shows))
    }




}

export var myList = new MyList();
