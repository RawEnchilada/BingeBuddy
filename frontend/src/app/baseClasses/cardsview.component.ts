import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { makeObservable, observable } from "mobx";
import api from "src/api/api";


/**
 * Base class for listing multiple cards.
 */
@Component({
  selector: 'app-cardsview',
  templateUrl: './cardsview.component.html',
})
export abstract class CardsView{
    @Input() title: string = 'Movies and Shows';
    @Input() type: string = 'movies';
    @Input() sourceFunction: (((page:number) => Promise<any>) | null) = null;


    items: any[] = [];

    protected isLoading: boolean = false;
    protected pagesLoaded: number = 0;
    protected maxPages: number = 10;

    constructor() { 
        makeObservable(this);
    }

    /**
     * Empty the list.
     */
    public emptyList(){
        this.items = [];
        this.pagesLoaded = 0;
        this.maxPages = 10;
    }

    /**
     * Load more items.
     */
    public loadMore() {
        if (!this.isLoading && api.isAuthorized) {
            this.isLoading = true;
            if (this.sourceFunction != null && this.pagesLoaded < this.maxPages) {
                this.sourceFunction(this.pagesLoaded + 1).then((data:any) => {
                    if ( data.error ){
                        api.checkSessionStatus();
                        console.error(data.error);
                    }else{
                        this.items = this.items.concat(data.results);
                        this.maxPages = Math.min(data.total_pages,10);
                        this.pagesLoaded++;
                    }
                    this.isLoading = false;
                });
            }
        }
    }
}