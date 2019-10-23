<template>
  <div v-if="loggedIn" id="dashboard">

    <!--Top part Add Button-->
    <div id="add-button-container" class="w3-container">
      <router-link id="add-button-top" to="/add" class="w3-border-blue w3-border w3-white w3-center w3-margin-bottom w3-text-blue w3-xxlarge">+</router-link>
    </div>

    <!--Print job lists-->
    <div class="w3-row">
      <div v-for="printer in printers" class="w3-half">
        <div class="w3-container w3-margin-bottom">

          <div class="w3-container w3-center" v-bind:class="{ 
            'w3-text-blue': (printer.name == 'platform'),
            'w3-text-red': (printer.name == 'makerbot')
          }">
            <h1>{{ printer.name.toUpperCase() }}</h1>

            <p class="w3-large"><b>Vapaa:</b> {{ toFinnishDateString(printer.estimatedFreeDate) }}</p>
            <p class="w3-large"><b>Yhteensä:</b> {{ toHourAndMinuteString(printer.timeEstimate) }}</p>
          </div>

          <ul class="w3-ul">
    
            <!--Extruder Animation / Still-->
            <li class="w3-center " v-bind:class="{ 
              'extr-animate': (printer.jobsLoaded && printer.jobs.filter(job => job.priority === 'running').length >= 1)
            }">
              <img class="running-extruder" src="../assets/img/extruderplatform.png" v-if="printer.name == 'platform'">
              <img class="running-extruder" src="../assets/img/extrudermbot.png" v-else>
            </li>
    
            <!--Loading Icon-->
            <li class="w3-center w3-section w3-animate-opacity" v-if="!printer.jobsLoaded">
              <i class="fas fa-sync fa-spin w3-text-white fa-2x"></i>
            </li>
    
            <!--Empty List-->
            <li class="w3-center w3-margin-top w3-animate-opacity" v-if="(printer.jobsLoaded && printer.jobs.length < 1)">
              <p class="w3-text-white w3-large">...</p>
            </li>
    
            <!--Print Jobs-->
            <li v-for="job in printer.jobs" class="w3-card print-job w3-animate-opacity" v-bind:class="{
              'makerbot-job': (printer.name == 'makerbot'), 
              'priority-high': (job.priority == 'high'),
              'priority-running': (job.priority == 'running'),
              'priority-done': (job.priority == 'done'),
              'priority-low': (job.priority != 'high' && job.priority != 'running' && job.priority != 'done')
            }">
              <button class="w3-button print-right-button w3-hover-none w3-large w3-right" v-on:click="deleteJob(job)"><i class="fas fa-trash-alt"></i></button>
              <router-link v-if="job.priority == 'low' || job.priority == 'high'" :to="{ name: 'edit-job', params: { job: job }}" class="w3-button print-right-button w3-hover-none w3-large w3-right"><i class="fas fa-edit"></i></router-link>
              <button class="w3-button print-right-button w3-hover-none w3-large w3-right" v-on:click="startJob(job)">
                <i v-if="job.priority == 'running'" class="fas fa-history"></i>
                <i v-if="job.priority != 'running'" class="fas fa-play"></i>
              </button>
              <span class="part-title">
                {{ job.part }}
                <i v-if="job.priority == 'high'" class="fas fa-exclamation-circle"></i>
                <i v-if="job.priority == 'running'" class="fas fa-circle-notch fa-spin"></i>
                <i v-if="job.priority == 'done'" class="fas fa-check-circle"></i>
              </span><br>
              {{ job.material }}<br><br>
              <i class="fas fa-user"></i> {{ job.name }}
              <span class="w3-right"><i class="fas fa-clock"></i> {{ toHourAndMinuteString(job.time) }}</span>
              <br>
            </li>
    
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import printjobController from "./printjobController"
  import auth from "./auth"

  class Printer {
    constructor(name) {
      this.name = name;
      this.jobs = [];
      this.jobsLoaded = false;
      this.timeEstimate = 0;
      this.priorityEstimate = 0;
      this.runningEstimate = 0;
      this.estimatedDate = new Date();
      this.estimatedFreeDate = new Date();
    }

    checkEstimatedDates() {
      let timeEstimateMillis = Number(this.timeEstimate) * 3600 * 1000
      let runningEstimateMillis = Number(this.runningEstimate) * 3600 * 1000

      this.estimatedDate.setTime(Date.now() + timeEstimateMillis)
      this.estimatedFreeDate.setTime(Date.now() + runningEstimateMillis)
    }
  }

  export default {
    name: 'dashboard',
    data () {
      return {
        loggedIn: false,
        currentJob: null,
        refreshInterval: null,
        printers: []
      }
    },
    created() {
      this.loggedIn = auth.checkAuth()
      if (!this.loggedIn) this.$router.push("/login")

      const platform = new Printer("platform")
      const makerbot = new Printer("makerbot")

      this.printers.push(platform)
      this.printers.push(makerbot)

      this.fetchJobs()
      this.refreshInterval = setInterval(this.fetchJobs, 40000)
    },
    destroyed() {
      clearInterval(this.refreshInterval)
    },
    methods: {
      fetchJobs() {
        this.printers.forEach(printer => {
          printer.jobs = []
          printer.jobsLoaded = false

          this.loggedIn = auth.checkAuth()
          if (this.loggedIn) {
            printjobController.getJobs(printer, () => {
              printer.jobsLoaded = true

              printer.jobs.filter(job => job.priority === "running").forEach(job => {
                let timeDiff = Date.now() - job.startedDate.getTime()
                let timeDiffHours = (timeDiff / 1000) / 3600
                job.time = Number(job.time - timeDiffHours).toFixed(2)
                if (job.time <= 0) printjobController.finishJob(job, this.fetchJobs())
              })

              printer.timeEstimate = printer.jobs.filter(job => job.priority !== "done").reduce((sum, cur) => sum + Number(cur.time), 0)
              printer.priorityEstimate = printer.jobs.filter(job => job.priority === "high").reduce((sum, cur) => {
                return sum + Number(cur.time)
              }, 0)
              printer.runningEstimate = printer.jobs.filter(job => job.priority === "running").reduce((sum, cur) => {
                return sum + Number(cur.time)
              }, 0)

              printer.checkEstimatedDates()
            })
          }
        })
      },
      deleteJob(clickedJob) {
        if (this.loggedIn) {

          let jobBackup = clickedJob

          printjobController.removeJob(clickedJob, job => {
          
            this.enableUndoButton(jobBackup)
            this.fetchJobs()

          })
        }
      },
      enableUndoButton(jobBackup) {

        let undoButton = document.getElementById("undo-button")
        if (undoButton) undoButton.remove()

        undoButton = document.createElement("button")
        undoButton.id = "undo-button"
        undoButton.className = "w3-button w3-right w3-text-blue w3-hover-none w3-hover-opacity"
        undoButton.innerHTML = "<i class='fas fa-undo'></i> UNDO"

        undoButton.addEventListener("click", e => {
          printjobController.addJob(jobBackup, () => {
            this.fetchJobs()
          })
          e.target.remove()
        })

        let addButtonContainer = document.getElementById("add-button-container");
        addButtonContainer.appendChild(undoButton);
      },
      startJob(clickedJob) {
        if (this.loggedIn && confirm("Aloitetaanko tulostus?")) {
          printjobController.startJob(clickedJob, job => {
            this.fetchJobs()
          })
        }
      },
      toHourAndMinuteString(hours) {
        let totMins = Math.round(Number(hours) * 60)
        let h = Math.floor(totMins / 60)
        let m = totMins % 60
        return `${h}h ${m}min`
      },
      toFinnishDateString(date) {
        let dateString = date.toLocaleDateString("fi", { weekday: "long", month: 'long', day: 'numeric' })
        let timeString = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        if (date.getTime() - Date.now() <= 30000) return "Heti"
        return dateString + " " + timeString
      }
    }
  }
