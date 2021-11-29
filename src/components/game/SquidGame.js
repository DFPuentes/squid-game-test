/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import '@material/mwc-button';
import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-icon';

export class SquidGame extends LitElement {
  static get properties() {
    return {
      player: { type: String },
      stop: {
        type: Boolean,
        attribute: false,
      },
      stopTimer: {
        type: Number,
        attribute: false,
      },
      step: { type: Number },
      stepMiss: {
        type: Number,
        attribute: false,
      },
      miss: {
        type: Number,
        attribute: false,
      },
      lastSide: {
        type: String,
        attribute: false,
      },
      minGreen: {
        type: Number,
        attribute: false,
      },
      highScore: {
        type: Number,
        attribute: false,
      },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(1rem + 2vmin);
        margin: 0 auto;
        text-align: center;
        background-color: var(--squid-game-background-color);
      }

      mwc-top-app-bar {
        width: 100%;
      }

      p#highScore {
        padding-top: 10%;
        font-size: 135%;
      }

      p#traffic mwc-icon {
        font-size: 350%;
      }

      mwc-button {
        width: 40%;
      }

      #score {
        padding-bottom: 6%;
      }

      #buttonContainer {
        display: flex;
        flex-direction: row;
        place-content: space-between center;
        align-items: flex-start;
        min-width: 70%;
        justify-content: space-evenly;
      }

      .stop {
        text-shadow: #fff 0px 0px 5px, #fff 0px 0px 10px, #fff 0px 0px 15px,
          #ff0000 0px 0px 20px, #ff0000 0px 0px 30px, #ff0000 0px 0px 40px;
        color: #ff0000;
        transition: text-shadow, color 0.1s ease-in-out;
      }

      .go {
        text-shadow: #fff 0px 0px 5px, #fff 0px 0px 10px, #fff 0px 0px 15px,
          #00ff00 0px 0px 20px, #00ff00 0px 0px 30px, #00ff00 0px 0px 40px;
        color: #00ff00;
        transition: text-shadow, color 0.1s ease-in-out;
      }
    `;
  }

  constructor() {
    super();
    this.step = 0;
    this.miss = 0;
    this.highScore = 0;
    this.stepMiss = 5;
    this.stop = true;
    this.stopTimer = 3000;
    this.minGreen = 2000;
  }

  firstUpdated() {
    this._mainLoop();
  }

  render() {
    return html`
      <mwc-top-app-bar dense>
        <div slot="title">Hi ${decodeURI(this.player)}</div>
        <mwc-icon-button
          icon="logout"
          slot="actionItems"
          @click=${this._handleClickExit}
        >
        </mwc-icon-button>
      </mwc-top-app-bar>

      <p id="highScore">High Score: ${this.highScore}</p>

      <p id="traffic">
        <mwc-icon class="stop">traffic</mwc-icon>
      </p>

      <div id="score">${this.step}</div>

      <div id="buttonContainer">
        <mwc-button
          unelevated
          label="Left"
          @click=${this._handleClickStep}
        ></mwc-button>

        <mwc-button
          unelevated
          label="Right"
          @click=${this._handleClickStep}
        ></mwc-button>
      </div>

      <audio></audio>
    `;
  }

  get audioPlayer() {
    return this.shadowRoot.querySelector('audio');
  }

  get traffic() {
    return this.shadowRoot.querySelector('#traffic mwc-icon');
  }

  _mainLoop() {
    this._updatePlayerScore(this._getScore(this.player));
    setTimeout(() => {
      this._go();
    }, this.stopTimer);
  }

  _go() {
    this.stop = false;
    this.traffic.classList.remove('stop');
    this.traffic.classList.add('go');

    let greenLight =
      Math.ceil(10000 - this.step * 100) + this._getRandom(-1500, 1500);

    if (greenLight < this.minGreen) {
      greenLight = this.minGreen;
    }

    setTimeout(() => {
      this._stop();
      this._playSound('dong');
    }, greenLight);
  }

  _stop() {
    this.stop = true;
    this.traffic.classList.remove('go');
    this.traffic.classList.add('stop');
    setTimeout(() => {
      this._go();
      this._playSound('ding');
    }, this.stopTimer);
  }

  _handleClickExit() {
    window.history.pushState(null, '', `/home`);
  }

  _handleClickStep(e) {
    const side = e.target.label;

    if (this.stop === false && this.lastSide === side) {
      this.step -= 1;

      if (this.step < 0) {
        this.step = 0;
      }
    }

    if (this.stop === false && this.lastSide !== side) {
      this.step += 1;
    }

    if (this.stop) {
      this.step = 0;
    }

    if (this.step > this.highScore) {
      this.highScore = this.step;
    }

    this.lastSide = side;

    this._playSound(side);

    this._setScore(this.player, this.step, this.highScore);
  }

  _getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  _setScore(player, score, highScore) {
    const storage = JSON.parse(window.localStorage.getItem('squidGame')) || [];
    const dataBlock = storage.filter(value => value.player !== player);
    const playerData = [...dataBlock, { player, score, highScore }];
    window.localStorage.setItem('squidGame', JSON.stringify(playerData));
  }

  _getScore(player) {
    const storage = JSON.parse(window.localStorage.getItem('squidGame')) || [];
    return storage.filter(value => value.player === player);
  }

  _updatePlayerScore(playerScore) {
    if (Array.isArray(playerScore) && playerScore.length > 0) {
      this.step = playerScore[0].score;
      this.highScore = playerScore[0].highScore;
    }
  }

  _playSound(sound) {
    this.audioPlayer.src = `../../assets/audios/${sound}.mp3`;
    this.audioPlayer.play();
  }
}
