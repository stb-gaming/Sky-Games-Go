import emitEvent from '../utils/emitEvent';

// const userscripts = [
// 	'./GM_addStyle',
// 	'./check-userscript',
// 	'./sky-remote.user',
// 	//'./beehive-bedlam.user',
// 	//'./template.user',
// 	//'./sky-remote-mobile.user',
// 	'./gamepad-support.user'
// ].map(file => import(file));

import SkyRemote from './SkyRemote.user';

import './gamepadSupport.user';


export async function initUserscripts(window) {
	console.error("No dont use this, we use propper modules now");
}

window.SkyRemote = SkyRemote;


export default { SkyRemote };
