import { Component, OnInit } from '@angular/core';

import { Platform, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { Storage } from '@ionic/storage';
import { UserData } from './providers/user-data';
import { LanguageService } from './services/language.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  appPages = [
    {
      title: 'Schedule',
      url: '/schedule',
      icon: 'newspaper'
    },
    {
      title: 'Clients',
      url: '/clients',
      icon: 'rocket'
    },
    {
      title: 'Timeless',
      url: '/timeless',
      icon: 'calendar'
    },
    {
      title: 'Users',
      url: '/users',
      icon: 'people'
    },
    {
      title: 'Speakers',
      url: '/speakers',
      icon: 'megaphone'
    },
    {
      title: 'Scan QR Code',
      url: '/scanQR',
      icon: 'qr-code'
    },
    {
      title: 'CSV File',
      url: 'fileCsv',
      icon: 'document-text'
    },
    {
      title: 'Map',
      url: '/map',
      icon: 'map'
    },
    {
      title: 'About',
      url: '/about',
      icon: 'information-circle'
    }
  ];

  loggedIn = false;
  dark = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private userData: UserData,
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private languageService: LanguageService

  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    this.listenForLoginEvents();

    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.languageService.setInitialAppLanguage();
    });
  }

  // comprobación login de usuario
  checkLoginStatus() {
    return this.userData.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    });
  }

  // actualiza el estado del login cada 300 segundos
  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
    }, 300);
  }

  // actualiza el estado del loggin cuando se ejecutan los siguientes eventos
  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  // logout con redireccion a la página principal
  logout() {
    this.userData.logout().then(() => {
      return this.router.navigateByUrl('/schedule');
    });
  }

}
