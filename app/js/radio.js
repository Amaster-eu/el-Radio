const electron = require('electron');
let {ipcRenderer} = electron;
let volume = 80;
let link = '';
let isPlay = false;
let isAutoplay = false;
let isListView = true;
let w = window.innerWidth;
let h = window.innerHeight;

let audio = document.createElement('audio');
let btnMore = document.querySelector('.button-more');
let btnPrev = document.querySelector('.button-previous');
let btnPlay = document.querySelector('.button-play');
let btnNext = document.querySelector('.button-next');
let volumeMove = document.querySelector('.progress-volume-outer');

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    if (isAutoplay) {
      buttonPlay();
    }
    timer();
  }
};

document.addEventListener('click', function (event) {
  clickThis(event);
}, false);

document.addEventListener('dblclick', function (event) {
  let t = event.target;

  if (t.classList.contains('station')) {
    clickThis(event);
    isPlay = false;
    removeIconSound();
    buttonPlay();
  }
}, false);

function clickThis(event) {
  let t = event.target;

  if (t.classList.contains('station')) {
    link = t.getAttribute('data-url');
    removeAllClass('active');
    t.classList.add('active');
    document.querySelector('.h1').innerHTML = t.getAttribute('data-title');
    document.querySelector('.location').innerHTML = t.getAttribute('data-location');
  }
}

function clickTarget(t) {
  if (t.classList.contains('station')) {
    link = t.getAttribute('data-url');
    removeAllClass('active');
    t.classList.add('active');
    document.querySelector('.h1').innerHTML = t.getAttribute('data-title');
    document.querySelector('.location').innerHTML = t.getAttribute('data-location');
  }
}

function buttonPlay() {
  let el;
  let classBtnPlay = document.querySelector('.button-play');
  let classVideo = document.querySelector('.video');

  removeAllClass('playing');
  if (isPlay) {
    audio.pause();
    classBtnPlay.classList.remove('button-pause');
    classVideo.pause();
    isPlay = false;
  } else {
    if (link !== '') {
      el = document.querySelector('.active');
      audio.src = link;
    } else {
      el = document.querySelector('.station:nth-child(1)');
      audio.src = el.getAttribute('data-url');
    }
    el.classList.add('playing');
    classVideo.play();
    indicatorShow(el);
    audio.volume = volume / 100;
    audio.play();
    classBtnPlay.classList.add('button-pause');
    isPlay = true;
  }
}

btnPlay.addEventListener('click', function (e) {
  e.preventDefault();
  buttonPlay();
});

function buttonPrev() {
  let p;

  if (link === '') {
    p = document.querySelector('.station:first-child');
    audio.src = p.getAttribute('data-url');
  } else {
    p = document.querySelector('.active').previousElementSibling;
  }

  if (p === null) {
    p = document.querySelector('.station:last-child');
  }
  clickTarget(p);

  if (isPlay) {
    isPlay = false;
    removeIconSound();
    buttonPlay();
  }
}

btnPrev.addEventListener('click', function (e) {
  e.preventDefault();
  buttonPrev();
});

function buttonNext() {
  let n;

  if (link === '') {
    n = document.querySelector('.station:first-child');
    audio.src = n.getAttribute('data-url');
  } else {
    n = document.querySelector('.active').nextElementSibling;
  }

  if (n === null) {
    n = document.querySelector('.station:first-child');
  }
  clickTarget(n);

  if (isPlay) {
    isPlay = false;
    removeIconSound();
    buttonPlay();
  }
}

btnNext.addEventListener('click', function (e) {
  e.preventDefault();
  buttonNext()
});

btnMore.addEventListener('click', function (e) {
  e.preventDefault();
  let body = document.body.classList;

  isListView = !isListView;
  if (isListView) {
    body.remove('mini');
    ipcRenderer.send('resize', w, h + 20);
  } else {
    w = window.innerWidth;
    h = window.innerHeight;
    body.add('mini');
    ipcRenderer.send('resize', 402, 165);
  }
});

function indicatorShow(el) {
  el.innerHTML = '<div class="icon-sound"><span></span><span></span><span></span><span></span></div>';
}

function timer() {
  setInterval(function () {
    let a = [];

    if (document.querySelector('.icon-sound')) {
      for (let i = 1; i < 5; i++) {
        a[i] = randomInteger(5, 15);
        document.querySelector('.icon-sound span:nth-child(' + i + ')').style.height = a[i] + 'px';
      }
    }
  }, 200);
}

function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function volumeSet(event) {
  let left = document.querySelector('.progress-volume-outer').getBoundingClientRect().left;

  if (window.event)
    event = window.event;
  let mouseX = event.clientX - left;
  let newVol = Math.floor(mouseX);

  document.querySelector('.progress-volume-inner').style.width = newVol + 'px';
  volume = newVol + 1;

  document.querySelector('.icon-volume').classList.remove('volume-mute', 'volume-low', 'volume-high');
  if (volume > 0) document.querySelector('.icon-volume').classList.add('volume-mute');
  if (volume >= 33) document.querySelector('.icon-volume').classList.add('volume-low');
  if (volume >= 66) document.querySelector('.icon-volume').classList.add('volume-high');

  audio.volume = volume / 100;
}

volumeMove.addEventListener('click', function (e) {
  e.preventDefault();
  volumeSet(e);
});

function removeAllClass(elClass) {
  let el = document.querySelectorAll('li.' + elClass);

  for (let i = 0; i < el.length; i++) {
    el[i].classList.remove(elClass);
  }
}

function removeIconSound() {
  let iconSound = document.querySelector('.icon-sound');

  if (iconSound !== null) iconSound.parentNode.removeChild(iconSound);
}
