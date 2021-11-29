import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/squid-game-test.js';

describe('SquidGameTest', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<squid-game-test></squid-game-test>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
