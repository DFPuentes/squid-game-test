import { LitElement, html, css } from 'lit';
import '@material/mwc-button';
import '@material/mwc-textfield';

export class SquidHome extends LitElement {
  static get properties() {
    return {
      nameInputValue: {
        type: String,
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
        font-size: calc(10px + 2vmin);
        margin: 0 auto;
        text-align: center;
        padding-top: 10%;
        background-color: var(--squid-game-background-color);
      }

      mwc-icon {
        font-size: 1em;
      }

      mwc-button {
        --mdc-button-horizontal-padding: 6em;
      }
    `;
  }

  constructor() {
    super();
    this.nameInputValue = '';
  }

  render() {
    return html`
      <p>
        <mwc-icon>mouse</mwc-icon>
        <br />
        Create new player
      </p>

      <mwc-textfield
        outlined
        label="Name*"
        @change=${this._onInputName}
      ></mwc-textfield>

      <br />

      <mwc-button unelevated label="Join" @click=${this._handleClickGame}>
      </mwc-button>
    `;
  }

  _onInputName(e) {
    this.nameInputValue = e.target.value;
  }

  _handleClickGame() {
    window.history.pushState(null, '', `/game/${this.nameInputValue}`);
  }
}
