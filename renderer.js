// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

document.getElementById('SEARCH_LS').addEventListener('click', submit);

function submit(event, dir='~/', override=false) {
	console.log('SUBMIT CLICKED');
	let searchDir = override ? dir : document.getElementById('search').value || dir;
	if (searchDir[searchDir.length] !== '/') searchDir = searchDir + '/';
	window
		.api
		.exec(`ls -lah ${searchDir}`)
			.then(
				res => {
					if (res.error) {
						document.getElementById('error') .innerText = res.error;
						document.getElementById('stdout').innerText = res.stdout || '';
						document.getElementById('stderr').innerText = res.stderr || '';
						return;
					}
					if (res.stderr) {
						document.getElementById('error') .innerText = res.error;
						document.getElementById('stdout').innerText = res.stdout || '';
						document.getElementById('stderr').innerText = res.stderr || '';
						return;
					}
					if (res.stdout) {
						document.getElementById('error') .innerText = '';
						document.getElementById('stdout').innerText = '';
						document.getElementById('stdout').innerHTML = res.stdout.split('\n').splice(1).map(
							l => {
								const id = l.split(' ')[l.split(' ').length - 1];
								if (l[0] === 'd') {
									return `
										<div style="padding: 8px; border: 1px solid blue;" onclick="submit(event, '${searchDir + id}', true)"> ${id} </div>
									`
								} else {
									return `
										<div style="padding: 8px; border: 1px solid blue;"> ${id} </div>
									`
								}
							}
						).join('\n');
						return;
					}
				}
			);
}
