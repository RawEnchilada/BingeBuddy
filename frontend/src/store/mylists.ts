import { makeObservable, observable } from "mobx";
import api from "src/api/api";
import IList from "./ilist";


class List implements IList{
    @observable list: Array<any> = [];

    private localStorageKey: string;
    private getListRequest: () => Promise<any>;
    private addRequest: (id: number) => Promise<boolean>;
    private removeRequest: (id: number) => Promise<boolean>;
    
    constructor(localStorageKey: string, getList: () => Promise<any>, addToList: (id: number) => Promise<boolean>, removeFromList: (id: number) => Promise<boolean>){
        this.localStorageKey = localStorageKey;
        this.getListRequest = getList;
        this.addRequest = addToList;
        this.removeRequest = removeFromList;
        if (localStorage.getItem(localStorageKey) !== null) {
            this.list = JSON.parse(localStorage.getItem(localStorageKey) || '');
        }else{
            this.refresh();
        }
        makeObservable(this);
    }

    getList(page: number): Promise<any>{
        return new Promise((resolve, reject) => {
            resolve({results:this.list.slice((page-1)*20, page*20)});
        });
    }

    async add(data: any): Promise<boolean>{
        if(await this.addRequest(data)){
            if(!this.list.map((i)=>i.id).includes(data.id)){
                this.list.push(data);
                this.save();
            }
            return true;
        }
        return false;
    }
    
    async remove(id: number): Promise<boolean>{
        if(await this.removeRequest(id)){
            this.list = this.list.filter((item) => item.id !== id);
            this.save();
            return true;
        }
        return false;
    }
    
    async refresh(){
        this.list = await this.getListRequest();    
        if(this.list.length){
            this.save();
        }    
    }

    save(){
        const data = JSON.stringify(this.list);
        localStorage.setItem(this.localStorageKey, data);
    }

}



class MyList{

    movies = {
        watchlist: new List('mwatchlist',
            api.movies.getWatchlist.bind(api.movies), 
            api.movies.addToWatchlist.bind(api.movies),
            api.movies.removeFromWatchlist.bind(api.movies)
            ),
        favourites: new List('mfavorites',
            api.movies.getFavourites.bind(api.movies), 
            api.movies.addToFavourites.bind(api.movies),
            api.movies.removeFromFavourites.bind(api.movies)
            )
    }

    shows = {
        watchlist: new List('swatchlist',
            api.shows.getWatchlist.bind(api.shows),
            api.shows.addToWatchlist.bind(api.shows),
            api.shows.removeFromWatchlist.bind(api.shows)
            ),
        favourites: new List('sfavorites',
            api.shows.getFavourites.bind(api.shows),
            api.shows.addToFavourites.bind(api.shows),
            api.shows.removeFromFavourites.bind(api.shows)
            )
    }




}

var myList = new MyList();

export default myList;
