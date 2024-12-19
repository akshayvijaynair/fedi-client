import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-actor-list-modal',
  templateUrl: './actor-list-modal.component.html',
  styleUrls: ['./actor-list-modal.component.scss'],
})
export class ActorListModalComponent {
  @Input() title!: string;
  @Input() accounts!: { id: string; name: string; type: string; icon: string }[];

  constructor(private modalController: ModalController) {}

  dismiss() {
    this.modalController.dismiss();
  }
}
