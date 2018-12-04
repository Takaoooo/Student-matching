import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../home/home';
import { User } from '../../model/user';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;

  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toast: ToastController
  ) {

  }

  // Login
  async login(user: User) {
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(user.email, user.password)
      .then(res => {
        // Login succeed.
        if (res.user.email && res.user.uid) {
          // Go to HomePage.
          this.navCtrl.setRoot(HomePage);

          // display the success message.
          this.toast.create({
            message: `Welcome to APP_NAME, ${res.user.email}`,
            duration: 3000
          }).present();
        } else {
          this.toast.create({
            message: `Could not find authentication details.`,
            duration: 3000
          }).present();
        }
      })
      .catch(err => {
        // Login failed.
        this.toast.create({
          message: `Login Id and Password do not match.`,
          duration: 3000
        }).present();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}