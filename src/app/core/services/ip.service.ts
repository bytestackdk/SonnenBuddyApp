import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { CustomRegex } from '../../shared/functions/regex';

@Injectable({ providedIn: 'root' })
export class IpService {
  constructor(private readonly alertController: AlertController, private readonly toastController: ToastController) {}

  async show(currentIp?: string) {
    const alert = await this.alertController.create({
      header: 'IP address',
      cssClass: 'ion-alert-custom',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          role: 'confirm',
          handler: async (input) => {
            if (CustomRegex.ipRegex.test(input.ip.trim())) {
              return true;
            }

            const toast = await this.toastController.create({
              message: 'Invalid IP address',
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
          name: 'ip',
          placeholder: 'E.g. 192.168.1.10',
          value: currentIp || '',
          attributes: {
            maxlength: 15,
          },
        },
      ],
    });

    await alert.present();

    const { role, data } = await alert.onDidDismiss();

    if (role === 'confirm') {
      return data.values.ip;
    }

    return null;
  }
}
