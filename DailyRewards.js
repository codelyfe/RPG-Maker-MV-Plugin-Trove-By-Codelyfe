/*:
 * @plugindesc 📅 Daily Reward Plugin – Grants daily login rewards and tracks streaks using localStorage by Randal C Burger Jr - ShipWr3ck.com 
 *
 * @license
 * This plugin is licensed for use in free software only. 
 * Commercial use requires purchasing a commercial license from the author.
 *
 * @help
 * Automatically shows a reward screen once per real-world day.
 */

(function () {
  const STORAGE_KEY = "dailyReward";
  const REWARDS = [
    { type: "item", id: 1, amount: 3 },
    { type: "gold", amount: 100 },
    { type: "weapon", id: 1, amount: 1 },
    { type: "item", id: 2, amount: 5 },
    { type: "armor", id: 1, amount: 1 },
    { type: "gold", amount: 250 },
    { type: "item", id: 3, amount: 10 }
  ];

  const getToday = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const giveReward = (reward) => {
    switch (reward.type) {
      case "gold":
        $gameParty.gainGold(reward.amount);
        $gameMessage.add(`You received ${reward.amount} gold!`);
        break;
      case "item":
        $gameParty.gainItem($dataItems[reward.id], reward.amount);
        $gameMessage.add(`You received ${reward.amount}x ${$dataItems[reward.id].name}!`);
        break;
      case "weapon":
        $gameParty.gainItem($dataWeapons[reward.id], reward.amount);
        $gameMessage.add(`You received ${reward.amount}x ${$dataWeapons[reward.id].name}!`);
        break;
      case "armor":
        $gameParty.gainItem($dataArmors[reward.id], reward.amount);
        $gameMessage.add(`You received ${reward.amount}x ${$dataArmors[reward.id].name}!`);
        break;
    }
  };

  const showDailyReward = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    const today = getToday();
    if (saved.date === today) return;

    const streak = saved.streak ? (saved.streak + 1) % REWARDS.length : 0;
    const reward = REWARDS[streak];
    $gameMessage.add(`Daily Reward - Streak ${streak + 1}!`);
    giveReward(reward);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, streak }));
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    showDailyReward();
  };
})();
