import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { KwPipe } from './pipes/kw.pipe';

@NgModule({
  declarations: [KwPipe],
  imports: [CommonModule, IonicModule, FormsModule, FlexModule],
  exports: [CommonModule, IonicModule, FormsModule, FlexModule, KwPipe],
})
export class SharedModule {}
