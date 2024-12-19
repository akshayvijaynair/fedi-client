import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ActorListModalComponent} from "./modal/actor-list-modal.component";
import {BannerColorService} from "../../services/banner-color.service";

// Mock follower/following data
const mockFollowers = [
  { id: 'https://example.com/actors/user1', name: 'Alice', type: 'Person', icon: 'assets/resources/icon.png' },
  { id: 'https://example.com/actors/user2', name: 'Bob', type: 'Person', icon: null },
];

const mockFollowing = [
  { id: 'https://example.com/actors/user3', name: 'Charlie', type: 'Person', icon: 'assets/resources/icon.png' },
  { id: 'https://example.com/actors/user4', name: 'Dana', type: 'Person', icon: 'assets/resources/icon.png' },
];

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent {
  public actor = {
    id: "https://example.com/actors/johndoe",
    type: "Person",
    name: "John Doe",
    summary: "A passionate Full Stack Developer exploring the fediverse.",
    icon: null,
    inbox: "https://example.com/actors/johndoe/inbox",
    outbox: "https://example.com/actors/johndoe/outbox",
    followers: "https://example.com/actors/johndoe/followers",
    following: "https://example.com/actors/johndoe/following",
    followersCount: 123,
    followingCount: 89,
  };

  isFollowing = false;

  constructor(
    private modalController: ModalController,
    public bannerColorService: BannerColorService,) {}

  async fetchInbox() {
    // Simulate an API call
    console.log('Fetching inbox:', this.actor.inbox);
    // Replace with actual HTTP request
  }

  async fetchOutbox() {
    // Simulate an API call
    console.log('Fetching outbox:', this.actor.outbox);
    // Replace with actual HTTP request
  }

  async openFollowersModal() {
    const modal = await this.modalController.create({
      component: ActorListModalComponent,
      componentProps: { title: 'Followers', accounts: mockFollowers },
    });
    return await modal.present();
  }

  async openFollowingModal() {
    const modal = await this.modalController.create({
      component: ActorListModalComponent,
      componentProps: { title: 'Following', accounts: mockFollowing },
    });
    return await modal.present();
  }

  followActor() {
    console.log('Followed Actor:', this.actor.id);
    this.isFollowing = true;
    // Replace with actual HTTP request
  }

  unfollowActor() {
    console.log('Unfollowed Actor:', this.actor.id);
    this.isFollowing = false;
    // Replace with actual HTTP request
  }

  setFallbackImage(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/resources/icon.png'; // Path to your fallback image
  }
}
