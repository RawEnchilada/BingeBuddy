import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {


    @Input() data: any = null;

    private maxTitleLength: number = 40;

    fullTitle: string = "";
    title: string = "";
    imagePath: string = "";
    rating: number = 0;
    voteCount: number = 0;
    
    
    ngOnInit(): void {
        this.fullTitle = (this.data.title ? this.data.title : this.data.name);
        this.title = this.fullTitle;
        if(this.title.length > this.maxTitleLength){
            this.title = this.title.substring(0, this.maxTitleLength - 3) + '...';
        }
        this.imagePath = this.data.poster_path ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : 'assets/missing.jpg';
        this.voteCount = this.data.vote_count;
        this.rating = this.data.vote_average;
    }

}
