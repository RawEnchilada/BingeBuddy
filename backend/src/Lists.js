const fs = require('fs');

class List{

    get items(){
        return this._items;
    }

    constructor(path,items){
        this._path = path;
        this._items = items;
    }

    add(data){
        if(!this._items.map((i)=>i.id).includes(data.id)){
            this._items.push(data);
            this.save();
        }
    }

    remove(id){
        this._items = this._items.filter((i) => i.id !== id);
        this.save();
    }

    save(){
        const data = JSON.stringify(this._items);
        if(!fs.existsSync('./data')){
            fs.mkdirSync('./data');
        }
        fs.writeFileSync(this._path,data);
    }

    static load(path){
        try{
            const data = JSON.parse(fs.readFileSync(path));
            return new List(path,data);   
        } catch (e) {
            console.log(`Error while loading list from ${path}: ${e}`);
            return new List(path,[]);
        }
    }

}


module.exports = {
    List: List,
    myList: {
        movies:{
            watchlist: List.load('./data/moviesWatchlist.json'),
            favourites: List.load('./data/moviesFavourites.json')
        },
        shows:{
            watchlist: List.load('./data/showsWatchlist.json'),
            favourites: List.load('./data/showsFavourites.json')
        }
    }
};