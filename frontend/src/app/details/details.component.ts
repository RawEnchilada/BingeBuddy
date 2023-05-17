import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import api from 'src/api/api';
import IList from 'src/store/ilist';
import myList from 'src/store/mylists';
import { SingleView } from '../baseClasses/singleview.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent extends SingleView implements OnInit {
    private mediaId: number = -1;
    mediaType: string = '';
    imagePath: string = "";
    title: string = "";
    providers: Array<any> = [];
  
    constructor(private route: ActivatedRoute) {
        super();
    }

    getMoreLikeThis: (((page:number) => Promise<any>) | null) = null;
  
    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        let type = this.route.snapshot.paramMap.get('type');
        if(id != null && type != null){
            this.mediaId = Number.parseInt(id);
            this.mediaType = type;   
            if(api.isAuthorized){
                let target = null;
                if(this.mediaType === 'movies'){
                    target = api.movies;
                    this.getMoreLikeThis = async (pageId:number)=>{
                        return await api.movies.getRecommended(this.mediaId, pageId);
                    }
                }else{
                    target = api.shows;
                    this.getMoreLikeThis = async (pageId:number)=>{
                        return await api.shows.getRecommended(this.mediaId, pageId);
                    }
                }
                target.getDetails(this.mediaId).then((data: any) => {
                    this.data = data;
                    this.imagePath = this.toSmallImg(this.data.poster_path);
                    this.title = data.title ? data.title : data.name;
                    if(data.providers.HU){
                        this.providers = data.providers.HU.flatrate;
                    }
                    this.initLists(this.mediaType);
                });
            }    
        }
    }

    toSmallImg(url: string | null): string{
        return (url&&url.length>0) ? `https://image.tmdb.org/t/p/w500${url}` : 'assets/missing.jpg'
    }

    toMiniImg(url: string | null): string{
        return (url&&url.length>0) ? `https://image.tmdb.org/t/p/w92${url}` : 'assets/missing.jpg'
    }
}