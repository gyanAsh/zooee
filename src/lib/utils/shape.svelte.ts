import Konva from 'konva';
import { transform_border_color } from './stage.svelte.ts';

export function handleHover(e: Konva.KonvaEventObject<MouseEvent>, isHovering: boolean) {
	const target = e.target;

	// Narrow away the Stage — Stage has no stroke/strokeWidth/dash
	if (!(target instanceof Konva.Shape)) {
		target.getStage()?.container().style.setProperty('cursor', 'default');
		return;
	}

	const shape: Konva.Shape = target; // now a concrete type, generics resolve
	const stage = shape.getStage();

	if (isHovering) {
		if (shape.getAttr('originalStroke') === undefined) {
			shape.setAttr('originalStroke', shape.stroke() ?? '');
			shape.setAttr('originalStrokeWidth', shape.strokeWidth() ?? 1);
			shape.setAttr('originalDash', shape.dash() ?? []);
		}

		shape.stroke(transform_border_color);
		shape.strokeWidth(2.5);
		shape.dash([12, 4]);

		if (stage) stage.container().style.cursor = 'pointer';
	} else {
		const originalStroke = shape.getAttr('originalStroke') ?? '';
		const originalStrokeWidth = shape.getAttr('originalStrokeWidth') ?? 1;
		const originalDash = shape.getAttr('originalDash') ?? [];

		shape.stroke(originalStroke);
		shape.strokeWidth(originalStrokeWidth);
		shape.dash(originalDash);

		if (stage) stage.container().style.cursor = 'default';
	}

	shape.getLayer()?.batchDraw();
}
