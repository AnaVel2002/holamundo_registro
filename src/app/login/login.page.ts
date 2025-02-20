import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { FirebaseService } from '../services/firebase.service';
import { User } from '../models/user.model';
import { getAuth } from 'firebase/auth';
import { tick } from '@angular/core/testing';

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

  // Inyección del servicio a través del constructor
  constructor(
    private modalController: ModalController,
    private router: Router,
    private loadingController: LoadingController,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
    // Verifica si los datos del usuario están en localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      this.router.navigate(['/home']);
    } 
  }

  usuarios = [
    { username: 'admin', password: 'admin' },
    { username: 'ana', password: '1234' }
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

  async login() {
    const user: User = {
      uid: '',
      email: this.username,
      password: this.password,
      username: '',
      role: ''
    };
    try {
      // Iniciar sesión
      const res = await this.firebaseSvc.signIn(user);
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        // Obtener el token
        const token = await this.firebaseSvc.getToken();
        if (token) {
          localStorage.setItem('token', token);
        }
        console.log(currentUser.uid);
        console.log(token);
  
        this.getUserInfo(res.user.uid);

        // Mostrar loading y redirigir
        await this.presentLoading('Accediendo...', () => {
          this.router.navigate(['/home']);
        });
      }
    } catch (error) {
      console.error('Error en el login:', error);
      // Mostrar mensaje de error al usuario
    }
  }
 
  async getUserInfo(uid: string) {
        let path = `USERS/${uid}`;
  
        this.firebaseSvc.getUserData(path).then((user: User) => {
          localStorage.setItem('user', JSON.stringify({
            username: user['username'],
            role: user['role'],
            permissions: user['permissions']
          }));
        })
    }
  
  async presentLoading(mensaje: string, callback: Function) {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: 3000 // 3 segundos
    });
    await loading.present();
    await loading.onDidDismiss();
    callback(); // Ejecuta la función después del loading
  }
  
  registro() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      console.log('Ya tienes una sesión activa. No puedes ir al registro.');
      return; // Evita la navegación si ya está autenticado
    }
    this.router.navigate(['/register']);
  }
}
