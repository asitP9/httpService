import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators'
import { post } from './post.model';
import {PostServiceService} from './post-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  errorMessage:string=null;
  loadedPosts:post[] = [];
  isFetching:boolean=false;
  errorMsgSubsOnCreatePost:Subscription;
  constructor(private http: HttpClient, private servicePost:PostServiceService) {}

  ngOnInit() {
    this.onFetchPosts();
    this.errorMsgSubsOnCreatePost=this.servicePost.error.subscribe((errorMsg)=>{
      this.errorMessage=errorMsg;
    })
  }

  onCreatePost(title:string, content:string) {
    // Send Http request
    this.loadedPosts=this.servicePost.createAndStorePosts(title, content);
  }

  onFetchPosts() {
    this.isFetching=true;
    // Send Http request
    this.servicePost.fetchPosts(). subscribe(
      post =>{
        this.isFetching=false;
        this.loadedPosts=post;
      },
      error =>{
        this.isFetching=false;
        this.errorMessage=error.message;
      }
    )
  }

  onClearPosts() {
    // Send Http request
    this.servicePost.deletePosts().subscribe(
      ()=>{
        this.loadedPosts=[];
      }
    )
  }

  handleError(){
    this.errorMessage=null;
  }

  ngOnDestroy(){
    this.errorMsgSubsOnCreatePost.unsubscribe();
  }
 
}