</script>
    
<style scoped>
#add-button-top {
  display: block;
  margin: 0 auto;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  text-decoration: none;
  transition: background-color 0.1s;
}

#add-button-top:hover {
  background-color: var(--theme-primary-color) !important;
  color: var(--theme-secondary-color) !important;
}

li {
  border: 0 !important;
}

li.print-job {
  margin-bottom: 8px;
  padding: 16px;
  border-radius: 4px;
  transition: 0.3s;
}

li.print-job span.part-title {
  font-size: 100%;
}

li.print-job:hover {
  opacity: 0.8;
}

li.print-job > .print-right-button {
  background: none;
  padding: 8px;
  transition: opacity 0.1s;
}

li.print-job > .print-right-button:hover {
  background: none;
  opacity: 0.8;
}

li.priority-high {
  background-color: var(--theme-primary-color);
  color: var(--theme-secondary-color);
}

li.priority-high.makerbot-job {
  background-color: var(--theme-makerbot-color);
}

li.priority-high > .print-right-button {
  color: var(--theme-secondary-color) !important;
}

li.priority-low {
  background-color: var(--theme-secondary-color);
  color: var(--theme-primary-color);
}

li.priority-low.makerbot-job {
  color: var(--theme-makerbot-color);
}

li.priority-low > .print-right-button {
  color: var(--theme-primary-color) !important;
}

li.priority-low.makerbot-job > .print-right-button {
  color: var(--theme-makerbot-color) !important;
}

li.priority-done {
  background-color: #335773;
  color: white;
}

li.priority-done > .print-right-button, li.priority-running > .print-right-button {
  color: white !important;
}

li.priority-running {
  background-color: rgba(100, 100, 100, 1.0) !important;
  color: white !important;
  border-left: 8px solid var(--theme-primary-color) !important;
  animation: running 3s infinite;
  -webkit-animation: running 3s infinite;
}
@-webkit-keyframes running {
  50% { 
    background-color: rgba(100, 100, 100, 0.7);
  }
}
@keyframes running {
  50% { 
    background-color: rgba(100, 100, 100, 0.7);
  }
}

li.priority-running.makerbot-job {
  border-left: 8px solid var(--theme-makerbot-color) !important;
}

.running-extruder {
  width: 50px;
  height: 70px;
}
.extr-animate {
  -webkit-animation: extrude 5s infinite;
  animation: extrude 5s infinite;
  animation-timing-function: linear;
  -webkit-animation-timing-function: linear;
}
@keyframes extrude {
  25% { transform: translateX(100px); }
  75% { transform: translateX(-100px); }
}
@media (min-width: 601px) {
  @keyframes extrude {
    25% { transform: translateX(140px); }
    75% { transform: translateX(-140px); }
  }
}

@media (min-width: 601px) {
  li.print-job span.part-title {
    font-size: 120%;
  }
}
@media (min-width: 993px) {
  li.print-job span.part-title {
    font-size: 140%;
  }
}
</style>
    