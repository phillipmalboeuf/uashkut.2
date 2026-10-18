const youtubeIdPattern = /^[\w-]{11}$/;

function youtubeId(url: URL): string | null {
	const host = url.hostname.replace(/^www\./, '');
	if (host === 'youtu.be') {
		const id = url.pathname.split('/').filter(Boolean)[0];
		return id && youtubeIdPattern.test(id) ? id : null;
	}
	if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
		if (url.pathname === '/watch') {
			const id = url.searchParams.get('v');
			return id && youtubeIdPattern.test(id) ? id : null;
		}
		const [kind, id] = url.pathname.split('/').filter(Boolean);
		if ((kind === 'embed' || kind === 'shorts' || kind === 'live') && id && youtubeIdPattern.test(id)) {
			return id;
		}
	}
	return null;
}

function vimeoId(url: URL): string | null {
	const host = url.hostname.replace(/^www\./, '');
	if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;
	const id = url.pathname.split('/').filter(Boolean).find((part) => /^\d+$/.test(part));
	return id ?? null;
}

export function embedSrc(value: string | null | undefined): string | null {
	if (!value) return null;
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
	const youtube = youtubeId(url);
	if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}`;
	const vimeo = vimeoId(url);
	if (vimeo) return `https://player.vimeo.com/video/${vimeo}`;
	return null;
}
