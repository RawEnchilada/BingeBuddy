import { environment } from "environment";
import { makeObservable } from "mobx";
import { computed, observable } from "mobx-angular";
import * as crypto from 'crypto-js';


enum SessionStatus{
    Active,
    Expired,
    Invalid
}


class API {
    get baseUrl(): string{return environment.apiUrl};

    @observable currentSession: string = '';

    // Local storage management and session expiration.
    constructor() {
        this.currentSession = localStorage.getItem('currentSession') || '';
        if(this.currentSession === null || this.currentSession === undefined)this.currentSession = '';
        
        // If we have a current session, check if it's expired.
        if(this.currentSession !== ''){
            // Check if the session is valid
            this.checkSessionStatus();
        }        

        makeObservable(this);
    }

    /**
     * Is the current session authorized and not expired.
     */
    @computed get isAuthorized() : boolean{
        return this.currentSession !== '';
    }

    /**
     * Check the session status.
     */
    async checkSessionStatus(): Promise<SessionStatus>{
        if(this.currentSession === '')return SessionStatus.Invalid;
        // Check if the session is valid
        const response = await fetch(`${this.baseUrl}/session`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Session-Token': this.currentSession
            }
        });
        const data = await response.json();
        switch(data.status){
            case 'active':
                return SessionStatus.Active;
            case 'expired':
                this.currentSession = '';
                localStorage.removeItem('currentSession');
                return SessionStatus.Expired;
            default:
                this.currentSession = '';
                localStorage.removeItem('currentSession');
                return SessionStatus.Invalid;
        }
    }

    /**
     * Create a new session.
     * @param password
     */
    async createSession(password: string): Promise<string>{
        let passwordHash = crypto.SHA256(password).toString(crypto.enc.Hex);
        const response = await fetch(`${this.baseUrl}/session`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({'passwordHash':passwordHash})
        });
        const data = await response.json();
        if(response.status == 200){
            this.currentSession = data.sessionToken;
            localStorage.setItem('currentSession', this.currentSession);
            return data.sessionToken;
        }
        else{
            console.error("Failed to create session.");
            return '';
        }
    }


    /**
     * Delete the current session.
     */
    async deleteSession(): Promise<boolean>{
        const response = await fetch(`${this.baseUrl}/session`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Session-Token': this.currentSession
            }
        });
        if(response.status == 200){
            this.currentSession = '';
            localStorage.removeItem('currentSession');
        }
        return response.status == 200;
    }

    movies = {
        parent: api,
        init(parent:API){
            this.parent = parent;
            return this;
        },
        /**
         * Get the list of top movies. 
         * @param page  The page number to get.
         */
        async top(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/top_rated?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of upcoming movies.
         * @param page  The page number to get.
         */
        async upcoming(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/upcoming?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of popular movies.
         * @param page  The page number to get.
         */
        async popular(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/popular?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the recommended movies.
         * @param movieId   The movie id to get recommendations for.
         * @param page  The page number to get.
         */
        async recommended(movieId:number,page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/${movieId}/recommendations?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        }
    }.init(this)


    shows = {
        parent: api,
        init(parent:API){
            this.parent = parent;
            return this;
        },
        

        /**
         * Get the list of top shows.
         * @param page  The page number to get.
         */
        async top(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/top_rated?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of popular shows.
         * @param page  The page number to get.
         */
        async popular(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/popular?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of upcoming shows.
         * @param page  The page number to get.
         */
        async upcoming(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/on_the_air?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the recommended shows.
         * @param showId    The show id to get recommendations for.
         * @param page  The page number to get.
         */
        async recommended(showId:number,page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/${showId}/recommendations?language=en-US&page=${page}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Session-Token': this.parent.currentSession
                }
            });
            const data = await response.json();
            return data;
        }
    }.init(this)



}
var api = new API();
export default api;