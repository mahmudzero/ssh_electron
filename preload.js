// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { exec } = require('child_process');
const { contextBridge } = require('electron');

function osexec (cmd) {
	return new Promise(
		(res, rej) => {
			exec(cmd, (error, stdout, stderr) => {
				if (error)  { res({ error: error, stdout:     stdout ? stdout : null,         stderr: stderr ? stderr : null }); return; }
				if (stdout) { res({ error: null,              stdout: stdout,                 stderr: stderr ? stderr : null }); return; }
				if (stderr) { res({ error: 'Undefined Error', stdout: stdout ? stdout : null, stderr: stderr                 }); return; }
			});
		}
	);
}

contextBridge.exposeInMainWorld(
	"api", {
		exec: osexec,
	}
)

window.addEventListener('DOMContentLoaded', () => {
	const replaceText = (selector, text) => {
		const element = document.getElementById(selector);
		if (element) element.innerText = text;
	}

	for (const type of ['chrome', 'node', 'electron']) {
		replaceText(`${type}-version`, process.versions[type]);
	}
});
