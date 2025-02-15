import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})


export class RegisterPage implements OnInit {
  registerForm: FormGroup;
registros: any[]=[];
  constructor(private fb: FormBuilder, private router: Router, private loadingController: LoadingController) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required]],
      user: ['', [Validators.required, Validators.pattern(/^\S*$/)]], // Sin espacios
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
    }, { validators: this.matchPasswords });
  }


  ngOnInit() {
  }


  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }


  toUpperCase() {
    const fullName = this.registerForm.get('fullName');
    if (fullName) {
      fullName.setValue(fullName.value.toUpperCase(), { emitEvent: false });
    }
  }


  get passwordsDoNotMatch() {
    return this.registerForm.hasError('passwordsMismatch') &&
           this.registerForm.get('confirmPassword')?.touched;
  }


  get email() { return this.registerForm.get('email'); }
  get user() { return this.registerForm.get('user'); }

    //Author: Velázque Gutiérrez Ana Karen
  async register() {
    if (this.registerForm.valid) {
      const loading = await this.presentLoading('Espere...');

      setTimeout(async () => {
        this.registros.push(this.registerForm.value);//AQUI ES DONDE SE AGREGAN AL ARREGLO registros
      console.log('Datos del usuario:', this.registerForm.value);
      alert('Registro exitoso');

        this.registerForm.reset();
        await loading.dismiss();

        this.router.navigate(['/login']);
      }, 3000); // 3 segundos
    }
  }
  //Author: Velázque Gutiérrez Ana Karen
  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent',
      backdropDismiss: false,
      duration: 0
    });

    const loadingElement = await loading.present();

    // Logo de la UTEQ
    const content = document.querySelector('.loading-content');
    if (content) {
      content.innerHTML = `
        <img src="/assets/LOGO.png" class="loading-image" alt="UTEQ">
        <div class="loading-text" style="display: flex; justify-content: center; text-align: center; 15px; color: #313;">
            ${message}
        </div>
      `;
    }
    return loading;
  }
}
