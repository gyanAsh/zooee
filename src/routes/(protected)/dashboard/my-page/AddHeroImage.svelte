<script lang="ts">
	import { ImagePlus, Trash, Upload, X } from '@lucide/svelte';
	import { AlertDialog } from 'bits-ui';
	const { children, form } = $props();

	import Cropper from 'svelte-easy-crop';
	import { enhance } from '$app/forms';

	// --- State ---
	let imageSrc = $state<string | null>(null);
	let isModalOpen = $state(false);
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	const ASPECT_RATIO = 10 / 3; // Change to 1 for avatars
	let croppedPixels = $state({ x: 0, y: 0, width: 0, height: 0 });
	let previewUrl = $state<string | null>(null);
	let fileInput = $state<HTMLInputElement | null>(null);
	let hasCroppedFile = $state(false);

	// --- File Selection ---
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// Reset previous state
		if (imageSrc) URL.revokeObjectURL(imageSrc);
		imageSrc = URL.createObjectURL(file);
		crop = { x: 0, y: 0 };
		zoom = 1;
		previewUrl = null;
		hasCroppedFile = false;
		isModalOpen = true;
	}

	// --- Crop Callback ---
	function handleCropComplete(detail: { pixels: typeof croppedPixels }) {
		croppedPixels = detail.pixels;
	}

	// --- Generate Preview + Attach File to Hidden Input ---
	async function applyCrop() {
		if (!imageSrc) return;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = imageSrc;
		img.onload = () => {
			canvas.width = croppedPixels.width;
			canvas.height = croppedPixels.height;
			ctx.drawImage(
				img,
				croppedPixels.x,
				croppedPixels.y,
				croppedPixels.width,
				croppedPixels.height,
				0,
				0,
				croppedPixels.width,
				croppedPixels.height
			);

			previewUrl = canvas.toDataURL('image/jpeg', 0.9);

			canvas.toBlob(
				(blob) => {
					if (!blob || !fileInput) return;
					const file = new File([blob], `post-${Date.now()}.jpg`, { type: 'image/jpeg' });

					// Attach the File to the hidden input via DataTransfer
					const dt = new DataTransfer();
					dt.items.add(file);
					fileInput.files = dt.files;
					hasCroppedFile = true;

					isModalOpen = false;
				},
				'image/jpeg',
				0.9
			);
		};
	}

	// --- Cancel ---
	function cancelCrop() {
		isModalOpen = false;
		if (imageSrc) URL.revokeObjectURL(imageSrc);
		imageSrc = null;
		previewUrl = null;
		hasCroppedFile = false;
		if (fileInput) fileInput.value = '';
	}
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		{@render children()}
	</AlertDialog.Trigger>
	<AlertDialog.Portal>
		<AlertDialog.Overlay
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0
			data-[state=open]:fade-in-0 fixed inset-0
            z-50 bg-black/80"
		/>
		<AlertDialog.Content
			onCloseAutoFocus={() => cancelCrop()}
			class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
			data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%]
              z-50 grid w-full translate-x-[-50%] translate-y-[-50%] rounded-2xl
              border bg-[#F5F5F5] p-5 shadow-popover outline-hidden sm:w-150"
		>
			<AlertDialog.Title
				class="flex w-full items-center justify-start text-lg font-semibold tracking-tight"
			>
				Profile Banner
			</AlertDialog.Title>
			<AlertDialog.Description class="text-sm text-foreground-alt">
				Add a cover image to personalize your booking page and represent your brand.
			</AlertDialog.Description>
			<div class="flex flex-col items-start py-5">
				{#if isModalOpen && imageSrc}
					<div
						class="flex h-[min(50vh,600px)] w-full flex-col overflow-hidden rounded-2xl bg-[#15202b] text-white shadow-2xl"
					>
						<!-- Header -->
						<header
							class="flex shrink-0 items-center justify-between border-b border-[#38444d] px-4 py-3"
						>
							<button
								onclick={cancelCrop}
								class="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
							>
								Cancel
							</button>
							<h2 class="text-base font-semibold">Crop your image</h2>
							<button
								onclick={applyCrop}
								class="rounded-full bg-[#1d9bf0] px-4 py-1.5 text-sm font-semibold transition-colors hover:bg-[#1a8cd8]"
							>
								Apply
							</button>
						</header>

						<!-- Cropper -->
						<div class="relative flex-1 bg-black">
							<Cropper
								image={imageSrc}
								bind:crop
								bind:zoom
								aspect={ASPECT_RATIO}
								oncropcomplete={handleCropComplete}
								showGrid={true}
							/>
						</div>

						<!-- Footer -->
						<footer class="flex shrink-0 items-center gap-3 border-t border-[#38444d] px-4 py-3">
							<label for="zoom-slider" class="text-sm text-gray-300">Zoom</label>
							<input
								id="zoom-slider"
								type="range"
								min="1"
								max="3"
								step="0.1"
								bind:value={zoom}
								class="flex-1 accent-[#1d9bf0]"
							/>
						</footer>
					</div>
				{:else if previewUrl}
					<div
						class="  relative grid aspect-10/3 w-full place-items-center overflow-hidden rounded-lg bg-gray-200
    				text-sm font-medium transition-colors focus:border-blue-500
    				focus:ring-1 focus:ring-transparent focus:outline-none"
					>
						<img src={previewUrl} alt="Cropped preview" class="block h-auto w-full" />
						<section class="absolute flex items-center gap-1.5">
							<label
								for="file-input"
								class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-white px-2 py-1.5
						    text-sm text-black transition-all duration-75 ease-in hover:bg-blue-300 hover:text-gray-800"
							>
								<ImagePlus size="16" strokeWidth="2" />
								<h2>Upload</h2>
							</label>
							<button
								type="button"
								onclick={cancelCrop}
								disabled={!fileInput}
								class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-black px-2 py-1.5
						    text-white transition-all duration-75 ease-in hover:bg-red-300 hover:text-gray-800"
							>
								<Trash size="16" strokeWidth="2" />
							</button>
						</section>
					</div>
				{:else}
					<div class="relative w-full">
						<label
							for="file-input"
							id="upload_image_id"
							class="group grid aspect-10/3 w-full cursor-pointer place-items-center rounded-lg border border-dashed
						border-gray-400
						bg-gray-200 px-2.5
						py-1.5 text-sm
						font-medium transition-colors focus:border-blue-500 focus:ring-1
						focus:ring-transparent focus:outline-none"
						>
							<div class="grid place-items-center gap-2.5">
								<div
									class="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-700 px-2 py-1.5 text-white
							    transition-all duration-75 ease-in group-hover:bg-black group-hover:text-gray-50"
								>
									<Upload size="14" strokeWidth="2" />
									<h2>Upload</h2>
								</div>

								<section class="grid place-items-center">
									<h1 class="text-sm">Choose a file or drag & drop it here</h1>
									<h2 class="text-xs font-normal text-gray-500">
										1468×440px. JPG, PNG, or WEBP (Max 5MB)
									</h2>
								</section>
							</div>
						</label>
					</div>
				{/if}

				<input
					id="file-input"
					type="file"
					accept="image/*"
					onchange={handleFileSelect}
					class="hidden"
				/>

				{#if form?.message}
					<p class={form.success ? 'text-green-500' : 'text-red-500'}>{form.message}</p>
				{/if}
			</div>
			<form method="POST" enctype="multipart/form-data" use:enhance class="flex w-full justify-end">
				<input bind:this={fileInput} type="file" name="croppedImage" class="hidden" />
				<AlertDialog.Cancel>
					<button
						class="black_btn cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors"
						type="submit"
						disabled={!hasCroppedFile}>Save</button
					>
				</AlertDialog.Cancel>
			</form>
			<AlertDialog.Cancel
				class="absolute top-5 right-5 cursor-pointer rounded-md   hover:bg-gray-200
				focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2
				focus-visible:ring-offset-background focus-visible:outline-hidden active:scale-[0.98]"
			>
				<div>
					<X class="size-5 text-foreground" />
					<span class="sr-only">Close</span>
				</div>
			</AlertDialog.Cancel>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
<!-- Modal Overlay -->
