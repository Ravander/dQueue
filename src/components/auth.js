import firebase from "./firebaseInit";

export default {
  loggedIn: false,
  login(email, pass) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, pass).then(() => {
        this.loggedIn = true;
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut().then(() => {
        this.loggedIn = false;
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  },
  checkAuth() {
    return this.loggedIn;
  }
};