/*:
 * @plugindesc 🕒 Real-Time Clock with Background – Displays system time with styled background [v1.2] by Randal C Burger Jr - ShipWr3ck.com
 * @license
 * This plugin is licensed for use in free software only. 
 * Commercial use requires purchasing a commercial license from the author.
 * @help
 * Shows a real-time clock with a dark rounded background using PixiJS.
 */

(function () {
  const CLOCK_X = () => Graphics.width - 180;
  const CLOCK_Y = () => 100;
  const WIDTH = 160;
  const HEIGHT = 40;
  const RADIUS = 10;

  const CLOCK_STYLE = {
    fontFamily: "monospace",
    fontSize: 22,
    fill: 0xffffff,
    stroke: 0x000000,
    strokeThickness: 3
  };

  let _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this.createClockDisplay();
  };

  Scene_Map.prototype.createClockDisplay = function () {
    this._clockContainer = new PIXI.Container();

    const bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRoundedRect(0, 0, WIDTH, HEIGHT, RADIUS);
    bg.endFill();
    this._clockContainer.addChild(bg);

    const text = new PIXI.Text(getCurrentTime(), CLOCK_STYLE);
    text.x = 10;
    text.y = 8;
    this._clockContainer.addChild(text);

    this._clockContainer.x = CLOCK_X();
    this._clockContainer.y = CLOCK_Y();
    this._clockText = text;

    this.addChild(this._clockContainer);
  };

  let _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    _Scene_Map_update.call(this);
    if (this._clockText && Graphics.frameCount % 30 === 0) {
      this._clockText.text = getCurrentTime();
    }
  };

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
})();
