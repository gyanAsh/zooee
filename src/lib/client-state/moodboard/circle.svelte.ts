export interface CircleClip {
	type: 'circle';
	id: string;
	attr: {
		radius: number;
		cx: number;
		cy: number;
	};
}
