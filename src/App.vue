<template>
  <div id="app">
    <!--Desktop Header-->
    <header class="w3-bar w3-blue w3-card">
      <router-link to="/" class="w3-button w3-hover-none w3-hover-text-white w3-bar-item w3-large">dQueue</router-link>
      <div v-if="loggedIn" class="w3-right">
        <router-link to="/help" id="help-btn" class="w3-bar-item w3-button">
          <i class="fas fa-info"></i><span class="w3-hide-small"> Ohje</span>
        </router-link>
        <a v-on:click.prevent="logout" id="sign-out-btn" class="w3-bar-item w3-button">
          <i class="fas fa-sign-out-alt"></i><span class="w3-hide-small"> Kirjaudu ulos</span>
        </a>
      </div>
    </header>

    <!--Main View-->
    <div class="w3-content w3-margin-top">
      <router-view v-if="loggedIn" />
    </div>

    <!--Login Form-->
    <div v-if="!loggedIn" class="w3-container w3-section">
      <div class="w3-white w3-card w3-content">
        <header class="w3-container w3-blue"><h1>Kirjaudu sisään</h1></header>
        <form v-on:submit.prevent="login" class="w3-center w3-container w3-padding-large">
          <input class="w3-input w3-section w3-left-align" type="email" v-model="email" placeholder="Tunnus...">
          <input class="w3-input w3-margin-bottom w3-left-align" type="password" v-model="pass" placeholder="Salasana...">
          <p class="w3-text-red">{{ loginErrMsg }}</p>
          <input type="submit" class="w3-button w3-blue w3-text-white w3-hover-blue w3-hover-text-white w3-hover-opacity" value="Kirjaudu sisään">
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import auth from "./components/auth"

export default {
  name: 'App',
  data() {
    return {
      loggedIn: false,
      email: null,
      pass: null,
      loginErrMsg: ""
    }
  },
  created() {
    this.loggedIn = auth.checkAuth()
    this.$router.push("/")
  },
  methods: {
    login() {
      auth.login(this.email, this.pass).then(() => {
        this.loggedIn = true
        this.$router.push("/")
      }).catch(err => {
        this.loginErrMsg = "Tunnus tai salasana virheellinen! Yritä uudestaan."
      })
    },
    logout() {
      auth.logout().then(() => {
        this.loggedIn = false
        this.loginErrMsg = ""
      }).catch(err => {
        console.log("Virhe " + err.message)
      })
    }
  }
}
</script>

<style>
#app {
  /* Global CSS-variables */
  --theme-primary-color: rgb(33, 150, 243);
  --theme-secondary-color: white;
  --theme-makerbot-color: #F5403A;

  background: url("./assets/img/bg/possiblebg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
}

.w3-content {
  max-width: 1400px;
}

.w3-red {
  background-color: #F5403A !important;
  color: white;
}

.w3-text-red {
  color: #F5403A !important;
}

.w3-border-red {
  border-color: #F5403A !important; 
}

#sign-out-btn, #help-btn {
  background: var(--theme-primary-color);
  color: white;
  transition: opacity 0.1s;
  padding: 12px 24px 12px 0;
}

#sign-out-btn:hover, #help-btn:hover {
  background: var(--theme-primary-color) !important;
  color: white !important;
  opacity: 0.8;
}
</style>
