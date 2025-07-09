/*:
 * @plugindesc 🔄 Reload Button Plugin – Adds a reload button for NW.js and Chrome browsers in RPG Maker MV - By Randal C. Burger Jr - Shipwr3ck.com
 * @help
 * Adds a clickable button in the upper-right corner of the screen
 * that refreshes the game if running in NW.js or Chrome.
 */
/*:
 * @author Randal C. Burger Jr
 * @license Personal Use Only
 *
 * © 2025 Randal C. Burger Jr All rights reserved.
 *
 * This plugin is licensed for personal use only by the purchaser.
 * Redistribution, resale, or modification without permission is prohibited.
 * For commercial or extended licensing, please contact the author.
 */

(() => {
  const isChromeOrNW = () => {
    return /Chrome/.test(navigator.userAgent) || Utils.isNwjs();
  };

  const createRefreshButton = () => {
    const button = new Sprite_Button();
    const bmp = new Bitmap(100, 36);
    bmp.fontSize = 18;
    bmp.textColor = "#ffffff";
    bmp.drawText("🔄 Reload", 0, 0, 100, 36, "center");
    button.bitmap = bmp;
    button.x = Graphics.boxWidth - 110;
    button.y = 10;
    button.z = 9999;

    button.setClickHandler(() => {
      if (isChromeOrNW()) location.reload();
      else alert("Reload not supported in this browser.");
    });

    SceneManager._scene.addChild(button);
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    createRefreshButton();
  };
})();
