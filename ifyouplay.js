const presets = {
  ddu: {
    id: "IHNzOHi8sJs",
    timestamp: "1:18",
    blurb:
      '<a href="https://twitter.com/black2dpink824/status/1079676880746356737">Ddu-Du Ddu-Du, BLACKPINK will hit you with that Ddu-du Ddu-du just as 2019 begins</a>',
    display: true
  },
  abba: {
    id: "3Uo0JAUWijM",
    timestamp: "0:46",
    blurb:
      '<a href="https://twitter.com/morganllaughlin/status/1079695056993468416">Happy New Year by ABBA, ABBA will be the first people to tell you happy new year</a>',
    display: true
  },
  umich: {
    id: "pIKl1NdR3rk",
    timestamp: "01:25",
    blurb:
      "the Michigan Transportation Musical, Billy Magic will introduce himself at midnight.",
    display: true
  },
  gambino: {
    id: "ExVtrghW5Y4",
    timestamp: "1:48",
    blurb: '<a href="https://twitter.com/_emmakitchen/status/1210666080986906624">iv. sweatpants you will enter the new decade knowing that fiskers don’t make noise when they start up</a>',
    display: true
  },
  rachstar: {
    id: "1Crys4ERTVo",
    timestamp: "1:53",
    blurb: "Rach Star, the brass hits at midnight",
    display: true
  },
  crown17: {
    id: "OeoGGw4jMy0",
    timestamp: "11:41",
    blurb: "It Is, you will be known exactly at midnight"
  }
};

const GOTIME = new Date("January 1, 2021 00:00:00");

var player;
var vid;
var video_countdown = false;
var showing_presets = false;

function initYoutubePlayerAPI() {
  var tag = document.createElement("script");

  tag.src = "//www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function parseTimestampIntoSeconds(timestamp) {
  const parts = timestamp.split(":");
  let hours, minutes, seconds;
  if (parts.length == 2) {
    hours = 0;
    minutes = parseInt(parts[0]);
    seconds = parseInt(parts[1]);
  } else {
    hours = parseInt(parts[0]);
    minutes = parseInt(parts[1]);
    seconds = parseInt(parts[2]);
  }
  console.log(seconds + minutes * 60 + hours * 60 * 60);
  return seconds + minutes * 60 + hours * 60 * 60;
}

function onYouTubeIframeAPIReady() {
  const container = document.querySelector(".vid-container");
  player = new YT.Player("player", {
    height: container.clientHeight,
    width: container.clientWidth,
    videoId: vid.id,
    events: {
      onReady: onPlayerReady
      // 'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  playVideoIfTime();
}

function playVideoIfTime() {
  // FIXME: We add one second to account for buffering.
  //        This is not ideal.
  let seconds = parseTimestampIntoSeconds(vid.timestamp) + 1;
  let delta = parseInt((GOTIME - new Date()) / 1000);
  console.log("delta: ", delta);
  console.log("seconds: ", seconds);
  if (delta > 0 && delta <= seconds) {
    player.seekTo(seconds - delta);
    player.playVideo();
    console.log("Played Video");
  } else {
    if (delta < 0) return;
    console.log("Waiting", (delta - seconds) * 0.5, "seconds");
    window.setTimeout(playVideoIfTime, (delta - seconds) * 500);
  }
}

function renderCountdown() {
  let remaining = parseInt((GOTIME - new Date()) / 1000);
  if (video_countdown) {
    remaining -= parseTimestampIntoSeconds(vid.timestamp);
  }
  remaining = remaining < 0 ? 60 * 60 * 24 - remaining : remaining;

  var date = new Date(null);
  date.setSeconds(remaining);
  var timeString = date.toISOString().substr(11, 8);

  if (remaining < 24 * 60 * 60) {
    document.querySelector(".clock").innerText = timeString;
  } else if (remaining < 7 * 24 * 60 * 60) {
    document.querySelector(".clock").innerText = "Less Than A Week";
  } else if (remaining < 30 * 24 * 60 * 60) {
    document.querySelector(".clock").innerText = "Less Than A Month";
  } else {
    document.querySelector(".clock").innerText = "A Long Freaking Time";
  }
  window.setTimeout(renderCountdown, 500);
}

function ringInTheNewYear(vid) {
  if (vid.blurb) {
    let blurb = document.querySelector(".blurb");
    blurb.innerHTML = vid.blurb;
  }
  initYoutubePlayerAPI();
  renderCountdown();
}

function generatePresetList() {
  let url = `${window.location.origin}${window.location.pathname}`;
  let result = "";
  for (let name in presets) {
    if (!presets[name].display) {
      continue;
    }
    let href = `${url}?preset=${name}`;
    let a = `<a href=${href}>${name}</a> `;
    result += a;
  }
  return result + " | ";
}

function handlePresets() {
  console.log("click");
  let presets_container = document.querySelector(".presets");
  let presets_button = document.querySelector(".show-presets");
  if (showing_presets) {
    presets_container.innerHTML = "";
    presets_button.innerText = "presets";
  } else {
    presets_container.innerHTML = generatePresetList();
    presets_button.innerText = "hide";
  }
  showing_presets = !showing_presets;
}

function handleClock(e) {
  let clock_button = e.target;
  video_countdown = !video_countdown;
  if (video_countdown) {
    clock_button.innerText = "until video plays";
  } else {
    clock_button.innerText = "until 2020!";
  }
  renderCountdown();
}

window.onload = function() {
  console.log("Loaded");

  let presets_button = document.querySelector(".show-presets");
  presets_button.onclick = handlePresets;
  let clock_button = document.querySelector(".clock-label");
  clock_button.onclick = handleClock;

  let url = new URL(window.location.href);
  if (url.searchParams.get("custom")) {
    const id = url.searchParams.get("id");
    const timestamp = url.searchParams.get("timestamp");
    vid = {
      id,
      timestamp
    };
  } else {
    vid = presets[url.searchParams.get("preset")];
    if (!vid) {
      console.error("Preset not found: ", url.searchParams.get("preset"));
      const items = Object.keys(presets);
      vid = presets[items[Math.floor(Math.random() * items.length)]];
    }
  }

  ringInTheNewYear(vid);
};
