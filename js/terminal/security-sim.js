// Yalnız terminal komutlarından çalışan güvenlik simülasyonu.
PortfolioTerminal.kaydet(function (baglam) {
function showKernelPanic() {
        var overlay = document.getElementById('kernel-panic');
        var textEl = document.getElementById('kernel-panic-text');
        var cdEl = document.getElementById('kernel-panic-countdown');
        if (!overlay) return;

        function kts() { return (Math.random() * 5 + 1).toFixed(6); }
        var panicLines = [
            '',
            '[  ' + kts() + '] CPU: 0 PID: 1 Comm: init Not tainted 6.5.0-furkan-sarica #1',
            '[  ' + kts() + '] Hardware name: furkan-sarica DevOps Lab',
            '[  ' + kts() + '] Call Trace:',
            '[  ' + kts() + ']  dump_stack_lvl+0x48/0x70',
            '[  ' + kts() + ']  panic+0x101/0x340',
            '[  ' + kts() + ']  do_exit+0x8a3/0xb40',
            '[  ' + kts() + ']  fork_bomb_detected+0x0/0x1',
            '[  ' + kts() + '] ---[ end Kernel panic - not syncing: Fatal exception ]---',
            '',
            'System will reboot in 5 seconds...',
        ];
        if (textEl) textEl.textContent = panicLines.join('\n');

        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');

        var countdown = 5;
        if (cdEl) cdEl.textContent = 'Reloading in ' + countdown + 's...';
        var cdInterval = setInterval(function () {
            countdown--;
            if (countdown <= 0) {
                clearInterval(cdInterval);
                location.reload();
            } else {
                if (cdEl) cdEl.textContent = 'Reloading in ' + countdown + 's...';
            }
        }, 1000);
    }
    baglam.showKernelPanic = showKernelPanic;

function triggerFail2Ban() {
        baglam.fail2banActive = true;
        baglam.invalidCount = 0;
        baglam.input.disabled = true;
        baglam.input.classList.add('fail2ban-locked');
        var promptEl = document.getElementById('cli-prompt');
        if (promptEl) promptEl.classList.add('fail2ban-locked');

        baglam.addLine('', '');
        baglam.addLine('[Fail2Ban] *** INTRUSION DETECTED ***', 'err');
        baglam.addLine('[Fail2Ban] Too many invalid attempts. Your IP has been temporarily banned for malicious activity.', 'err');

        var remaining = 10;
        function tick() {
            baglam.addLine('[Fail2Ban] Ban expires in: ' + remaining + 's', 'err');
            if (remaining <= 0) {
                baglam.fail2banActive = false;
                baglam.input.disabled = false;
                baglam.input.classList.remove('fail2ban-locked');
                if (promptEl) promptEl.classList.remove('fail2ban-locked');
                baglam.addLine('[Fail2Ban] Ban lifted. Your IP has been removed from the blocklist.', 'ok');
                baglam.input.focus();
            } else {
                remaining--;
                setTimeout(tick, 1000);
            }
        }
        setTimeout(tick, 500);
    }
    baglam.triggerFail2Ban = triggerFail2Ban;
});
