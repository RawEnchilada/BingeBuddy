import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import api from 'src/api/api';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
    query: string = '';
    type: string = '';

    requestMore: (((page:number) => Promise<any>) | null) = null;


    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        const _query = this.route.snapshot.paramMap.get('query');
        const _type = this.route.snapshot.paramMap.get('type');
        if(_query != null && _type != null){
            this.query = _query;
            this.type = _type;
            if(this.type === 'movies'){
                this.requestMore = async (pageId:number)=>{
                    return await api.movies.search(this.query, pageId);
                }
            }else{
                this.requestMore = async (pageId:number)=>{
                    return await api.shows.search(this.query, pageId);
                }
            }
        }
    }
}
