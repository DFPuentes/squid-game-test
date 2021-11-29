import { html } from 'lit';
import { nextFrame, fixture, expect } from '@open-wc/testing';

import '../src/squid-game-test.js';
import '../src/components/game/squid-game.js';
import '../src/components/home/squid-home.js';

describe('SquidGameTest', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<squid-game-test></squid-game-test>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('SquidHome', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<squid-home></squid-home>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('Should add a player and click on "Join" ', async () => {
    const homeInput = element.shadowRoot.querySelector('mwc-textfield');
    const homeButton = element.shadowRoot.querySelector(
      'mwc-button[label="Join"]'
    );

    homeInput.setAttribute('value', 'dany');
    await nextFrame();

    homeButton.click();
    await nextFrame();

    const value = homeInput.getAttribute('value');

    await expect(value).equal('dany');
  });
});

describe('SquidGame', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<squid-game></squid-game>`);
    element.setAttribute('player', 'dany');
  });

  it('Name should be "dany"', async () => {
    expect(element.player).to.equal('dany');
  });

  it('Traffic Light should be "Green"', async () => {
    await setTimeout(() => {
      expect(element.stop).to.equal(false);
    }, 3100);
  });

  it('Left be should clicked once on red light', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    await setTimeout(() => {
      leftButton.click();
      expect(element.step).to.equal(0);
    }, 1100);
  });

  it('Left be should clicked once', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    await setTimeout(() => {
      leftButton.click();
      expect(element.step).to.equal(1);
    }, 3100);
  });

  it('Left be should clicked twice', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    const rightButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Right"]'
    );

    await setTimeout(() => {
      leftButton.click();
      rightButton.click();
      expect(element.step).to.equal(2);
    }, 3100);
  });

  it('Left be should clicked three time but one miss', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    const rightButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Right"]'
    );

    await setTimeout(() => {
      leftButton.click();
      rightButton.click();
      rightButton.click();
      expect(element.step).to.equal(1);
    }, 3100);
  });
});

describe('SquidHome Manual', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<squid-game></squid-game>`);
    element.setAttribute('player', 'dany');
    element.stopTimer = 100;
    element.minGreen = 10000;
    element.mute = true;
  });

  it('Left be should clicked three time but one miss (Manual)', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    const rightButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Right"]'
    );

    element._go();
    await nextFrame();
    leftButton.click();
    await nextFrame();
    rightButton.click();
    await nextFrame();
    rightButton.click();
    await nextFrame();

    expect(element.step).to.equal(1);
  });

  it('Left be should clicked three times but losse all (Manual)', async () => {
    const leftButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Left"]'
    );
    const rightButton = element.shadowRoot.querySelector(
      '#buttonContainer mwc-button[label="Right"]'
    );

    element._go();
    await nextFrame();
    leftButton.click();
    await nextFrame();
    rightButton.click();
    await nextFrame();
    rightButton.click();
    await nextFrame();

    element._stop();
    rightButton.click();
    await nextFrame();

    expect(element.step).to.equal(0);
  });
});
