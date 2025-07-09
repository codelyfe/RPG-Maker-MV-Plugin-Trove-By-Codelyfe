
/*:
 * @plugindesc 📰 RSS Feed Viewer – Displays multiple RSS feeds in-game with a floating button. Player pauses when feed is open. by Randal C Burger Jr - Shipwr3ck.com
 * @author Randal C Burger Jr
 *
 * @license
 * This plugin is licensed for use in free software only. 
 * Commercial use requires purchasing a commercial license from the author.
 *
 * @help
 * No plugin commands. Add your RSS URLs in the FEEDS array.
 */

(function () {
  const FEEDS = [
    { name: "BBC", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
    { name: "CNN", url: "http://rss.cnn.com/rss/edition_world.rss" },
    { name: "Reuters", url: "http://feeds.reuters.com/Reuters/worldNews" },
    { name: "Al Jazeera", url: "https://www.aljazeera.com/xml/rss/all.xml" },
    { name: "NY Times", url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml" },
    { name: "NPR", url: "https://feeds.npr.org/1004/rss.xml" },
    { name: "ABC News", url: "https://abcnews.go.com/abcnews/internationalheadlines" },
    { name: "CBC", url: "https://www.cbc.ca/cmlink/rss-world" },
    { name: "Sky News", url: "https://feeds.skynews.com/feeds/rss/world.xml" },
    { name: "DW", url: "https://rss.dw.com/rdf/rss-en-world" },
  ];

  let isRSSOpen = false;

  function createFloatingButton() {
    const button = document.createElement("div");
    button.id = "rss_button";
    button.innerHTML = "🌍";
    Object.assign(button.style, {
      position: "absolute",
      top: "10px",
      right: "220px",
      width: "48px",
      height: "48px",
      fontSize: "24px",
      backgroundColor: "#222",
      color: "#fff",
      borderRadius: "50%",
      textAlign: "center",
      lineHeight: "48px",
      cursor: "pointer",
      zIndex: 99,
    });

    button.onclick = toggleRSSOverlay;
    document.body.appendChild(button);
  }

  function toggleRSSOverlay() {
    const existing = document.getElementById("rss_overlay");
    if (existing) {
      existing.remove();
      isRSSOpen = false;
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "rss_overlay";
    Object.assign(overlay.style, {
      position: "absolute",
      top: "80px",
      right: "20px",
      width: "360px",
      height: "500px",
      backgroundColor: "#111",
      color: "#fff",
      overflow: "auto",
      padding: "10px",
      zIndex: 98,
      border: "1px solid #444",
      borderRadius: "8px",
    });

    overlay.innerHTML = "<b>Loading world news feeds...</b>";
    document.body.appendChild(overlay);
    isRSSOpen = true;

    let loadedCount = 0;
    let allHtml = "";

    FEEDS.forEach(feed => {
      fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feed.url))
        .then(res => res.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            const items = data.items.slice(0, 3);
            allHtml += `<div style="margin-bottom:12px;"><b>${feed.name}</b><br>`;
            allHtml += items.map(item =>
              `<div style="margin: 5px 0;">
                <b>${item.title}</b><br>
                <a href="${item.link}" target="_blank" style="color:#4cf">Read more</a>
              </div>`).join("");
            allHtml += "</div>";
          } else {
            allHtml += `<div><b>${feed.name}</b>: No items found.</div>`;
          }
        })
        .catch(() => {
          allHtml += `<div><b>${feed.name}</b>: Failed to load.</div>`;
        })
        .finally(() => {
          loadedCount++;
          if (loadedCount === FEEDS.length) overlay.innerHTML = allHtml;
        });
    });
  }

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function () {
    if (!isRSSOpen) _Scene_Map_update.call(this);
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function () {
    _Scene_Map_start.call(this);
    if (!document.getElementById("rss_button")) createFloatingButton();
  };

  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function () {
    _Scene_Map_terminate.call(this);
    const button = document.getElementById("rss_button");
    const overlay = document.getElementById("rss_overlay");
    if (button) button.remove();
    if (overlay) overlay.remove();
    isRSSOpen = false;
  };
})();
