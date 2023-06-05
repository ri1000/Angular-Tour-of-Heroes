import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of,catchError,map,tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {


  //url to simulated server
  private heroesUrl = 'api/heroes'
  httpOptions = {
    headers: new HttpHeaders({'Content-Type' : 'application/json'})
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }
  //Get Heroes
  getHeroes():Observable<Hero[]>{
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    )
  }
  //Get Hero
  getHero(id:number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`
    return this.http.get<Hero>(url).pipe(
      tap(_=>this.log(`fetched hero with id: ${id}`)),
      catchError(this.handleError<Hero>(`getHero id: ${id}`))
    )
  }
   //get hero 404 return
   getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      )
   }
   //hero name search
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found heroes matching "${term}"`) :
         this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  //Add new Hero
  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl,hero,this.httpOptions)
    .pipe(
      tap((newHero:Hero)=>this.log(`added new hero with id: ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }


  //Update Hero
  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero,this.httpOptions)
    .pipe(
      tap(_ => this.log(`updated hero with id: ${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }
  //delete Hero
  deleteHero(id:number):Observable<Hero>{
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url,this.httpOptions)
    .pipe(
      tap(_ => this.log(`deleted Hero with id: ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }


  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    ) { }

   private log(message: string) {
     this.messageService.add(`HeroService: ${message}`);
   }
}
