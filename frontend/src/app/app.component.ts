import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import api, { SessionStatus } from 'src/api/api';
import { computed } from 'mobx-angular';
import { autorun } from 'mobx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @computed get isAuthorized(): boolean{
        return api.isAuthorized;
    }

    @ViewChild('dialog', {static: false}) dialog!: ElementRef;


    toLoginView(){
        this.dialog.nativeElement.close();
        window.location.href = '/';
    }

    ngOnInit(){

        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        } else {
            window.onbeforeunload = function () {
                window.scrollTo(0, 0);
            }
        }

        api.addSessionListener(((valid: boolean) => {
            if(this.dialog){
                if(!valid){
                    this.dialog.nativeElement.showModal();
                } else {
                    this.dialog.nativeElement.close();
                }
            }
        }).bind(this));
    }

    openPage(page: string){
        window.open(page, '_blank');
    }
}
