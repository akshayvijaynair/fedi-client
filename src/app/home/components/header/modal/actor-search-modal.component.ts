import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {ConnectionProfileService} from "../../../services/connection-profile.service";
import {AuthService} from "../../../../auth/services/auth.service";
import {Preferences} from "@capacitor/preferences";

@Component({
  selector: 'app-actor-list-modal',
  templateUrl: './actor-search-modal.component.html',
  styleUrls: ['./actor-search-modal.component.scss'],
})
export class ActorSearchModalComponent {
  @Input() title!: string;
  @Input() accounts!: { id: string; name: string; type: string; icon: string }[];

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private connectionProfileService: ConnectionProfileService) {}

  dismiss() {
    this.modalController.dismiss();
  }

  makeFollowRequest(object: string){
    Preferences.get({
      key: 'email',
    }).then((actor) => {
      this.connectionProfileService.sendFollowRequest(actor.value as string, object).subscribe(
        (data: any) => {
          console.log('request sent');
        },
        (error: any) => {
          console.log('error in sending request');
        }
      );
    });
  }
}
