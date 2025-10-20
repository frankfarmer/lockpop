const sounds = {
    click: new Audio('assets/sounds/click.mp3'),
    win: new Audio('assets/sounds/win.mp3'),
    lose: new Audio('assets/sounds/lose.mp3'),
};

export function playClickSound() {
    sounds.click.currentTime = 0; // Reset sound to start
    sounds.click.play();
}

export function playWinSound() {
    sounds.win.currentTime = 0; // Reset sound to start
    sounds.win.play();
}

export function playLoseSound() {
    sounds.lose.currentTime = 0; // Reset sound to start
    sounds.lose.play();
}