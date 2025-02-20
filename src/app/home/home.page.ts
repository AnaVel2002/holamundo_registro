import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  user: any; // Guardará los datos del usuario
  token: string = '';
  mensaje: boolean = false;
  mostrarInfoUsuario: boolean = false;
  mostrarAdminOpciones: boolean = false;

  constructor(private router: Router) { }
  //Author: JIMÉNEZ AMADOR JOSÉ ANTONIO
  ngOnInit() {
    // Verifica si los datos del usuario están en localStorage
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      this.user = JSON.parse(storedUser); // Convierte el string JSON de nuevo en objeto
      this.token = storedToken; // Asigna el token a una variable para su uso
    } else {
      // Si no existe el usuario en localStorage, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  info() {
    this.mensaje = true;
    setTimeout(() => {
      this.mensaje = false;
    }, 5000);
  }
  //Author: JIMÉNEZ AMADOR JOSÉ ANTONIO
  login() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      console.log('Ya tienes una sesión activa. No puedes ir al login.');
      return; // Evita la navegación si ya está autenticado
    }
    this.router.navigate(['/login']);
  }
  //Author: JIMÉNEZ AMADOR JOSÉ ANTONIO
  logout() {
    localStorage.removeItem('user'); // Elimina los datos del usuario de localStorage
    localStorage.removeItem('token');
    this.router.navigate(['/login']).then(() => {
      window.location.reload(); // Recarga la página para limpiar el estado
    });
  }

  toggleUserInfo() {
    this.mostrarInfoUsuario = !this.mostrarInfoUsuario;
  }

  toggleAdminOptions() {
    this.mostrarAdminOpciones = !this.mostrarAdminOpciones;
  }
  //Author: JIMÉNEZ AMADOR JOSÉ ANTONIO
  verUsuarios() {
    console.log('Ver usuarios');
  }

  agregarUsuario() {
    console.log('Agregar usuario');
  }

  eliminarUsuario() {
    console.log('Eliminar usuario');
  }

}
