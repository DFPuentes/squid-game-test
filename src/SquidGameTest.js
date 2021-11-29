import { LitElement, html } from 'lit';
import '@appnest/web-router';
import './components/game/squid-game.js';
import './components/home/squid-home.js';

import { SquidGame } from './components/game/SquidGame.js';
import { SquidHome } from './components/home/SquidHome.js';

const ROUTES = [
  { path: 'home', component: SquidHome },
  {
    path: 'game/:player',
    component: SquidGame,
    setup: (component, info) => {
      component.setAttribute('player', info.match.params.player);
    },
  },
  { path: '**', redirectTo: 'home' },
  { path: '/', redirectTo: 'home' },
];

export class SquidGameTest extends LitElement {
  get routerSlot() {
    return this.shadowRoot.querySelector('router-slot');
  }

  firstUpdated() {
    super.firstUpdated();
    this.routerSlot.add(ROUTES);
  }

  render() {
    return html` <router-slot></router-slot>`;
  }
}
