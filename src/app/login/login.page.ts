import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  isValid: boolean = false;

  constructor(private modalController: ModalController, private router: Router, private loadingController: LoadingController) {}

  usuarios = [
    {username: 'ana', password: '1234'}
  ];
  validarCampos() {
    this.username = this.username.replace(/\s+/g, '').toLowerCase();
    this.password = this.password.replace(/\s+/g, '');

    this.isValid = this.username.length > 0 && this.password.length > 0;
  }

  async mostrarModal() {
    const modal = await this.modalController.create({
      component: InfoModalComponent,
      componentProps: {
        username: this.username,
        password: this.password,
      },
    });
    return await modal.present();
  }
// Author: Velázque Gutiérrez Ana Karen
  Iniciar() {
    const usuarioEncontrado = this.usuarios.find(user => 
      user.username === this.username && user.password === this.password
    );
  
    if (usuarioEncontrado) {
      this.presentLoading('Accediendo...', () => {
        this.router.navigate(['/home']); // Redirige a Home
      });
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }
//Author: Velázque Gutiérrez Ana Karen
  async presentLoading(mensaje: string, callback: Function) {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000 // 3 segundos
    });
    await loading.present();
    await loading.onDidDismiss();
    callback();
  }
}
