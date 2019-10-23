<template>
  <div id="help" class="w3-container">
    <div id="help-container" class="w3-white w3-card w3-section">
      <header class="w3-container w3-blue w3-text-white"><h2>Pikaohje</h2></header>
      <div class="w3-container w3-white w3-text-blue w3-padding-large">
        <h3>Tulosteen lisäys</h3>
        <p>Lisää tuloste jonoon <i class="fas fa-plus w3-blue w3-round w3-padding-small"></i> painikkeella. Kaikki pyydetyt tiedot tulee täyttää.</p>

        <h3>Yleistä jonosta</h3>
        <p>Kiireelliset kohteet on värjätty tummaksi ja merkitty <i class="fas fa-exclamation-circle w3-blue w3-round w3-padding-small"></i> merkillä. <b>Ota tämä huomioon jonon vapautumista arvioidessasi!</b></p>
        <div class="w3-row">
          <div class="w3-quarter w3-center w3-padding-small">
            <div class="w3-border w3-round w3-padding w3-card">
              Normaali
            </div>
          </div>
          <div class="w3-quarter w3-center w3-padding-small">
            <div class="w3-border w3-round w3-padding w3-card w3-blue">
              Kiireellinen <i class="fas fa-exclamation-circle w3-padding-small"></i>
            </div>
          </div>
          <div class="w3-quarter w3-center w3-padding-small">
            <div class="w3-border w3-round w3-padding w3-card w3-leftbar w3-border-blue">
              Tulostumassa <i class="fas fa-circle-notch fa-spin w3-padding-small"></i>
            </div>
          </div>
          <div class="w3-quarter w3-center w3-padding-small">
            <div class="w3-border w3-round w3-padding w3-card w3-text-white" style="background: #335773">
              Valmis <i class="fas fa-check w3-padding-small"></i>
            </div>
          </div>
        </div>

        <h3>Tulosteen aloitus</h3>
        <p>Käynnistä tulostus <i class="fas fa-play w3-blue w3-round w3-padding-small"></i> painikkeella.</p>
        <p>Halutessasi voit käynnistää laskurin uudelleen painamalla <i class="fas fa-history w3-blue w3-round w3-padding-small"></i> painiketta.</p>

        <h3>Tulosteen muokkaus</h3>
        <p>Voit muokata lisättyä tulostetta <i class="fas fa-edit w3-blue w3-round w3-padding-small"></i> painikkeella.</p>
        <p>Tulosteen muokkaus säilyttää kappaleen aseman jonossa entisellään.</p>

        <h3>Tulosteen poisto</h3>
        <p>Poista valmis, tai virheellinen tuloste <i class="fas fa-trash-alt w3-blue w3-round w3-padding-small"></i> painikkeella.</p>

        <router-link to="/" class="w3-button w3-block w3-blue w3-text-white w3-hover-blue w3-hover-text-white w3-hover-opacity w3-round-small">
          Takaisin
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'help',
  }
</script>
    
<style scoped>
h3 {
  text-decoration: underline;
  font-weight: bold;
  margin-bottom: 24px;
}
</style>