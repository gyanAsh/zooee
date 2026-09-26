import type { SelectionRect } from '$lib/client-state/moodboard/stage.svelte';
import Konva from 'konva';
import type { Layer } from 'konva/lib/Layer';
import type { KonvaEventObject } from 'konva/lib/Node';

export const handleStageClick = ({
	e,
	selectionRect,
	selectedIds,
	setSelectedIds
}: {
	e: KonvaEventObject<DragEvent>;
	selectionRect: SelectionRect;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
}) => {
	const selectionWidth = Math.abs(selectionRect.x2 - selectionRect.x1);
	const selectionHeight = Math.abs(selectionRect.y2 - selectionRect.y1);
	if (selectionRect.visible && selectionWidth > 0 && selectionHeight > 0) return;

	// If click on empty area - remove all selections
	if (e.target === e.target.getStage()) {
		setSelectedIds([]);
		return;
	}

	// Do nothing if clicked NOT on our Shape
	if ('Shape' != e.target.getType()) {
		return;
	}

	const clickedId = e.target.id();

	// Did we pressed shift or ctrl ?
	const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
	const isSelected = selectedIds.includes(clickedId);

	if (!metaPressed && !isSelected) {
		// If no key pressd and the node is not selected
		// select just one
		setSelectedIds([clickedId]);
	} else if (metaPressed && isSelected) {
		// If we pressed keys and node was selected
		// we need to remove it from selection
		const otherIds = selectedIds.filter((id) => id !== clickedId);
		setSelectedIds(otherIds);
	} else if (metaPressed && !isSelected) {
		// Add the node into selection
		setSelectedIds([...selectedIds, clickedId]);
	}
};

export const handleMouseDown = ({
	e,
	setIsSelecting,
	setSelectionRect
}: {
	e: KonvaEventObject<DragEvent>;
	setIsSelecting: (value: boolean) => void;
	setSelectionRect: (rect: SelectionRect) => void;
}) => {
	if (e.target !== e.target.getStage()) return;
	const pos = e.target.getStage().getRelativePointerPosition(); // these are relative, not .getPointerPosition() // make sure to keep absolute & local position in mind.
	//you will notice the differnece when scale is applied to parent(i.e. stage) or groups are added
	if (!pos) return;
	setIsSelecting(true);
	setSelectionRect({
		visible: true,
		x1: pos.x,
		x2: pos.x,
		y1: pos.y,
		y2: pos.y
	});
};

export const handleMouseMove = ({
	e,
	isSelecting,
	selectionRect,
	setSelectionRect
}: {
	e: KonvaEventObject<DragEvent>;
	isSelecting: boolean;
	selectionRect: SelectionRect;
	setSelectionRect: (rect: SelectionRect) => void;
}) => {
	//Do nothing if we didn't start selection
	if (!isSelecting) return;
	const pos = e.target.getStage()?.getRelativePointerPosition();
	if (!pos) return;
	setSelectionRect({ ...selectionRect, x2: pos.x, y2: pos.y });
};

export const handleMouseUp = ({
	isSelecting,
	setIsSelecting,
	setSelectedIds,
	selectionRect,
	setSelectionRect,
	layer,
	selectionRectId,
	itemsIds
}: {
	isSelecting: boolean;
	setIsSelecting: (value: boolean) => void;

	setSelectedIds: (ids: string[]) => void;

	selectionRect: SelectionRect;
	setSelectionRect: (rect: SelectionRect) => void;

	layer?: Layer;
	selectionRectId: string;
	itemsIds: string[];
}) => {
	// Do nothing if we didn't start selection
	if (!isSelecting) return;
	setIsSelecting(false);

	// Update visibility in timeout, so we can check it in click event
	// setTimeout(() => {
	//   setSelectionRect({
	//     ...selectionRect,
	//     visible: false,
	//   });
	// });

	setSelectionRect({
		...selectionRect,
		visible: false
	});
	if (!layer) {
		console.error('Layer not found!');
		return;
	}
	const selectBoxNode = layer.findOne<Konva.Node>(`#${selectionRectId}`);
	if (!selectBoxNode) {
		console.error('Selection Rect/Box not found!');
		return;
	}

	if (selectBoxNode.width() > 0 && selectBoxNode.height() > 0 && !!layer) {
		const selected = itemsIds.filter((id: string) => {
			const node = layer.findOne<Konva.Node>(`#${id}`);
			if (!node || node.getParent() !== layer) return false;

			// skipStroke so a visible border doesn't inflate the hit-box
			return Konva.Util.haveIntersection(
				selectBoxNode.getClientRect({ skipStroke: true }),
				node.getClientRect({ skipStroke: true })
			);
			// These .getClientRect() returns absolute positions. Keep that in mind, for future, absolute and local bugs.
		});

		setSelectedIds(selected);
	}
};
