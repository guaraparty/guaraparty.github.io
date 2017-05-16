// Spotify IDs
var songList = [
  '5LZQ5s0kRZS9nBSd1xLK7U',
  '4iZPNYqzI2L0uwuUKun7Aa',
  '2wm2nAdNzutPwXRIYjwm9n',
  '4RoOGOBrRCPTD9BXs8jVdN',
  '4FXj4ZKMO2dSkqiAhV7L8t',
  '2HIVSk21I9LwzrBvdvpw7K',
  '2f7sZFUET4uJK83Kw12e1b',
  '2eP6GhdRE1Ydnw2uXzo7q8',
  '6JEK0CvvjDjjMUBFoXShNZ',
  '7JD5OoA5hGBJDCBecoGlCy',
  '6GRc7PPBY8VtTHvOvgDSuC'
];

songList = ['5LZQ5s0kRZS9nBSd1xLK7U'];

// Player below
var Framer = {
    countTicks: 360,
    frequencyData: [],
    tickSize: 10,
    PI: 360,
    index: 0,
    loadingAngle: 0,
    init: function (scene) {
        this.scene = scene;
        this.context = scene.context;
        this.tickSize = this.tickSize;
        this.configure();
    },
    configure: function () {
        this.maxTickSize = this.tickSize * 9 * this.scene.scaleCoef;
        this.countTicks = 434 * Scene.scaleCoef;
    },
    draw: function () {
        this.drawTicks();
        this.drawEdging();
    },
    drawTicks: function () {
        this.context.save();
        this.context.beginPath();
        this.context.lineWidth = 1;
        this.ticks = this.getTicks(this.countTicks, this.tickSize, [0, 90]);
        for (var i = 0, len = this.ticks.length; i < len; ++i) {
            var tick = this.ticks[i];
            this.drawTick(tick.x1, tick.y1, tick.x2, tick.y2);

        }
        this.context.restore();
    },
    drawTick: function (x1, y1, x2, y2) {
        var dx1 = parseInt(this.scene.cx + x1),
            dy1 = parseInt(this.scene.cy + y1),
            dx2 = parseInt(this.scene.cx + x2),
            dy2 = parseInt(this.scene.cy + y2);
        this.context.beginPath();
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 2;
        this.context.moveTo(this.scene.cx + x1, this.scene.cx + y1);
        this.context.lineTo(this.scene.cx + x2, this.scene.cx + y2);
        this.context.stroke();
    },
    setLoadingPercent: function (percent) {
       this.loadingAngle = percent*2*Math.PI;
    },
    drawEdging: function () {
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = '#ffffff';
        this.context.lineWidth = 1;
        var offset = Tracker.lineWidth/2;
        this.context.moveTo(this.scene.padding+2*this.scene.radius - Tracker.innerDelta - offset, this.scene.padding + this.scene.radius);
        this.context.arc(this.scene.cx, this.scene.cy, this.scene.radius - Tracker.innerDelta - offset, 0, this.loadingAngle, false);
        this.context.stroke();
        this.context.restore();
    },
    getTicks: function (count, size, animationParams) {
        var ticks = this.getTickPoitns(count);
        var x1, y1, x2, y2, m = [], tick, k;
        var lesser = 170;
        var allScales = [];
        for (var i = 0, len = ticks.length - 1; i < len; ++i) {
            var coef = 1 - i / (len * 2.5);
            if (i > (ticks.length-1) / 2) {
                 coef = 1 - Math.abs((ticks.length-1) - i) / (len * 2.5);
            }
            var delta = ((this.frequencyData[i] || 0) - lesser * coef) * this.scene.scaleCoef;
            if (i > (ticks.length-1) / 2) {
              delta = ((this.frequencyData[Math.abs((ticks.length-1) - i)] || 0) - lesser * coef) * this.scene.scaleCoef;
            }
            delta = delta < 0 ? 0 : delta;
            tick = ticks[i];
            if (animationParams[0] <= tick.angle && tick.angle <=  animationParams[1]) {
                k = this.scene.radius / (this.scene.radius - this.getSize(tick.angle, animationParams[0], animationParams[1]) - delta);
            } else {
                k = this.scene.radius / (this.scene.radius - (size + delta));
            }
            x1 = tick.x * (this.scene.radius - size);
            y1 = tick.y * (this.scene.radius - size);
            x2 = x1*k;
            y2 = y1*k;
            m.push({x1: x1, y1: y1, x2: x2, y2: y2});
            if (i < 5) {
                var scale = delta / 55;
                scale = scale < 1 ? 1 : scale;
                allScales.push(scale);
            }

        }
        var sum = allScales.reduce(function(pv, cv) { return pv + cv; }, 0) / allScales.length;
        // document.querySelector('.background').style.transform = 'scale('+Math.abs(2.5 - sum)+')';
        document.querySelector('.inner-canvas-wrapper').style.transform = 'scale('+sum+')';
        var cc = Scene.canvas;
        /*var newWidth = cc.width * sum + 'px';
        var newHeight = cc.height * sum + 'px';
        var newMarginTop = '-' + newHeight / 2 + 'px';
        var newMarginLeft = '-' + newWidth / 2 + 'px';
        cc.style.width = newWidth;
        cc.style.height = newHeight;
        cc.style.marginTop = newMarginTop;
        cc.style.marginLeft = newMarginLeft;*/
        return m;
    },

    getSize: function (angle, l, r) {
        var m = (r - l) / 2;
        var x = (angle - l);
        var h;

        if (x == m) {
            return this.maxTickSize;
        }
        var d = Math.abs(m - x);
        var v = Math.sqrt(1 / d);
        if (v > this.maxTickSize) {
            h = this.maxTickSize - d;
        } else {
            h = Math.max(this.tickSize, v);
        }

        if (this.index > this.count) {
            this.index = 0;
        }

        return h;
    },

    getTickPoitns: function (count) {
        var coords = [], step = this.PI / count;
        for (var deg = 0; deg < this.PI; deg += step) {
            var rad = deg * Math.PI / (this.PI / 2);
            coords.push({ x: Math.cos(rad), y: -Math.sin(rad), angle: deg });
        }
        return coords;
    }
};

