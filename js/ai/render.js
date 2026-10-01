PortfolioAI.kaydet(function (baglam) {
function parseMarkdown(text) {
        var raw = text || '';
        var div = document.createElement('div');
        div.textContent = raw;
        var s = div.innerHTML;

        s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        var lines = s.split('\n');
        var inList = false;
        var out = [];
        lines.forEach(function(l) {
            var trimmed = l.trim();
            if (trimmed.indexOf('• ') === 0 || trimmed.indexOf('- ') === 0) {
                if (!inList) { out.push('<ul>'); inList = true; }
                out.push('<li>' + trimmed.substring(2) + '</li>');
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (!inList) { out.push('<ul>'); inList = true; }
                out.push('<li>' + trimmed.replace(/^\d+\.\s/, '') + '</li>');
            } else {
                if (inList) { out.push('</ul>'); inList = false; }
                if (trimmed.length > 0) {
                    out.push('<p>' + trimmed + '</p>');
                }
            }
        });
        if (inList) out.push('</ul>');
        return out.join('');
    }
    baglam.parseMarkdown = parseMarkdown;

function streamTerminalTypewriter(container, text, onDone) {
        container.innerHTML = '';
        var cursor = document.createElement('span');
        cursor.className = 'ai-term-cursor';
        cursor.textContent = '█';
        container.appendChild(cursor);

        var idx = 0;
        var step = Math.max(3, Math.floor(text.length / 35));
        var interval = setInterval(function() {
            idx += step;
            if (idx >= text.length) {
                clearInterval(interval);
                container.innerHTML = baglam.parseMarkdown(text);
                baglam.scrollTerminalToBottom();
                if (onDone) onDone();
                return;
            }
            container.innerHTML = baglam.parseMarkdown(text.slice(0, idx)) + '<span class="ai-term-cursor">█</span>';
            baglam.scrollTerminalToBottom();
        }, 10);
    }
    baglam.streamTerminalTypewriter = streamTerminalTypewriter;

function renderCommandOutput(command, outputText) {
        var entry = document.createElement('div');
        entry.className = 'ai-term-log-entry';
        entry.innerHTML = '<div class="ai-term-user-line"><span class="ai-term-prompt">guest@portfolio:~$</span> <span class="ai-term-user-cmd">' + baglam.escapeHtml(command) + '</span></div>' +
            '<div class="ai-term-bot-output">' +
            '<div class="ai-term-sys-tag"><span style="color:var(--terminal-green);">●</span> [system]:</div>' +
            '<div class="ai-term-text">' + baglam.parseMarkdown(outputText) + '</div>' +
            '</div>';
        baglam.history.appendChild(entry);
        baglam.scrollTerminalToBottom();
    }
    baglam.renderCommandOutput = renderCommandOutput;

function escapeHtml(str) {
        var d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }
    baglam.escapeHtml = escapeHtml;
});
