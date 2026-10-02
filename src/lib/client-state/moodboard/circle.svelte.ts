export interface CircleDimensions {
	radiusX: number;
	radiusY: number;
	awayFromTop: number;
	awayFromSide: number;
	position: 'left' | 'right' | 'center';
	fill: string;
	rotation: number;
}

export interface CircleClip {
	type: 'circle';
	id: string;
	attr: CircleDimensions;
}
