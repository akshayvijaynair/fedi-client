import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(public toastController: ToastController,
              private router: Router) {}

  async presentToast(errorMessage: string) {
    const toast = await this.toastController.create({
      header: 'Error occurred',
      message: errorMessage,
      duration: 2000,
      color: 'danger',
      buttons: [
        {
          icon: 'bug',
          text: 'dismiss',
          role: 'cancel',
        },
      ],
    });
    toast.present();
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.warn(`${operation} failed: ${error.message}`); // TODO: remove in prod

      // Redirect to login if error status is 401
      if (error.status === 401) {
        this.router.navigate(['/auth']); // Redirect user to login page
      }

      // Display error message using toast
      return of(result as T).pipe(tap(() => this.presentToast(error.message)));
    };
  }
}
