import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {debounceTime, Subscription} from 'rxjs';
import {filter, switchMap, take, tap} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FriendRequest } from '../../models/FriendRequest';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { PopoverComponent } from './popover/popover.component';
import {FormControl} from "@angular/forms";
import {AccountService} from "../../services/account-search.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  private friendRequests!: FriendRequest[];
  private friendRequestsSubscription!: Subscription;
  searchControl = new FormControl('');
  filteredAccounts: any[] = [];

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
          const defaultImagePath = 'blank-profile-picture.png';
          this.authService
            .updateUserImagePath(imageName || defaultImagePath)
            .subscribe();
        })
      )
      .subscribe();

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.friendRequestsSubscription = this.connectionProfileService
      .getFriendRequests()
      .subscribe((friendRequests: FriendRequest[]) => {
        this.connectionProfileService.friendRequests = friendRequests.filter(
          (friendRequest: FriendRequest) => friendRequest.status === 'pending'
        );
      });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query) => this.accountService.searchAccounts(query))
      )
      .subscribe((accounts) => {
        this.filteredAccounts = accounts;
      });
  }

  selectAccount(account: any) {
    console.log('Selected account:', account);
  }

  async onSearchEnter() {
    // Handle enter logic, e.g., show modal
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentFriendRequestPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  }
}