var Tracker = {
    innerDelta: 20,
    lineWidth: 4,
    prevAngle: 0.5,
    angle: 0,
    animationCount: 0,
    pressButton: false,
    init: function (scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
    },

    initHandlers: function () {
        var that = this;

        this.scene.canvas.addEventListener('mousedown', function (e) {
            if (that.isInsideOfSmallCircle(e) || that.isOusideOfBigCircle(e)) {
                return;
            }
            that.prevAngle = that.angle;
            that.pressButton = true;
            //that.stopAnimation();
            that.calculateAngle(e, true);
        });

        window.addEventListener('mouseup', function () {
            if (!that.pressButton) {
                return;
            }
            var id = setInterval(function () {
                if (!that.animatedInProgress) {
                    that.pressButton = false;
                  var ag = ((that.angle / (2 * Math.PI)) + 0.25);
                  ag = ag > 1.0 ? Math.abs(1.0 - ag) : ag;
                    Player.audio.currentTime = ag * Player.audio.duration;
                    clearInterval(id);
                }
            }, 100);
        });

        window.addEventListener('mousemove', function (e) {
            if (that.animatedInProgress) {
                return;
            }
            if (that.pressButton && that.scene.inProcess()) {
                that.calculateAngle(e);
            }
        });
    },

    isInsideOfSmallCircle: function (e) {
        var x = Math.abs(e.pageX - this.scene.cx - this.scene.coord.left);
        var y = Math.abs(e.pageY - this.scene.cy - this.scene.coord.top);
        return Math.sqrt(x * x + y * y) < this.scene.radius - 3 * this.innerDelta;
    },

    isOusideOfBigCircle: function (e) {
        return Math.abs(e.pageX - this.scene.cx - this.scene.coord.left) > this.scene.radius ||
               Math.abs(e.pageY - this.scene.cy - this.scene.coord.top) > this.scene.radius;
    },

    draw: function () {
        if (!this.pressButton) {
            this.angle = Player.audio.currentTime / Player.audio.duration * 2 * Math.PI || 0;
        }
        this.drawArc();
    },

    drawArc: function () {
        this.context.save();
        this.context.strokeStyle = '#ffffff';
        this.context.beginPath();
        this.context.lineWidth = this.lineWidth;

        this.r = this.scene.radius - (this.innerDelta + this.lineWidth / 2);
        this.context.arc(
            this.scene.radius + this.scene.padding,
            this.scene.radius + this.scene.padding,
            this.r, 0, this.angle, false
        );
        this.context.stroke();
        this.context.restore();
    },

    calculateAngle: function (e, animatedInProgress) {
        this.mx = e.pageX;
        this.my = e.pageY;
        this.angle = Math.atan((this.my - this.scene.cy - this.scene.coord.top) / (this.mx - this.scene.cx - this.scene.coord.left));
        if (this.mx < this.scene.cx + this.scene.coord.left) {
            this.angle = Math.PI + this.angle;
        }
        if (this.angle < 0) {
            this.angle += 2 * Math.PI;
        }
        if (!animatedInProgress) {
            this.prevAngle = this.angle;
        }
      //this.angle -= 180;
    }
};

