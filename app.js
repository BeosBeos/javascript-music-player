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
 **/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');

const app = {
    currentIndex: 0,
    isPlaying: false,

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
        $('.playlist').innerHTML = htmls.join('');
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

            audio.onplay = function () {
                _this.isPlaying = true;
                player.classList.add('playing');
            };
            audio.onpause = function () {
                _this.isPlaying = false;
                player.classList.remove('playing');
            };
        };
        // Change song tempo
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }

            progress.oninput = function (e) {
                const seekTime = (audio.duration / 100) * e.target.value;
                audio.currentTime = seekTime;
            };
        };
    },

    loadCurrenSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    start: function () {
        this.defineProperties();

        this.handleEvent();

        this.loadCurrenSong();

        this.render();
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