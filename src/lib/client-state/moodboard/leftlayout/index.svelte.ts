type Modal = 'layers' | 'template' | 'elements' | 'uploads' | 'close';

export const left_layout_state = $state<{ modal: Modal }>({ modal: 'close' });
