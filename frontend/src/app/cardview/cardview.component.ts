import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { computed, makeObservable, observable } from 'mobx';

@Component({
  selector: 'app-cardview',
  templateUrl: './cardview.component.html',
  styleUrls: ['./cardview.component.css']
})
export class CardViewComponent implements AfterViewInit, OnDestroy {

    @Input() title: string = 'Movies and Shows';
    @Input() sourceFunction: (((page:number) => Promise<any>) | null) = null;

    @ViewChild('list', {static: false}) list!: ElementRef;

    items: any[] = [];

    @observable atStart: boolean = true;
    @observable atEnd: boolean = false;

    private isLoading: boolean = false;
    private pagesLoaded: number = 0;
    private maxPages: number = 10;

    constructor() { 
        makeObservable(this);
    }

    private scroll(amount:number) {
        this.list.nativeElement.scroll({
            left: this.list.nativeElement.scrollLeft + amount,
            behavior: 'smooth'
        });
        //load more if we're near the end
        if (this.list.nativeElement.scrollLeft + this.list.nativeElement.clientWidth >= this.list.nativeElement.scrollWidth - 250) {
            this.loadMore();
        }
        if(this.list.nativeElement.scrollLeft <= 100){
            this.atStart = true;
        } else {
            this.atStart = false;
        }
        if(this.list.nativeElement.scrollLeft + this.list.nativeElement.clientWidth >= this.list.nativeElement.scrollWidth - 100){
            this.atEnd = true;
        } else {
            this.atEnd = false;
        }
    }

    /**
     * Handle horizontal scrolling.
     * @param evt
     */
    horizontalScroll(evt:any) {
        evt.preventDefault();
        const amountX = evt.deltaY * 2;
        this.scroll(amountX);
    }

    /**
     * Scroll the cardview to the left.
     */
    scrollLeft() {
        this.scroll(-500);
    }

    /**
     * Scroll the cardview to the right.
     */
    scrollRight() {
        this.scroll(500);
    }

    /**
     * Load more items.
     */
    loadMore() {
        if (!this.isLoading) {
            this.isLoading = true;
            if (this.sourceFunction != null && this.pagesLoaded < this.maxPages) {
                this.sourceFunction(this.pagesLoaded + 1).then((data:any) => {
                    this.items = this.items.concat(data.results);
                    this.maxPages = Math.min(data.total_pages,10);
                    this.pagesLoaded++;
                    this.isLoading = false;
                });
            }
        }
    }


    ngAfterViewInit() {
        //enable horizontal scrolling
        this.list.nativeElement.addEventListener("wheel", this.horizontalScroll.bind(this));
        this.loadMore();
    }


    ngOnDestroy(){
        //remove scroll listener
        this.list.nativeElement.removeEventListener("wheel", this.horizontalScroll.bind(this));
    }


    

}
