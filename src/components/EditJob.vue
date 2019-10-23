<template>
  <div v-if="loggedIn" id="edit-job" class="w3-container">
    <form v-on:submit.prevent="editJob" class="w3-white w3-card w3-margin-bottom" id="edit-item-form" action="">
      <header class="w3-container w3-blue w3-text-white"><h2>Muokkaa tulostetta</h2></header>
      <div class="w3-container w3-white w3-text-blue w3-padding-large">
          <label>Tulostettava kappale</label>
          <input class="w3-input w3-hover-opacity" type="text" v-model="part" placeholder="..." required>
    
          <label>Tulostaja</label>
          <input class="w3-input w3-hover-opacity" type="text" v-model="name" placeholder="..." required>

          <label>Materiaali</label>
          <input class="w3-input w3-hover-opacity" type="text" v-model="material" placeholder="..." required>
    
          <label>Tulostusaika</label>
          <div class="w3-row-padding">
            <div class="w3-col s6">
              <label>tunnit</label>
              <input class="w3-input w3-hover-opacity" type="number" v-model="timeHours" placeholder="0" min="0" required>
            </div>
            <div class="w3-col s6">
              <label>minuutit</label>
              <input class="w3-input w3-hover-opacity" type="number" v-model="timeMinutes" placeholder="0" min="0" max="60" required>  
            </div>
          </div>
    
          <label>Kiireisyys</label><br>
          <input class="w3-radio" type="radio" value="high" v-model="priority">
          <label class="w3-medium w3-margin-left" for="high">Kiireinen</label><br>
          <input class="w3-radio" type="radio" value="low" v-model="priority">
          <label class="w3-medium w3-margin-left" for="low">Ei kiireinen</label><br><br>

          <label>Tulostin</label><br>
          <input class="w3-radio" type="radio" value="platform" v-model="printer">
          <label class="w3-medium w3-margin-left" for="platform">Platform</label><br>
          <input class="w3-radio" type="radio" value="makerbot" v-model="printer">
          <label class="w3-text-red w3-medium w3-margin-left" for="makerbot">MakerBot</label><br>
    
          <input type="submit" value="Muokkaa" class="w3-button w3-blue w3-hover-blue w3-hover-opacity w3-section">
          <router-link to="/" class="w3-button w3-block w3-grey w3-text-white w3-hover-grey w3-hover-text-white w3-hover-opacity">Takaisin</router-link>
      </div>
    </form>
  </div>
</template>

<script>
  import auth from "./auth"
  import printjobController from "./printjobController"

  export default {
    name: 'edit-job',
    data () {
      return {
        job: null,
        loggedIn: false,
        part: null,
        name: null,
        material: null,
        printer: "platform",
        time: null,
        timeMinutes: 0,
        timeHours: 0,
        priority: "high"
      }
    },
    created() {
      this.loggedIn = auth.checkAuth()
      if (!this.loggedIn) this.$router.push("/")

      /* Get the editable job */
      this.job = this.$route.params.job
      this.part = this.job.part
      this.name = this.job.name
      this.material = this.job.material
      this.timeHours = Math.floor(this.job.time)
      this.timeMinutes = Math.round((this.job.time - this.timeHours) * 60)
      this.priority = this.job.priority
      this.printer = this.job.printer
    },
    methods: {
      editJob() {
        let hours = Number(this.timeHours)
        let mins = Number(this.timeMinutes)
        this.time = hours + (mins / 60)
        let newPrint = {
          name: this.name,
          part: this.part,
          time: this.time,
          material: this.material,
          priority: this.priority,
          printer: this.printer
        }
        printjobController.editJob(this.job, newPrint, () => {
          this.$router.push("/")
        })
      }
    }
  }
</script>
    
<style scoped>
label {
  font-size: 1.2em;
}

input[type="text"], input[type="submit"], input[type="number"] {
  display: block;
  width: 100%;
  padding: 16px;
  margin-bottom: 8px;
  border-radius: 4px;
  transition: opacity 0.1s;
}

.w3-button {
  border-radius: 4px;
  transition: opacity 0.1s;
}
</style>