type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

export function useImage(url: string, crossOrigin: string | null = null) {
	let image = $state<HTMLImageElement | null>(null);
	let status = $state<ImageStatus>('idle');
	let width = $state(0);
	let height = $state(0);
	$effect(() => {
		if (!url) {
			image = null;
			status = 'idle';
			width = 0;
			height = 0;
			return;
		}

		status = 'loading';
		const el = new window.Image();
		if (crossOrigin) el.crossOrigin = crossOrigin; // only for remote URLs
		el.src = url;
		el.onload = () => {
			image = el;
			width = el.naturalWidth;
			height = el.naturalHeight;
			status = 'loaded';
		};
		el.onerror = () => {
			image = null;
			status = 'error';
		};

		return () => {
			el.onload = null;
			el.onerror = null;
		};
	});

	return {
		get current() {
			return image;
		},
		get status() {
			return status;
		},
		get size() {
			return {
				width,
				height
			};
		}
	};
}

// Directions : how_to_use:
// const image = useImage('/images/photo.png');           // static
// const image = useImage(someBlobUrl);                   // blob
// const image = useImage(cdnUrl, 'Anonymous');           // remote, needed for export
// const image = useImage(url, 'use-credentials');        // remote, cookies
