import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { makeObservable } from 'mobx';
import { observable } from 'mobx-angular';
import { CardsView } from '../baseClasses/cardsview.component';

/**
 * A vertically scrollable grid of cards.
 */
@Component({
  selector: 'app-cardgrid',
  templateUrl: './cardgrid.component.html',
  styleUrls: ['./cardgrid.component.css']
})
export class CardGridComponent extends CardsView implements AfterViewInit, OnDestroy {

    @ViewChild('list', {static: false}) list!: ElementRef;
    
    @observable atStart: boolean = true;

    private scrolled() {
        //load more if we're near the end
        if (this.list.nativeElement.scrollTop + this.list.nativeElement.clientHeight >= this.list.nativeElement.scrollHeight - 250) {
            this.loadMore();
        }
        if(this.list.nativeElement.scrollTop <= 100){
            this.atStart = true;
        } else {
            this.atStart = false;
        }
    }

    ngAfterViewInit() {
        //enable horizontal scrolling
        this.list.nativeElement.addEventListener("wheel", this.scrolled.bind(this));
        this.loadMore();
    }


    ngOnDestroy(){
        //remove scroll listener
        this.list.nativeElement.removeEventListener("wheel", this.scrolled.bind(this));
    }
}
