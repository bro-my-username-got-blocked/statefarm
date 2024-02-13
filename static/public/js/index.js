const form = document.querySelector("form");
const input = document.getElementById("searchInput");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let url = input.value.trim();
    openURL(url);
  });
  
function isUrl(val = "") {
    if (
        /^http(s?):\/\//.test(val) ||
        (val.includes(".") && val.substr(0, 1) !== " ")
    )
        return true;
    return false;
}
  

// open url function
function openURL(url) {
    window.navigator.serviceWorker
    .register("./uv.js", {
      scope: __uv$config.prefix,
    })
    .then(() => {
      if (!isUrl(url)) url = getSearchEngineURL() + url;
      else if (!(url.startsWith("https://") || url.startsWith("http://")))
        url = "http://" + url;

      if (getAboutBlank() === 'on') {
        openAboutBlank(window.location.href.slice(0, -1) + __uv$config.prefix + __uv$config.encodeUrl(url));
      } else {
        window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
      }
    });
};
if (getAboutBlank() === 'on') {
    openPage('search');
    selectedIcon('icon-search');
}

setupCustomShortcut();

const $searchSelect = document.getElementById('searchSelect');
$searchSelect.value = getSearchEngine();

const $analyticsSelect = document.getElementById('analyticsSelect');
$analyticsSelect.value = getAnalytics();

const $aboutBlankSelect = document.getElementById('aboutBlankSelect');
$aboutBlankSelect.value = getAboutBlank();


// get search engine url
function getSearchEngineURL() {
    return 'https://google.com/search?q=';
}

// Start of about:blank functions

// opens page in about:blank
function openAboutBlank(url) {
    if (url === undefined) {
      var encoded_url = window.location.origin;
    }
    else {
      var encoded_url = url;
    }
    var w = open('about:blank', '_blank') || alert("It seems like you are blocking pop-ups. Please try again once you have allowed pop-ups.")
      w.document.write(`<iframe style="height: 100%; width: 100%; border: none;" src="${encoded_url}" allowfullscreen></iframe>`)
      w.document.body.style.margin = '0'
    window.location.replace(getSearchEngineURL()); 
}
// end of about:blank functions

// changes the selected icon
function selectedIcon(icon) {
    const icons = document.querySelectorAll(`[id^="icon"]`);
    icons.forEach(element =>{
        element.classList.remove('sidebar-icon-selected');
    });
    document.getElementById(icon).classList.toggle('sidebar-icon-selected')
}

// opens a certain page using css and hides the others
function openPage(page) {
    if (page === 'home') {
        document.getElementById("search").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("home").style.display = "flex";
        document.getElementById("footer").style.display = "block";
        document.getElementById("password").style.display = "none";
    } else if (page === 'search') {
        document.getElementById("home").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("search").style.display = "flex";
        document.getElementById("footer").style.display = "block";
        document.getElementById("password").style.display = "none";
    } else if (page === 'settings') {
        document.getElementById("home").style.display = "none";
        document.getElementById("search").style.display = "none";
        document.getElementById("settings").style.display = "flex";
        document.getElementById("footer").style.display = "none";
        document.getElementById("password").style.display = "none";
    } else if (page === 'password') {
        document.getElementById("home").style.display = "none";
        document.getElementById("search").style.display = "none";
        document.getElementById("settings").style.display = "none";
        document.getElementById("footer").style.display = "none";
        document.getElementById("password").style.display = "flex";
    }
}
// changes the favicon
function changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
     document.head.removeChild(oldLink);
    }
    document.head.appendChild(link);
   }
   
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(window.location.origin + "/js/sw.js");
  }

// announcement code
function announcement(text) {
    document.getElementById("notification-text").innerHTML = text;
    document.getElementById("announcement").style.display = "block";
}

function fetchAnnouncement() {
    fetch("./assets/announcement.json")
    .then(response => response.json())
    .then(data => {
        // randonly selects an announcement
        const announcementText = data.announcements.sort();
        const randomAnnouncement = announcementText[Math.floor(Math.random() * announcementText.length)];
        const importantAnnouncement = data['important'][0]
        const superAnnouncement = data['super'][0]
        if (superAnnouncement != null) {
            announcement(superAnnouncement);
        } else {
            // randomly choose between important and normal announcement
            const random = Math.floor(Math.random() * 2);
            if (random === 0) {
                announcement(randomAnnouncement);
            } else {
                announcement(importantAnnouncement);
            }
        }
    });
}
showAnnouncement();

// end of announcement code
