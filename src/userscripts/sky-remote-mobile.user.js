// ==UserScript==
// @name         STBG Mobile Interface
// @namespace    https://stb-gaming.github.io
// @version      0.1.7
// @description  A userscript that adds a button layout based on the Sky Gamepad to mobile browsers, adding touch support for mobile devices
// @author       tumble1999
// @run-at       document-start
// @match        https://denki.co.uk/sky/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=denki.co.uk
// @require      https://github.com/STB-Gaming/userscripts/raw/master/sky-remote.user.js
// @grant        GM_addStyle
// ==/UserScript==




(function (userscript) {
	const init = global => {
		const context = {
			...global,
			get global() { return global; },
			get unsafeWindow() { return global; },
			get uWindow() { return global.window; },
			exports: {}
		};
		userscript.call(context, context);
		return context.exports;
	};

	if (typeof module === 'undefined' || typeof module.exports === 'undefined') {
		// eslint-disable-next-line no-undef
		const uWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
			exports = init(uWindow);

		for (const key in exports)
			if (!uWindow.hasOwnProperty(key))
				uWindow[key] = exports[key];
	} else
		module.exports.init = init;
})(function ({ uWindow, SkyRemote, GM_addStyle, exports }) {

	let css = `
html,body {
	margin:0;
	padding:0;
	max-width: 100vw;
	max-height: 100vh;
	overflow: hidden;
}

canvas {
max-width:100vw;
}

#sky-remote {
	position: absolute;
	bottom: 0;
	background-color: gray;
	z-index: 100;
	height: 50vh;
	width: 100vw;
	    touch-action: none;

	user-select: none;
}

#sky-remote-dpad {
	position: absolute;
	bottom: 70px;
	left: 1px;
	width: 184px;
	height: 184px;
}

#sky-remote-dpad-left,
#sky-remote-dpad-right,
#sky-remote-dpad-up,
#sky-remote-dpad-down {
	-webkit-box-shadow: 0px 0px 0 3px rgba(0, 0, 0, 0.1), 0px 5px 5px 0 rgba(0, 0, 0, 0.2),
		0px 3px 5px rgba(0, 0, 0, 0.2);
	box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1), 0 5px 5px rgba(0, 0, 0, 0.2), 0 3px 5px rgba(0, 0, 0, 0.2);
}

#sky-remote-dpad:before {
	content: "";
	display: block;
	width: 48px;
	height: 48px;
	position: absolute;
	left: 68px;
	top: 68px;
}

#sky-remote-dpad:after {
	content: "";
	display: block;
	position: absolute;
	pointer-events: none;
	width: 184px;
	height: 184px;
	z-index: 100;
	background-color: turquoise;
	border-radius: 50%;
	background-size: 165px;
	background-position: 10px;
}

#sky-remote-dpad-left {
	position: absolute;
	left: 20px;
	top: 68px;
	width: 48px;
	height: 48px;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}

#sky-remote-dpad-right {
	position: absolute;
	left: 116px;
	top: 68px;
	width: 48px;
	height: 48px;
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}

#sky-remote-dpad-up {
	position: absolute;
	left: 68px;
	top: 20px;
	width: 48px;
	height: 48px;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
}

#sky-remote-dpad-down {
	position: absolute;
	left: 68px;
	top: 116px;
	width: 48px;
	height: 48px;
	border-bottom-left-radius: 4px;
	border-bottom-right-radius: 4px;
}

#sky-remote-select {
	position: absolute;
	right: 10px;
	bottom: 100px;
	background-color: cyan;
	border-radius: 50%;
	height: 110px;
	width: 110px;
	display: flex;
	flex-flow: column;
	justify-content: center;
	align-items: center;
	color: white;
	font-weight: bold;
	font-family: sans-serif;
}

#sky-remote-red,
#sky-remote-green,
#sky-remote-yellow,
#sky-remote-blue,
#sky-remote-backup,
#sky-remote-help,
#sky-remote-log {
	position: absolute;
	border-radius: 50%;
	height: 60px;
	width: 60px;
}

#sky-remote-red {
	background-color: red;
	right: 130px;
	bottom: 60px;
}
#sky-remote-backup {
	background-color: black;
    margin: auto;
    left: 0;
    right: 0;
    top: 40px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-family: sans-serif;
    width: 110px;
    height: 40px;
    border-bottom-left-radius: 70%;
    border-bottom-right-radius: 70%;
    border-top-left-radius: 30%;
    border-top-right-radius: 30%;
}
#sky-remote-help {
	   background-color: black;
    margin: auto;
    left: 0;
    right: 0;
    top: 5px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-family: sans-serif;
    width: 80px;
    height: 30px;
}
#sky-remote-log {
	   background-color: black;
    margin: auto;
    right: 10px;
    top: 5px;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    font-family: sans-serif;
    width: 80px;
    height: 35px;
	text-align:center;
}

#sky-remote-green {
	background-color: green;
	right: 130px;
	bottom: 139px;
}

#sky-remote-yellow {
	background-color: yellow;
	right: 86px;
	bottom: 206px;
}

#sky-remote-blue {
	background-color: blue;
	right: 15px;
	bottom: 226px;
}
#game-log-container {
    position: absolute;
    left: 0;
	bottom: 50vh;
    height: 50vh;
    width: 100vw;
    background-color: white;
	font-family: monospace;

 display: flex;
flex-direction: column-reverse;
justify-content: flex-start;
    overflow-y: scroll;
}

#game-log p {
	margin: 0;
    border: solid 0.15em;
	border-color: #ffffff;

}

#game-log .info {
	color:blue
}
#game-log .warn {
	color:#f2ab26;
	background-color:#332b00;
	border-color: #665500;
}
#game-log .error {
	color:#f17678;
	background-color:#290000;
	border-color: #5c0000;
}

`,
		html = `
		<div id="game-log-container" >
		<div id="game-log"></div>
		</div>
<div id="sky-remote">
		<div id="sky-remote-dpad">
			<div id="sky-remote-dpad-up"></div>
			<div id="sky-remote-dpad-left"></div>
			<div id="sky-remote-dpad-right"></div>
			<div id="sky-remote-dpad-down"></div>
		</div>
		<div id="sky-remote-yellow"></div>
		<div id="sky-remote-blue"></div>
		<div id="sky-remote-green"></div>
		<div id="sky-remote-red"></div>
		<div id="sky-remote-backup"><span>back up</span></div>
		<div id="sky-remote-help"><span>help</span></div>
		<div id="sky-remote-help"><span>help</span></div>
		<div id="sky-remote-log"><span>game log</span></div>
		<div id="sky-remote-select"><span>select</span></div>
	</div>
`;

	let log = (function () {
		let { log, info, warn, error } = window.console;
		return { log, info, warn, error };
	})(),
		queuedLogs = [];
	function logLog(type, ...args) {
		log[type](...args);
		let logLine = document.createElement("p");
		logLine.classList.add(type);
		logLine.innerText = args.join(" ");
		if (document.getElementById("game-log")) {
			document.getElementById("game-log").appendChild(logLine);
		} else {
			queuedLogs.push(logLine);
		}
	}

	exports.getQueuedLogs = function () {
		console.log(queuedLogs.map(l => l.classList.toString() + ": " + l.innerText).join(`
		`));
	};

	Object.keys(log).forEach(type => {
		window.console[type] = logLog.bind(null, type);
	});

	function setupControls() {
		let select = document.getElementById("sky-remote-select");
		//console.log(select);

		[
			{
				button: "select",
				element: document.getElementById("sky-remote-select")
			},
			{
				button: "backup",
				element: document.getElementById("sky-remote-backup")
			},
			{
				button: "help",
				element: document.getElementById("sky-remote-help")
			},
			{
				button: "red",
				element: document.getElementById("sky-remote-red")
			},
			{
				button: "green",
				element: document.getElementById("sky-remote-green")
			},
			{
				button: "yellow",
				element: document.getElementById("sky-remote-yellow")
			},
			{
				button: "blue",
				element: document.getElementById("sky-remote-blue")
			}
		].forEach(b => {
			b.element.addEventListener("touchstart", () => {
				SkyRemote.holdButton(b.button);
			});
			b.element.addEventListener("touchend", () => {
				SkyRemote.releaseButton(b.button);
			});
		});
		let toggleLog = () => {
			let logContainer = document.getElementById("game-log-container");
			console.log(logContainer);
			logContainer.style.display = logContainer.style.display ? null : "none";
		};
		document.getElementById("sky-remote-log").addEventListener("touchend", toggleLog);
		toggleLog();

		let dpad = document.getElementById("sky-remote-dpad");

		function touchEvent(e) {
			let dpad = e.currentTarget,
				bounds = dpad.getBoundingClientRect(),
				touch = e.targetTouches[0],

				x = 2 * (touch.clientX - bounds.left) / bounds.width - 1,
				y = 2 * (touch.clientY - bounds.top) / bounds.height - 1,
				deadZone = .2;
			if (Math.abs(x) < deadZone) x = 0;
			if (Math.abs(y) < deadZone) y = 0;
			console.log({ x, y });
			if (Math.sign(x) < 0) {
				SkyRemote.releaseButton("right");
				SkyRemote.holdButton("left");
			}
			if (Math.sign(x) > 0) {
				SkyRemote.releaseButton("left");
				SkyRemote.holdButton("right");
			}
			if (Math.sign(y) < 0) {
				SkyRemote.releaseButton("down");
				SkyRemote.holdButton("up");
			}
			if (Math.sign(y) > 0) {
				SkyRemote.releaseButton("up");
				SkyRemote.holdButton("down");
			}
		}

		dpad.addEventListener("touchstart", touchEvent);
		dpad.addEventListener("touchmove", touchEvent);
		dpad.addEventListener("touchend", e => {
			["up", "down", "left", "right"].forEach(d =>
				SkyRemote.releaseButton(d));
		});
	}


	var meta = document.createElement('meta');
	meta.name = "viewport";
	meta.content = "width=device-width,initial-scale=1.0,user-scalable=no";
	document.getElementsByTagName('head')[0].appendChild(meta);

	//document.body.innerHTML += html;

	GM_addStyle(css);


	uWindow.addEventListener("load", () => {
		let test = document.createElement("span");
		test.innerHTML = html;
		document.body.appendChild(test);
		document.getElementById("game-log").append(...queuedLogs);

		setupControls();


	});
});
