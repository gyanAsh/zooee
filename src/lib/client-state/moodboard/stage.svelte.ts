export interface SelectionRect {
	visible: boolean;
	x1: number;
	x2: number;
	y1: number;
	y2: number;
}

class StageStore {
	selectionRect = $state<SelectionRect>({
		visible: false,
		x1: 0,
		x2: 0,
		y1: 0,
		y2: 0
	});
	selectedIds = $state<string[]>([]);
	isSelecting = $state<boolean>(false);

	setSelectionRect(rect: SelectionRect) {
		// console.log({ 'rect-dimention': rect });
		this.selectionRect = rect;
	}

	setSelectedIds(ids: string[]) {
		console.log({ selectedIds: ids });
		this.selectedIds = ids;
	}

	setIsSelecting(state: boolean) {
		console.log({ isSelecting: state });
		this.isSelecting = state;
	}
}

export const stage_store = new StageStore();