var Scene = {
    padding: 120,
    minSize: 740,
    optimiseHeight: 982,
    _inProcess: false,
    init: function () {
        this.canvasConfigure();
        this.initHandlers();
        Framer.init(this);
        Tracker.init(this);
        Controls.init(this);
        this.startRender();
    },
    canvasConfigure: function () {
        this.canvas = document.querySelector('canvas.visual');
        this.context = this.canvas.getContext('2d');
        this.context.strokeStyle = '#FFFFFF';
        this.calculateSize();
    },
    calculateSize: function () {
        this.scaleCoef = Math.max(0.5, 740 / this.optimiseHeight);
        var size = Math.max(this.minSize, 1/*document.body.clientHeight */);
        this.canvas.setAttribute('width', size);
        this.canvas.setAttribute('height', size);
        this.width = size;
        this.height = size;
        this.radius = (size - this.padding * 2) / 2;
        this.cx = this.radius + this.padding;
        this.cy = this.radius + this.padding;
        this.coord = this.canvas.getBoundingClientRect();
    },
    initHandlers: function () {
        var that = this;
        window.onresize = function () {
            that.canvasConfigure();
            Framer.configure();
            that.render();
        };
    },
    render: function () {
        var that = this;
        requestAnimationFrame(function () {
            that.clear();
            that.draw();
            if (that._inProcess) {
                that.render();
            }
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.width, this.height);
    },
    draw: function () {
        Framer.draw();
        Tracker.draw();
        Controls.draw();
    },
    startRender: function () {
        this._inProcess = true;
        this.render();
    },
    stopRender: function () {
        this._inProcess = false;
    },
    inProcess: function () {
        return this._inProcess;
    }
};

var Controls = {
    playing: false,
    init: function (scene) {
        this.scene = scene;
        this.context = scene.context;
        this.initHandlers();
        this.timeControl = document.querySelector('.time');
    },
    initHandlers: function () {
        this.initPlayButton();
        this.initPauseButton();
        this.initSoundButton();
        this.initPrevSongButton();
        this.initNextSongButton();
        this.initTimeHandler();
    },
    initPlayButton: function () {
        var that = this;
        this.playButton = document.querySelector('.play');
        this.playButton.addEventListener('mouseup', function () {
            that.playButton.style.display = 'none';
            that.pauseButton.style.display = 'inline-block';
            Player.play();
            that.playing = true;
        });
    },
    initPauseButton: function () {
        var that = this;
        this.pauseButton = document.querySelector('.pause');
        this.pauseButton.addEventListener('mouseup', function () {
            that.playButton.style.display = 'inline-block';
            that.pauseButton.style.display = 'none';
            Player.pause();
            that.playing = false;
        });
    },
    initSoundButton: function () {
        var that = this;
        this.soundButton = document.querySelector('.soundControl');
        this.soundButton.addEventListener('mouseup', function () {
            if (that.soundButton.classList.contains('disable')) {
                that.soundButton.classList.remove('disable');
                Player.unmute();
            } else {
                that.soundButton.classList.add('disable');
                Player.mute();
            }
        });
    },
    initPrevSongButton: function () {
        var that = this;
        this.prevSongButton = document.querySelector('.prevSong');
        this.prevSongButton.addEventListener('mouseup', function () {
            Player.prevTrack();
            that.playing && Player.play();
        });
    },
    initNextSongButton: function () {
        var that = this;
        this.nextSongButton = document.querySelector('.nextSong');
        this.nextSongButton.addEventListener('mouseup', function () {
            Player.nextTrack();
            that.playing && Player.play();
        });
    },
    initTimeHandler: function () {
        var that = this;
        setTimeout(function () {
            var rawTime = parseInt(Player.audio.currentTime || 0);
            var secondsInMin = 60;
            var min = parseInt(rawTime / secondsInMin);
            var seconds = rawTime - min * secondsInMin;
            if (min < 10) {
                min = '0' + min;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            that.timeControl.textContent = min + ':' + seconds;
            that.initTimeHandler();
        }, 300);
    },
    draw: function () {
        this.drawPic();
    },
    drawPic: function () {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = '#ffffff';
        this.context.lineWidth = 1;
        var x = Tracker.r / Math.sqrt(Math.pow(Math.tan(Tracker.angle), 2) + 1);
        var y = Math.sqrt(Tracker.r * Tracker.r - x * x);
        if (this.getQuadrant() == 2) {
            x = -x;
        }
        if (this.getQuadrant() == 3) {
            x = -x;
            y = -y;
        }
        if (this.getQuadrant() == 4) {
            y = -y;
        }
        this.context.arc(this.scene.radius + this.scene.padding + x, this.scene.radius + this.scene.padding + y, 10, 0, Math.PI * 2, false);
        this.context.fill();
        this.context.restore();
    },
    getQuadrant: function () {
        if (0 <= Tracker.angle && Tracker.angle < Math.PI / 2) {
            return 1;
        }
        if (Math.PI / 2 <= Tracker.angle && Tracker.angle < Math.PI) {
            return 2;
        }
        if (Math.PI < Tracker.angle && Tracker.angle < Math.PI * 3 / 2) {
            return 3;
        }
        if (Math.PI * 3 / 2 <= Tracker.angle && Tracker.angle <= Math.PI * 2) {
            return 4;
        }
    }
};

var Player = {
    buffer: null,
    duration: 0,
    tracks: [],
    init: function (src) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();
        try {
            this.javascriptNode = this.context.createScriptProcessor(2048, 1, 1);
            this.javascriptNode.connect(this.context.destination);
            this.Player = this.context.createAnalyser();
            this.Player.connect(this.javascriptNode);
            this.Player.smoothingTimeConstant = 0.7;
            this.Player.fftSize = 2048;
            this.audio = document.querySelector('audio');
            this.loadTrack(0);
            this.source = this.context.createMediaElementSource(this.audio);
            this.destination = this.context.destination;
            this.gainNode = this.context.createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.Player);
            this.gainNode.connect(this.destination);
            this.initHandlers();
        } catch (e) {
            this.audio = {};
            Framer.setLoadingPercent(1);
        }

        Scene.init();
    },
    loadTrack: function (index) {
        var track = this.tracks[index];
        var url = track.url;
        if (!url) {
          alert('Song not available: ' + this.tracks[index]);
          return;
        }
        this.audio.src =  url;
        this.audio.crossOrigin = 'anonymous';
        document.querySelector('.song .artist').textContent = track.artist;
        document.querySelector('.song .name').textContent = track.song;
        BackgroundCanvas.addBackground(track.cover);
        this.currentSongIndex = index;
    },
    nextTrack: function () {
        this.currentSongIndex++;
        if (this.currentSongIndex == this.tracks.length) {
            this.currentSongIndex = 0;
        }
        this.loadTrack(this.currentSongIndex);
    },
    prevTrack: function () {
        --this.currentSongIndex;
        if (this.currentSongIndex == -1) {
            this.currentSongIndex = this.tracks.length - 1;
        }

        this.loadTrack(this.currentSongIndex);
    },
    play: function () {
        this.audio.play();
    },
    stop: function () {
        this.audio.stop();
    },
    pause: function () {
        this.audio.pause();
    },
    mute: function () {
        this.gainNode.gain.value = 0;
    },
    unmute: function () {
        this.gainNode.gain.value = 1;
    },
    initHandlers: function () {
        var that = this;
        var i = 0, startTime = new Date().getTime();
        this.javascriptNode.onaudioprocess = function() {
            Framer.frequencyData = new Uint8Array(that.Player.frequencyBinCount);
            that.Player.getByteFrequencyData(Framer.frequencyData);
        };
        this.audio.addEventListener('progress', function() {
            var v = 1;
            if (this.buffered.length > 0) {
                v = this.buffered.end(0);
            }
            that.duration = this.duration || 1;
            var percent = v / that.duration;
            Framer.setLoadingPercent(percent);
        });
        this.audio.addEventListener('ended', function() {
            Player.nextTrack();
            Player.play();
        });
    }
};

