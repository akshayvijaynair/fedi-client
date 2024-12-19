import {Component, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {take, tap} from 'rxjs/operators';
import {FollowRequest} from 'src/app/home/models/FriendRequest';
import {ConnectionProfileService} from 'src/app/home/services/connection-profile.service';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  public friendRequests: FollowRequest[] = [];

  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: ModalController
  ) {}

  ngOnInit() {
    this.connectionProfileService.getFriendRequests().pipe(
      take(1), // Ensure we only subscribe once
      tap((data: FollowRequest[]) => {
        console.log('Fetched friend requests:', data);
        this.friendRequests = [...data];
      })
    ).subscribe({
      error: (err) => {
        console.error('Failed to fetch friend requests:', err);
      }
    });
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  async respondToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ) {
    /*const handledFriendRequest: any =
      this.connectionProfileService.friendRequests.find(
        (friendRequest) => friendRequest.id === id
      );

    this.connectionProfileService.friendRequests = this.connectionProfileService.friendRequests.filter(
      (friendRequest) => friendRequest.id !== handledFriendRequest.id
    );*/

  /*  if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss();
    }*/

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }
}
