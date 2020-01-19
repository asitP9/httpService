import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpEventType} from '@angular/common/http';
import {post} from './post.model';
import {map, catchError, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
posts:post[];
error=new Subject<string>();
  constructor(private http:HttpClient) {

   }

   createAndStorePosts(title: string, content:string):any{
        this.http
        .post<{name:string}>(
          'https://ng-complete-guide-fe7fb.firebaseio.com/posts.json',
          {"title":title, "content":content},
          {observe:'response'}
          
        )
        .subscribe(responseData => {
          console.log("this is the response",responseData);
        },
        error=>{
          this.error.next(error.message);
        }
        );
   }

   fetchPosts(){
     let queryParams=new HttpParams();
    //  The below code has meaning , as in firebase, so the response you will get will be more readable
     queryParams=queryParams.append('print','pretty');
     queryParams=queryParams.append('custom','key');
    const postArray=[];
    return this.http.get<{[key:string]: post}>('https://ng-complete-guide-fe7fb.firebaseio.com/posts.json',
      {
        headers: new HttpHeaders({'custom-header':'Hello'}),
        params:  queryParams
      }
    )
    .pipe(
      map(responseData => {
        const postArray:post[]=[];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key], id:key});
          }
        }
        return postArray;
      }),
      catchError(
        (errorRes)=>{
          return throwError(errorRes);
        }
      )
    )
    
    
  }

  deletePosts(){
    return this.http.delete( 'https://ng-complete-guide-fe7fb.firebaseio.com/posts.json',{
      observe:'events',
      responseType:'text'
    })
    .pipe(
      tap(event=>{
        console.log(event);
        if(event.type===HttpEventType.Response){
          console.log(event.body);
        }
      })
    )
  }
}
