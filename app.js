// PLAN
/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 * 11. Volume
 **/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const timeStart = $('.time-start');
const timeEnd = $('.time-end');
const Nmb1Start = $('.Nmb1Start');
const Nmb2Start = $('.Nmb2Start');
const Nmb1End = $('.Nmb1End');
const Nmb2End = $('.Nmb2End');
const volume = $('#volume');
const volumeIcon = $('.volume-icon');
const muteVolume = $('.mute-volume');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: 'Chandelier',
            singer: 'Sia',
            path: './assets/music/Chandelier-Sia.mp3',
            image: './assets/img/chandelier.png',
        },
        {
            name: 'Cheap Thrills',
            singer: 'Sia',
            path: './assets/music/Cheap-Thrills-Sia-Sean-Paul.mp3',
            image: './assets/img/cheap-thrills.webp',
        },
        {
            name: 'Falling-In-Love',
            singer: 'Na Ngoc Anh',
            path: './assets/music/Falling-In-Love-Na-Ngoc-Anh.mp3',
            image: './assets/img/falling-in-love.webp',
        },
        {
            name: 'Quả Phụ Tướng',
            singer: 'Dunghoangpham',
            path: './assets/music/Qua-Phu-Tuong-Dunghoangpham.mp3',
            image: './assets/img/quaphutuong.webp',
        },
        {
            name: 'Răng khôn',
            singer: 'Phi Phuong Anh',
            path: './assets/music/Rang-Khon-Phi-Phuong-Anh-RIN9.mp3',
            image: './assets/img/rangkhon.webp',
        },
        {
            name: 'Chandelier',
            singer: 'Sia',
            path: './assets/music/Chandelier-Sia.mp3',
            image: './assets/img/chandelier.png',
        },
        {
            name: 'Kết Thúc Mở',
            singer: 'Vương Anh Tú',
            path: './assets/music/Ket-thuc-mo-Vuong-anh-tu.mp3',
            image: './assets/img/Ket-thuc-mo-Vuong-anh-tu.jpg',
        },
        {
            name: 'Falling-In-Love',
            singer: 'Na Ngoc Anh',
            path: './assets/music/Falling-In-Love-Na-Ngoc-Anh.mp3',
            image: './assets/img/falling-in-love.webp',
        },
        {
            name: 'Qua-Phu-Tuong',
            singer: 'Dunghoangpham',
            path: './assets/music/Qua-Phu-Tuong-Dunghoangpham.mp3',
            image: './assets/img/quaphutuong.webp',
        },
        {
            name: 'Rang Khon',
            singer: 'Phi Phuong Anh',
            path: './assets/music/Rang-Khon-Phi-Phuong-Anh-RIN9.mp3',
            image: './assets/img/rangkhon.webp',
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${
                    index === this.currentIndex ? 'active' : ''
                }" data-index = "${index}">
                    <div class="thumb" style="background-image: url('${
                        song.image
                    }')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `;
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimate = cdThumb.animate(
            [{ transform: 'rotate(360deg)' }],
            {
                duration: 10000, // 10 seconds
                iterations: Infinity,
            }
        );
        cdThumbAnimate.pause();

        // // handle zooming CD
        // document.onscroll = function () {
        //     const scrollTop =
        //         window.scrollY || document.documentElement.scrollTop;
        //     const newCdWidth = cdWidth - scrollTop;
        //     cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
        //     cd.style.opacity = newCdWidth / cdWidth;
        // };

        // Handle click Play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };
        // Change song tempo
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Running volume bar
        volume.oninput = function (e) {
            audio.volume = e.currentTarget.value / 100;
            if (audio.volume == 0) {
                audio.muted = true;
                volumeIcon.classList.remove('fa-volume-high');
                volumeIcon.classList.add('fa-volume-xmark');
            } else {
                audio.muted = false;
                volumeIcon.classList.remove('fa-volume-xmark');
                volumeIcon.classList.add('fa-volume-high');
            }
        };

        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Handle on/off random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        // Handle on/off repeat song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Handle next song and repeat song
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Listen to playlist click behavior
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                // Handle click song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Handle click option
                if (e.target.closest('.option')) {
                }
            }
        };

        // Handle click on volume
        volumeIcon.onclick = function () {
            if (audio.muted == false) {
                audio.muted = true;
                volumeIcon.classList.remove('fa-volume-high');
                volumeIcon.classList.add('fa-volume-xmark');
                volume.value = 0;
            } else {
                audio.muted = false;
                volumeIcon.classList.remove('fa-volume-xmark');
                volumeIcon.classList.add('fa-volume-high');
                volume.value = Math.floor(audio.volume * 100);
            }
        };
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.active.song').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        // Assign configuration from config to object
        this.loadConfig();

        // Property definition for object
        this.defineProperties();

        // Listen/handle events
        this.handleEvent();

        // Load the first song info into the UI when running the app
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Show initial status of button repeat and random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();

const toggle = document.querySelector('.icon-toggle');
const back = document.querySelector('.icon-back');
const menu = document.querySelector('.wrapper-playlist');
const activeClass = 'is-show';

window.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !e.target.matches('.icon-toggle')) {
        menu.classList.remove(activeClass);
    }
});

toggle.addEventListener('click', function () {
    menu.classList.add(activeClass);
});
back.addEventListener('click', function () {
    menu.classList.remove(activeClass);
});
