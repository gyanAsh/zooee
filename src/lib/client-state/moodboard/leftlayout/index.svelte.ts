type Modal = 'layers' | 'template' | 'elements' | 'close';

export const left_layout_state = $state<{ modal: Modal }>({ modal: 'close' });
