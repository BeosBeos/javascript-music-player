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
            name: 'Bí mật nhỏ',
            singer: 'Bray, Helia, Hoàng Tôn',
            path: './assets/music/song-1.mp3',
            image: './assets/img/song-1.jpg',
        },
        {
            name: 'Anh đã từ bỏ rồi đấy',
            singer: 'Nguyenn, Aric',
            path: './assets/music/song-2.mp3',
            image: './assets/img/song-2.jpg',
        },
        {
            name: 'Lúc em cần anh đang ở đâu',
            singer: 'Bảo Uyên, RIN9',
            path: './assets/music/song-3.mp3',
            image: './assets/img/song-3.jpg',
        },
        {
            name: 'Kết thúc mở',
            singer: 'Vương Anh Tú',
            path: './assets/music/song-4.mp3',
            image: './assets/img/song-4.jpg',
        },
        {
            name: 'Cheap Thrills',
            singer: 'Sia, Sean Paul',
            path: './assets/music/song-5.mp3',
            image: './assets/img/song-5.webp',
        },
        {
            name: 'Falling In Love',
            singer: 'Na Ngọc Anh',
            path: './assets/music/song-6.mp3',
            image: './assets/img/song-6.webp',
        },
        {
            name: 'Răng khôn',
            singer: 'Phí Phương Anh, RIN9',
            path: './assets/music/song-7.mp3',
            image: './assets/img/song-7.webp',
        },
        {
            name: 'Quả Phụ Tướng',
            singer: 'DuongHoangPham',
            path: './assets/music/song-8.mp3',
            image: './assets/img/song-8.webp',
        },
        {
            name: 'Lúc em cần anh đang ở đâu',
            singer: 'Bảo Uyên, RIN9',
            path: './assets/music/song-3.mp3',
            image: './assets/img/song-3.jpg',
        },
        {
            name: 'Quả Phụ Tướng',
            singer: 'DuongHoangPham',
            path: './assets/music/song-8.mp3',
            image: './assets/img/song-8.webp',
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

            Nmb1Start.innerText = Math.floor(audio.currentTime / 60)
                .toLocaleString()
                .padStart(2, '0');
            Nmb2Start.innerText = Math.floor(audio.currentTime % 60)
                .toLocaleString()
                .padStart(2, '0');
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

        // Handle show time song
        audio.onloadedmetadata = function () {
            Nmb1End.innerText = Math.floor(audio.duration / 60)
                .toLocaleString()
                .padStart(2, '0');
            Nmb2End.innerText = Math.round(audio.duration % 60)
                .toLocaleString()
                .padStart(2, '0');

            Nmb1Start.innerText = Math.floor(audio.currentTime / 60)
                .toLocaleString()
                .padStart(2, '0');
            Nmb2Start.innerText = Math.floor(audio.currentTime % 60)
                .toLocaleString()
                .padStart(2, '0');
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
