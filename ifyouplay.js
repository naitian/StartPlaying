const presets = {
  'rewind': {
    id: 'YbJOTdZBX1g',
    timestamp: '6:58'
  },
  'ddu': {
    id: 'IHNzOHi8sJs',
    timestamp: '1:18'
  },
  'abba': {
    id: '3Uo0JAUWijM',
    timestamp: '0:46'
  }
}

const GOTIME = new Date('January 1, 2019 00:00:00');

var player;
var vid;
var video_countdown = false;

function initYoutubePlayerAPI() {
  var tag = document.createElement('script');

  tag.src = "//www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function parseTimestampIntoSeconds(timestamp) {
  const parts = timestamp.split(':');
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
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: vid.id,
    events: {
      'onReady': onPlayerReady,
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
  console.log('delta: ', delta);
  console.log('seconds: ', seconds);
  if (delta > 0 && delta <= seconds) {
    player.seekTo(seconds - delta);
    player.playVideo();
    console.log('Played Video');
  } else {
    if (delta < 0) return;
    console.log('Waiting .5 seconds');
    console.log('Waiting', (delta - seconds) * 0.5, 'seconds');
    window.setTimeout(playVideoIfTime, (delta - seconds) * 500);
  }
}

function renderCountdown() {
  let remaining = parseInt((GOTIME - new Date()) / 1000);
  if (video_countdown) {
    remaining -= parseTimestampIntoSeconds(vid.timestamp);
  }
  remaining = remaining < 0 ? 60 * 60 * 24 - remaining: remaining;

  var date = new Date(null);
  date.setSeconds(remaining);
  var timeString = date.toISOString().substr(11, 8);

  document.querySelector('.clock').innerText = timeString;
  console.log(timeString)
  window.setTimeout(renderCountdown, 500);
}

function ringInTheNewYear(vid) {
  initYoutubePlayerAPI();
  renderCountdown();
}

window.onload = function () {
  console.log('Loaded');

  let url = new URL(window.location.href);
  if (url.searchParams.get('custom')) {
    const id = url.searchParams.get('id');
    const timestamp = url.searchParams.get('timestamp');
    vid = {
      id,
      timestamp
    }
  } else {
    vid = presets[url.searchParams.get('preset')];
    if (!vid) console.error('Preset not found: ', url.searchParams.get('preset'));
  }

  ringInTheNewYear(vid);
}