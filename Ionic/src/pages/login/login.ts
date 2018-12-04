import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../home/home';
import { User } from '../../model/user';

import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

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
  isLoggedIn:boolean = false;

  constructor(
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toast: ToastController,
    private fb: Facebook,
  ) {
    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));
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

  fb_login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"])
      .then(res => {
        console.log(res);
        this.user = res;
      })
      .catch(e => {
        console.log(e);
      });
  }

  fb_logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  loginAction()
  {
    // Login with permissions
    this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
    .then( (res: FacebookLoginResponse) => {

        // The connection was successful
        if(res.status == "connected") {

            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            var fb_token = res.authResponse.accessToken;

            // Get user infos from the API
            this.fb.api("/me?fields=name,gender,birthday,email", []).then((user) => {

                // Get the connected user details
                var gender    = user.gender;
                var birthday  = user.birthday;
                var name      = user.name;
                var email     = user.email;

                console.log("=== USER INFOS ===");
                console.log("Gender : " + gender);
                console.log("Birthday : " + birthday);
                console.log("Name : " + name);
                console.log("Email : " + email);

                // => Open user session and redirect to the next page

            });

        }
        // An error occurred while loging-in
        else {
            console.log("An error occurred...");
        }

    })
    .catch((e) => {
        console.log('Error logging into Facebook', e);
    });
  }

}