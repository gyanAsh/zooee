export interface ImageDimensions {
	width: number;
	height: number;
	fill: string;
	rotation: number;
	url: string;
	crossOrigin: 'Anonymous' | null;
	//custom
	awayFromTop: number;
	awayFromSide: number;
	position: 'left' | 'right' | 'center';
}
export interface ImageClip {
	type: 'img';
	id: string;
	attr: ImageDimensions;
}
