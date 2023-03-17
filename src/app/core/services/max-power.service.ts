import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class MaxPowerService {
  constructor(private readonly alertController: AlertController, private readonly toastController: ToastController) {}

  async show(value: string, header: string) {
    const alert = await this.alertController.create({
      header,
      subHeader: 'Please input in Watts',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: async (input) => {
            const maxSolarPower = parseInt(input.max, 10);

            if (maxSolarPower > 0 && maxSolarPower <= 100000) {
              return true;
            }

            const toast = await this.toastController.create({
              message: 'Invalid value',
              duration: 2000,
              position: 'bottom',
              color: 'danger',
            });

            await toast.present();
            return false;
          },
        },
      ],
      inputs: [
        {
          name: 'max',
          type: 'number',
          placeholder: 'E.g. 3300',
          value,
          min: 0,
          max: 100000,
        },
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();

    if (role === 'confirm') {
      return parseInt(data.values.max, 10);
    }

    return null;
  }
}
