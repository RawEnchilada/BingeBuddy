const fs = require('fs');


/**
 * Represents a list of items.
 */
class List{

    /**
     * Returns an array of items in the list.
     */
    get items(){
        return this._items;
    }

    constructor(path,items){
        this._path = path;
        this._items = items;
    }

    /**
     * Adds an item to the list.
     * @param {Object} data The item to add.
     */
    add(data){
        if(!this._items.map((i)=>i.id).includes(data.id)){
            this._items.push(data);
            this.save();
        }
    }

    /**
     * Removes an item from the list.
     * @param {Number} id The id of the item to remove.
     */
    remove(id){
        this._items = this._items.filter((i) => i.id !== id);
        this.save();
    }

    /**
     * Saves the list to the file system.
     */
    save(){
        const data = JSON.stringify(this._items);
        if(!fs.existsSync('./data')){
            fs.mkdirSync('./data');
        }
        fs.writeFileSync(this._path,data);
    }

    /**
     * Loads a list from the file system.
     * @param {String} path The path to the list.
     */
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