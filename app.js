new Vue({
  el: "#app",
  data: {
    saludJugador: 100,
    saludMonstruo: 100,
    hayUnaPartidaEnJuego: false,
    turnos: [], //Es para registrar los eventos de la partida
    rangoAtaque: [3, 10],
    rangoAtaqueEspecial: [10, 20],
    rangoAtaqueDelMonstruo: [5, 12],
  },

  methods: {
    getSalud(salud) {
      return `${salud}%`;
    },
    empezarPartida: function () {
      this.hayUnaPartidaEnJuego = true;
      this.saludJugador = 100;
      this.saludMonstruo = 100;
      this.turnos = [];
    },
    atacar: function () {
      var damage = this.calcularHeridas(
        this.rangoAtaque[0],
        this.rangoAtaque[1]
      );
      this.saludMonstruo -= damage;
      this.registrarEvento({
        esJugador: true,
        texto: `El jugador golpea al monstruo por ${damage}%`,
      });
      if (this.verificarGanador()) {
        return;
      }
      this.ataqueDelMonstruo();
    },
    ataqueEspecial: function () {
      var damage = this.calcularHeridas(
        this.rangoAtaqueEspecial[0],
        this.rangoAtaqueEspecial[1]
      );
      this.saludMonstruo -= damage;
      this.registrarEvento({
        esJugador: true,
        texto: `El jugador golpea duramente al monstruo por ${damage}%`,
      });
      if (this.verificarGanador()) {
        return;
      }
      this.ataqueDelMonstruo();
    },
    curar: function () {
      if (this.saludJugador <= 90) {
        var damage = 10;
        this.saludJugador += damage;
      } else {
        damage = 100 - this.saludJugador;
        this.saludJugador = 100;
      }
      this.registrarEvento({
        esJugador: true,
        texto: `El jugador cura su salud en ${damage}%`,
      });
      this.ataqueDelMonstruo();
    },
    registrarEvento(evento) {
      this.turnos.unshift(evento);
    },
    terminarPartida: function () {
      this.hayUnaPartidaEnJuego = false;
    },
    ataqueDelMonstruo: function () {
      var damage = this.calcularHeridas(
        this.rangoAtaqueDelMonstruo[0],
        this.rangoAtaqueDelMonstruo[1]
      );
      this.saludJugador -= damage;
      this.registrarEvento({
        esJugador: false,
        texto: `El monstruo lastima al jugador en ${damage}%`,
      });
      this.verificarGanador();
    },
    calcularHeridas: function (min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    verificarGanador: function () {
      if (this.saludMonstruo <= 0) {
        this.finDeLaPartida("Ganaste!");
        return true;
      } else if (this.saludJugador <= 0) {
        this.finDeLaPartida("Perdiste!");
        return true;
      }
      return false;
    },
    cssEvento(turno) {
      //Este return de un objeto es porque Vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
      return {
        "player-turno": turno.esJugador,
        "monster-turno": !turno.esJugador,
      };
    },
    finDeLaPartida: function (mensaje) {
      if (confirm(`${mensaje} Jugar de nuevo?`)) {
        this.empezarPartida();
      } else {
        this.hayUnaPartidaEnJuego = false;
      }
    },
  },
});
