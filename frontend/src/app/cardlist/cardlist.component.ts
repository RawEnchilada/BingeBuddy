import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { computed, makeObservable, observable } from 'mobx';
import api from 'src/api/api';
import { CardsView } from '../baseClasses/cardsview.component';

@Component({
  selector: 'app-cardlist',
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.css']
})
export class CardListComponent extends CardsView implements AfterViewInit, OnDestroy {

    @ViewChild('list', {static: false}) list!: ElementRef;

    @observable atStart: boolean = true;
    @observable atEnd: boolean = false;

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
        if(evt.deltaX == 0){
            evt.preventDefault();
            const amountX = evt.deltaY * 2;
            this.scroll(amountX);
        }
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
