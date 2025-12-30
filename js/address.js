document.addEventListener("DOMContentLoaded", function () {
  var link = document.querySelector(".link-address");
  if (!link) return;
  function openMapUrl(url) {
    if (!url) {
      alert("Не знайдено URL для відкриття мапи");
      return;
    }
    var ok = confirm("Відкрити мапу за адресою?");
    if (ok) window.open(url, "_blank", "noopener");
  }

  link.addEventListener("click", function (e) {
    e.preventDefault();

    // possible fallbacks: data attribute on the link, global variable set in HTML
    var fallback = link.dataset.mapUrl || window.toggleAddressUrl || (window.TOGGLE_ADDRESS && window.TOGGLE_ADDRESS.url) || null;

    fetch("./js/toggle-address.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(function (data) {
        var url = null;
        if (data) {
          if (data.url) url = data.url;
          else if (
            data.configurations &&
            data.configurations[0] &&
            data.configurations[0].url
          )
            url = data.configurations[0].url;
        }
        if (!url) {
          if (fallback) {
            openMapUrl(fallback);
            return;
          }
          alert("Не знайдено URL в toggle-address.json");
          return;
        }
        openMapUrl(url);
      })
      .catch(function (err) {
        if (fallback) {
          console.warn("toggle-address.json fetch failed, using fallback:", err);
          openMapUrl(fallback);
        } else {
          alert("Не вдалося отримати дані: " + err.message);
        }
      });
  });
});
