// Feature kurulum sırası deterministiktir; ek DOMContentLoaded listener yoktur.
PortfolioTerminal.baslat();
window.runCliQuick = function(cmd) {
    if (typeof playClick === 'function') playClick();
    if (window.executeCliCmd) {
        window.executeCliCmd(cmd);
    }
};
PortfolioTerminal.kaydetRuntime();
PortfolioTerminal.kaydetEfektler();
