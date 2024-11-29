import { Component, OnDestroy, OnInit } from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {debounceTime, Subscription} from 'rxjs';
import {filter, switchMap, take, tap} from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FriendRequest } from '../../models/FriendRequest';
import { ConnectionProfileService } from '../../services/connection-profile.service';
import { FriendRequestsPopoverComponent } from './friend-requests-popover/friend-requests-popover.component';
import { PopoverComponent } from './popover/popover.component';
import {FormControl} from "@angular/forms";
import {AccountService} from "../../services/account-search.service";
import {ActorSearchModalComponent} from "./modal/actor-search-modal.component";
import {User} from "../../../auth/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userFullImagePath!: string;
  private userImagePathSubscription!: Subscription;

  protected friendRequests: any = null;
  private friendRequestsSubscription!: Subscription;
  searchControl = new FormControl('');
  filteredAccounts: User[] = [];

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService,
    public connectionProfileService: ConnectionProfileService,
    private accountService: AccountService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.authService
      .getUserImageName()
      .pipe(
        take(1),
        tap(({ imageName }) => {
          const defaultImagePath = 'assets/resources/icon.png';
          this.authService
            .updateUserImagePath(defaultImagePath)
            .subscribe();
        })
      )
      .subscribe();

    this.userImagePathSubscription =
      this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      });

    this.friendRequestsSubscription =
      this.connectionProfileService.getFriendRequests().subscribe(
        (data: any) => {
          this.friendRequests = data;
      });
  }

  selectAccount(account: any) {
    console.log('Selected account:', account);
  }

  async onSearchEnter() {
    // Handle enter logic, e.g., show modal
  }

  async openSearchModal() {
    this.accountService.searchAccounts(this.searchControl.value).subscribe(
      async (data: User[]) => {
        const modal = await this.modalController.create({
          component: ActorSearchModalComponent,
          componentProps: {title: 'Search Results', accounts: data},
        });
        return await modal.present();
      }
    )

  }

  async presentPopover(ev: any) {
    await this.popoverController.dismiss().catch(() => null);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
  }

  async presentFriendRequestPopover(ev: any) {
    await this.modalController.dismiss().catch(() => null);
    const popover = await this.modalController.create({
      component: FriendRequestsPopoverComponent,
      showBackdrop: true,
      componentProps: {title: 'Follow Requests'},
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('Popover dismissed with role:', role);
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe();
    this.friendRequestsSubscription.unsubscribe();
  }
}
