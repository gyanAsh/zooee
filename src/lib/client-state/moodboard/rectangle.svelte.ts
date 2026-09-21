export interface RectDimensions {
	width: number;
	height: number;
	awayFromTop: number;
	awayFromSide: number;
	position: 'left' | 'right' | 'center';
	fill: string;
	rotation: number;
}

export interface RectClip {
	type: 'rect';
	id: string;
	attr: RectDimensions;
}
