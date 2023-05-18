import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import api, { SessionStatus } from 'src/api/api';
import { computed } from 'mobx-angular';
import { autorun } from 'mobx';

/**
 * Main component of the application.
 */
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

    /**
     * Navigate to the login page.
     */
    toLoginView(){
        this.dialog.nativeElement.close();
        window.location.href = '/';
    }

    ngOnInit(){
        // Reset scroll position on page change
        if (history.scrollRestoration) {
            history.scrollRestoration = 'manual';
        } else {
            window.onbeforeunload = function () {
                window.scrollTo(0, 0);
            }
        }
        // Check session status and redirect to login if not authorized
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

    /**
     * Open the given page in a new tab.
     * @param page The page to open.
     */
    openPage(page: string){
        window.open(page, '_blank');
    }
}
