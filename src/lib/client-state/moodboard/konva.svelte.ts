import { PersistedState } from 'runed';
import type { RectClip } from './rectangle.svelte.ts';
import type { CircleClip } from './circle.svelte.ts';

export const stage_state = new PersistedState('stage', { width: 0, height: 0 });

export type ClipItem = RectClip | CircleClip;

export const clips = new PersistedState<ClipItem[]>('clips', [
	{
		type: 'rect',
		id: 'kdui3',
		attr: {
			width: 400,
			height: 200,
			awayFromTop: 100,
			awayFromSide: 100,
			position: 'left',
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
			position: 'right',
			fill: 'lightyellow',
			rotation: 0
		}
	},
	{
		type: 'circle',
		id: 'poui7',
		attr: {
			radius: 50,
			cx: 20,
			cy: 30
		}
	}
]);
