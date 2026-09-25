export interface TextDimensions {
	width: number; //Set width and the text wraps to it. Leave width unset and the shape sizes itself to the content.
	height: number;
	text: string;
	fontSize: number;
	fontFamily: string;
	align: 'left' | 'center' | 'right' | 'justify';
	rotation: number;
	fill: string;

	awayFromTop: number; //inplace of y
	awayFromSide: number; //inplace of x
	position: 'left' | 'right' | 'center';
}

export interface TextClip {
	type: 'text';
	id: string;
	attr: TextDimensions;
}
