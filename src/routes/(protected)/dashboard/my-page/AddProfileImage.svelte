<script lang="ts">
	import { CropIcon, ImagePlus, Trash, Upload, X, ZoomInIcon, ZoomOutIcon } from '@lucide/svelte';
	import { AlertDialog, Slider } from 'bits-ui';
	const { children, form } = $props();

	import { enhance } from '$app/forms';
	import Cropper from '$lib/client/components/Cropper/Cropper.svelte';
	import Button from '$lib/client/components/ui/button.svelte';

	// --- State ---
	let imageSrc = $state<string | null>(null);
	let isModalOpen = $state(false);
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1.5);
	const ASPECT_RATIO = 1; // Change to 1 for avatars
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
				Profile Picture
			</AlertDialog.Title>
			<AlertDialog.Description class="text-sm text-foreground-alt">
				Upload a photo to help clients and guests recognize you on your booking pages.
			</AlertDialog.Description>
			<div class="flex flex-col items-center py-5">
				{#if isModalOpen && imageSrc}
					<div class="flex h-[min(50vh,600px)] w-full flex-col items-center overflow-hidden">
						<!-- Header -->
						<header class="flex w-full shrink-0 items-center justify-between pb-4">
							<h2 class="text-base font-semibold">Crop Image</h2>
						</header>

						<!-- Cropper area -->
						<div class="relative aspect-square w-75 flex-1 bg-black">
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
						<footer
							class="relative z-10 flex w-full shrink-0 flex-col items-center justify-center gap-4 p-4 md:flex-row"
						>
							<ZoomOutIcon size="20" class="text-gray-500" strokeWidth="2" />
							<Slider.Root
								type="single"
								min={1}
								max={3}
								step={0.01}
								bind:value={zoom}
								class="relative flex w-64 max-w-full touch-none items-center select-none"
							>
								<span
									class="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-dark-10"
								>
									<Slider.Range class="absolute h-full bg-blue-400" />
								</span>
								<Slider.Thumb
									index={0}
									class="block size-5 cursor-pointer rounded-full border border-gray-500 bg-white shadow-sm transition-colors hover:border-dark-40
								    focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none
									disabled:opacity-50 data-active:scale-[0.98] data-active:border-dark-40 dark:bg-foreground dark:shadow-card"
								/>
							</Slider.Root>
							<ZoomInIcon size="20" class="text-gray-500" strokeWidth="2" />
						</footer>
						<div class="grid w-70 grid-cols-2 gap-1">
							<Button variant="secondary" onClick={cancelCrop}>Cancel</Button>
							<Button onClick={applyCrop}>
								<div class="flex items-center justify-center gap-1">
									<CropIcon size="16" strokeWidth="2" />
									<h2>Crop</h2>
								</div>
							</Button>
						</div>
					</div>
				{:else if previewUrl}
					<div
						class="relative grid aspect-square w-full place-items-center overflow-hidden rounded-lg bg-black text-sm
    				font-medium transition-colors md:w-75"
					>
						<img src={previewUrl} alt="Cropped preview" class="block h-auto w-full" />
						<section class="absolute flex items-center gap-1.5">
							<label
								for="file-input"
								class="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 bg-gray-100 px-2
						    py-1.5 text-sm text-gray-500 transition-all duration-75 ease-in hover:bg-blue-500/80 hover:text-gray-50"
							>
								<ImagePlus size="16" strokeWidth="2" />
							</label>
							<button
								type="button"
								onclick={cancelCrop}
								disabled={!fileInput}
								class="flex cursor-pointer items-center gap-1 rounded-lg border border-zinc-700 bg-black px-2 py-1.5
						    text-white transition-all duration-75 ease-in hover:bg-red-500/80 hover:text-gray-800"
							>
								<Trash size="16" strokeWidth="2" />
							</button>
						</section>
					</div>
				{:else}
					<div class="relative flex w-full items-center justify-center">
						<label
							for="file-input"
							id="upload_image_id"
							class="group grid aspect-square w-full cursor-pointer place-items-center rounded-lg border border-dashed border-gray-400
						bg-gray-200 px-2.5 py-1.5 text-sm font-medium transition-colors hover:border-gray-800 md:w-75"
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
										300×300px. JPG, PNG, or WEBP (Max 5MB)
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
						class="black_btn cursor-pointer rounded-lg px-2 py-1.5 text-sm transition-colors
						{!isModalOpen && imageSrc && previewUrl && hasCroppedFile ? 'block' : 'hidden'}
							"
						type="submit">Save</button
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
