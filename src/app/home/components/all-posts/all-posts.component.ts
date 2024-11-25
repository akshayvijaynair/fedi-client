import {
  Component,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';

import { Post } from '../../models/Post';
import { PostService } from '../../services/post.service';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  @Input() postBody?: string;

  private userSubscription!: Subscription;

  queryParams!: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  userId$ = new BehaviorSubject<string>("");

  constructor(
    private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.userSubscription = this.authService.userStream.subscribe(
      (user: User | null) => {
        this.allLoadedPosts.forEach((post: Post, index: number) => {
          if (user?.icon?.url && post.author.id === user.id) {
            this.allLoadedPosts[index].fullImagePath =
              this.authService.getFullImagePath(user.icon.url);
          }
        });
      }
    );

    this.getPosts(false, '');

    // Initialize `userId$` if not already defined
    this.authService.userId.pipe(take(1)).subscribe((userId: string) => {
      this.userId$.next(userId);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const postBody = changes['postBody'].currentValue;
    if (!postBody) return;

    this.postService.createPost(postBody).subscribe((post: Post) => {
      this.authService.userFullImagePath
        .pipe(take(1))
        .subscribe((fullImagePath: string) => {
          post['fullImagePath'] = fullImagePath
          this.allLoadedPosts.unshift(post);
        });
    });
  }

  getPosts(isInitialLoad: boolean, event: any) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

    this.postService
      .getSelectedPosts(this.queryParams)
      .subscribe((posts: Post[]) => {
        console.log(posts);
        for (let postIndex = 0; postIndex < posts.length; postIndex++) {
          const doesAuthorHaveImage = !!posts[postIndex].author.icon?.url;
          let fullImagePath = this.authService.getDefaultFullImagePath();
          if (doesAuthorHaveImage) {
            fullImagePath = this.authService.getFullImagePath(
              posts[postIndex].author.icon?.url?? ""
            );
          }
          posts[postIndex]['fullImagePath'] = fullImagePath;
          this.allLoadedPosts.push(posts[postIndex]);
        }
        console.log('allPosts: ', this.allLoadedPosts)
        if (isInitialLoad) event.target.complete();
        this.skipPosts = this.skipPosts + 5;
      });
  }

  loadData(event: any) {
    this.getPosts(true, event);
  }

  async presentUpdateModal(postId: string) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
      componentProps: {
        postId,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data) return;

    const newPostBody = data.post.body;
    this.postService.updatePost(postId, newPostBody).subscribe(() => {
      /*const postIndex = this.allLoadedPosts.findIndex(
        (post: Post) => post.id === postId
      );
      this.allLoadedPosts[postIndex].body = newPostBody;*/
    });
  }

  deletePost(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
     /* this.allLoadedPosts = this.allLoadedPosts.filter(
        (post: Post) => post.id !== postId
      );*/
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
