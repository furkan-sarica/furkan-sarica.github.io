// ===== Feature: Linux Boot Preloader =====
var _pageLoadTime = Date.now();

function runBootSequence() {
    var bootLines = [
        '[ OK ] Initializing kernel modules...',
        '[ OK ] Mounting filesystems...',
        '[ OK ] Starting network interfaces...',
        '[ OK ] Starting Docker daemon...',
        '[ OK ] Starting SSH server...',
        '[ OK ] Starting Nginx reverse proxy...',
        '[ OK ] Loading monitoring agents...',
        '[ OK ] Loading furkan-sarica interface...',
        '[ OK ] System ready. Welcome, furkan.'
    ];
    var screen = document.getElementById('boot-screen');
    var log = document.getElementById('boot-log');
    if (!screen || !log) return;
    log.textContent = '';
    screen.style.display = 'flex';
    screen.style.opacity = '1';

    var idx = 0;
    var delay = 80;

    screen.addEventListener('click', function () {
        screen.style.opacity = '0';
        screen.classList.add('fade-out');
        setTimeout(function () { screen.style.display = 'none'; }, 200);
    });

    function printNext() {
        if (idx < bootLines.length) {
            log.textContent += bootLines[idx] + '\n';
            idx++;
            setTimeout(printNext, delay);
        } else {
            setTimeout(function () {
                screen.style.opacity = '0';
                screen.classList.add('fade-out');
                setTimeout(function () {
                    screen.style.display = 'none';
                }, 300);
            }, 200);
        }
    }

    printNext();

    // Absolute failsafe: dismiss boot screen after 1.2s no matter what
    setTimeout(function () {
        if (screen && screen.style.display !== 'none') {
            screen.style.opacity = '0';
            screen.classList.add('fade-out');
            setTimeout(function () { screen.style.display = 'none'; }, 200);
        }
    }, 1200);
}

runBootSequence();
