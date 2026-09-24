import { PersistedState } from 'runed';
import type { RectClip } from './rectangle.svelte.ts';
import type { CircleClip } from './circle.svelte.ts';
import type { ImageClip } from './image.svelte.ts';
import { asset } from '$app/paths';

export const stage_state = new PersistedState('stage', { width: 0, height: 0 });

export type ClipItem = ImageClip | RectClip | CircleClip;
//
export const clips = new PersistedState<ClipItem[]>('clips', [
	{
		type: 'img',
		id: 'i8390',
		attr: {
			width: 400,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'center',
			url: 'https://pub-39b854a65f6e4e6d996671b5e24bd788.r2.dev/Folder.svg',
			fill: 'transparent',
			crossOrigin: 'Anonymous',
			rotation: 0
		}
	},
	{
		type: 'img',
		id: 'p9990',
		attr: {
			width: 400,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'center',
			url: asset('/folder.svg'),
			fill: 'transparent',
			crossOrigin: null,
			rotation: 0
		}
	},
	{
		type: 'img',
		id: 'o3miu',
		attr: {
			width: 400,
			height: 200,
			awayFromTop: 110,
			awayFromSide: 110,
			position: 'center',
			url: 'https://goodies.icons8.com/web/common/header/logo/logo-icons8.svg',
			fill: 'transparent',
			crossOrigin: 'Anonymous',
			rotation: 0
		}
	},
	{
		type: 'rect',
		id: 'kdui3',
		attr: {
			width: 400,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'center',
			fill: 'skyblue',
			rotation: 0
		}
	},
	{
		type: 'rect',
		id: 'soui1',
		attr: {
			width: 200,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'center',
			fill: 'pink',
			rotation: 0
		}
	},
	{
		type: 'rect',
		id: 'oooi9',
		attr: {
			width: 200,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'center',
			fill: 'lightgreen',
			rotation: 0
		}
	}
]);
