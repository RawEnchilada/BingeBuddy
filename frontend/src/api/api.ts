import { environment } from "environment";
import { makeObservable } from "mobx";
import { computed, observable } from "mobx-angular";
import * as crypto from 'crypto-js';


export enum SessionStatus{
    Active,
    Expired,
    Invalid
}


class API {
    get baseUrl(): string{return environment.apiUrl};

    get headers(){
        return {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Session-Token': this.currentSession
        };
    }

    @observable currentSession: string = '';
    private sessionListeners: ((valid: boolean) => void)[] = [];

    // Local storage management and session expiration.
    constructor() {
        let token = localStorage.getItem('currentSession') || '';
        if(token === null || token === undefined)token = '';
        this.setCurrentSession(token);
        
        // If we have a current session, check if it's expired.
        if(this.currentSession !== ''){
            // Check if the session is valid
            this.checkSessionStatus();
        }

        makeObservable(this);
    }

    /**
     * Add a session listener.
     * @param callback
     */
    addSessionListener(callback: (valid: boolean) => void){
        this.sessionListeners.push(callback);
    }

    /**
     * Remove a session listener.
     * @param callback
     */
    removeSessionListener(callback: (valid: boolean) => void){
        const index = this.sessionListeners.indexOf(callback);
        if(index > -1){
            this.sessionListeners.splice(index, 1);
        }
    }

    /**
     * Set the current session token and notify listeners.
     * @param sessionToken
     */
    private setCurrentSession(sessionToken: string){
        this.currentSession = sessionToken;
        for (let i = 0; i < this.sessionListeners.length; i++) {
            this.sessionListeners[i](sessionToken !== '');
        }
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
            headers: this.headers
        });
        const data = await response.json();
        switch(data.status){
            case 'active':
                return SessionStatus.Active;
            case 'expired':
                this.setCurrentSession('');
                localStorage.removeItem('currentSession');
                return SessionStatus.Expired;
            default:
                this.setCurrentSession('');
                localStorage.removeItem('currentSession');
                return SessionStatus.Invalid;
        }
    }

    /**
     * Create a new session.
     * @param password
     */
    async createSession(password: string): Promise<any>{
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
            this.setCurrentSession(data.sessionToken);
            localStorage.setItem('currentSession', this.currentSession);
            return {
                sessionToken: data.sessionToken,
                status: 200
            };
        }else if(response.status == 511){
            return {
                url: data.url,
                status: 511
            };
        }else{
            console.error("Failed to create session.");
            throw data;
        }
    }


    /**
     * Delete the current session.
     */
    async deleteSession(): Promise<boolean>{
        const response = await fetch(`${this.baseUrl}/session`,{
            method: 'DELETE',
            headers: this.headers
        });
        if(response.status == 200){
            this.setCurrentSession('');
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
         * Get the details of a movie.
         * @param movieId   The movie id to get details for.
         */
        async getDetails(movieId:number): Promise<any>{
            const dresponse = await fetch(`${this.parent.baseUrl}/movie/${movieId}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await dresponse.json();
            const providers = await fetch(`${this.parent.baseUrl}/movie/${movieId}/watch/providers`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const providersData = await providers.json();
            data.providers = providersData.results;
            return data;
        },

        /**
         * Get the list of top movies. 
         * @param page  The page number to get.
         */
        async getTop(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/top_rated?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of upcoming movies.
         * @param page  The page number to get.
         */
        async getUpcoming(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/upcoming?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of popular movies.
         * @param page  The page number to get.
         */
        async getPopular(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/popular?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the recommended movies.
         * @param movieId   The movie id to get recommendations for.
         * @param page  The page number to get.
         */
        async getRecommended(movieId:number,page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movie/${movieId}/recommendations?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },
        
        /**
         * Get the movies watchlist.
         */
        async getWatchlist(): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movies/watchlist`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get favourite movies.
         */
        async getFavourites(): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/movies/favourites`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Add a movie to the favourites list.
         * @param id
         */
        async addToFavourites(data: any): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/movies/favourites`,{
                method: 'POST',
                headers: this.parent.headers,
                body: JSON.stringify(data)
            });
            return response.status == 200;
        },
    
        /**
         * Add a movie to the watchlist.
         * @param id
         */
        async addToWatchlist(data: any): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/movies/watchlist`,{
                method: 'POST',
                headers: this.parent.headers,
                body: JSON.stringify(data)
            });
            return response.status == 200;
        },

        /**
         * Remove a movie from the favourites list.
         * @param id
         */
        async removeFromFavourites(id: number): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/movies/favourites`,{
                method: 'DELETE',
                headers: this.parent.headers,
                body: JSON.stringify({'id':id})
            });
            return response.status == 200;
        },

        /**
         * Remove a movie from the watchlist.
         * @param id
         */
        async removeFromWatchlist(id: number): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/movies/watchlist`,{
                method: 'DELETE',
                headers: this.parent.headers,
                body: JSON.stringify({'id':id})
            });
            return response.status == 200;
        }


    }.init(this)


    shows = {
        parent: api,
        init(parent:API){
            this.parent = parent;
            return this;
        },    
        
        /**
         * Get the details of a show.
         * @param showId    The show id to get details for.
         */
        async getDetails(showId:number): Promise<any>{
            const dresponse = await fetch(`${this.parent.baseUrl}/tv/${showId}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await dresponse.json();
            const providers = await fetch(`${this.parent.baseUrl}/tv/${showId}/watch/providers`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const providersData = await providers.json();
            data.providers = providersData.results;
            return data;
        },

        /**
         * Get the list of top shows.
         * @param page  The page number to get.
         */
        async getTop(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/top_rated?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of popular shows.
         * @param page  The page number to get.
         */
        async getPopular(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/popular?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the list of upcoming shows.
         * @param page  The page number to get.
         */
        async getUpcoming(page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/on_the_air?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the recommended shows.
         * @param showId    The show id to get recommendations for.
         * @param page  The page number to get.
         */
        async getRecommended(showId:number,page:number): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/tv/${showId}/recommendations?language=en-US&page=${page}`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get the shows watchlist.
         */
        async getWatchlist(): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/shows/watchlist`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },

        /**
         * Get favourite shows.
         */
        async getFavourites(): Promise<any>{
            const response = await fetch(`${this.parent.baseUrl}/shows/favourites`,{
                method: 'GET',
                headers: this.parent.headers
            });
            const data = await response.json();
            return data;
        },



        /**
         * Add a tv show to the favourites list.
         * @param id
         */
        async addToFavourites(data: any): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/shows/favourites`,{
                method: 'POST',
                headers: this.parent.headers,
                body: JSON.stringify(data)
            });
            return response.status == 200;
        },
    
        /**
         * Add a tv show to the watchlist.
         * @param id
         */
        async addToWatchlist(data: any): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/shows/watchlist`,{
                method: 'POST',
                headers: this.parent.headers,
                body: JSON.stringify(data)
            });
            return response.status == 200;
        },

        /**
         * Remove a show from the favourites list.
         * @param id
         */
        async removeFromFavourites(id: number): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/shows/favourites`,{
                method: 'DELETE',
                headers: this.parent.headers,
                body: JSON.stringify({'id':id})
            });
            return response.status == 200;
        },

        /**
         * Remove a show from the watchlist.
         * @param id
         */
        async removeFromWatchlist(id: number): Promise<boolean>{
            const response = await fetch(`${this.parent.baseUrl}/shows/watchlist`,{
                method: 'DELETE',
                headers: this.parent.headers,
                body: JSON.stringify({'id':id})
            });
            return response.status == 200;
        }

    }.init(this)



}
var api = new API();
export default api;