var BackgroundCanvas = {
    addBackground: function(url) {
        var c = document.querySelector('canvas.background'),
            ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        this.img = new Image();
        this.img.addEventListener('load', function() {
            ctx.drawImage(this.img,0,0,c.width,c.height);
        });
        this.img.src = url;
        window.coverImage = this.img;
        c.style.backgroundImage = 'url('+url+')';
    }
};

for (var i = 0; i < songList.length; i++) {
    // WebAPI.tracks(songList[i], function(json) {
    //   if (json && json.preview_url && json.name) {
    //     addSong(json.artists[0].name,json.name,json.preview_url,json.album.images[0].url);
    //   }
    // });
    //
    // if (i === songList.length - 1) {
    // tracks: [
    //        {
    //            artist: "Kavinsky",
    //            song: "Odd Look ft. The Weeknd",
    //            url: "http://katiebaca.com/tutorial/odd-look.mp3"
    //        }
    //    ],
    addSong('', '', 'js/music.mp3', '')
    setTimeout(function() {
        Player.init();
    }, 500);
    // }
}

function addSong(artist,song,url,cover) {
    Player.tracks.push({
        artist: artist,
        song: song,
        url: url,
        cover: cover
    });
}

function getInfoFromFileName(name) {
    name = name == null ? 'Unkown' : name;
    name = name.replace(/_/g, ' ');
    var artist = artist == null ? 'Unkown' : artist;
    if (name.indexOf(' - ') !== -1) {
        name = name.split(' - ');
        artist = name[0];
        name = name[1];
    }
    name = name.split('.')[0];
    return {
        artist: artist,
        title: name
    };
}

function playLast() {
    Player.loadTrack(Player.tracks.length - 1);
    Player.play();
}
