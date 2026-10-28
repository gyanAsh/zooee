const FOLIO_URL = 'http://localhost:5173';

export async function convertToPDF(apiKey: string, source: string) {
	const response = await fetch(`${FOLIO_URL}/api/v3/convert/pdf`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-API-Key': apiKey
		},
		body: JSON.stringify({
			source,
			format: 'A4',
			margin: 12
		})
	});

	if (!response.ok) {
		const data = await response.json().catch(() => null);
		throw new Error(
			`${response.status} ${data?.error?.code ?? 'request_failed'}: ${
				data?.error?.message ?? response.statusText
			}`
		);
	}

	const blob = await response.blob();

	console.log('PDF size:', blob.size);
	console.log('Credits remaining:', response.headers.get('x-credits-remaining'));
	console.log('Request ID:', response.headers.get('x-request-id'));

	return { blob, requestId: response.headers.get('x-request-id') };
}
