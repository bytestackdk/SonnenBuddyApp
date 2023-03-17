import { Injectable } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  constructor(private readonly actionSheetCtrl: ActionSheetController) {}

  async confirm(buttonText: string, subHeader: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Please confirm',
      subHeader,
      buttons: [
        {
          text: buttonText,
          role: 'destructive',
          data: {
            action: 'confirm',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();

    const result = await actionSheet.onDidDismiss();

    return result.data.action === 'confirm';
  }
}
