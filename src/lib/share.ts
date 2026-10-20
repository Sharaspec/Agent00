// Sharing to social apps. These links need no API keys: they open each
// network's own share screen. Instagram has no web share link, so we copy the
// text for the person to paste into a post or story.

export interface ShareTarget {
  id: string;
  label: string;
  href?: (text: string, url: string) => string;
}

const enc = encodeURIComponent;

export const SHARE_TARGETS: ShareTarget[] = [
  { id: 'x', label: 'X', href: (t, u) => `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}` },
  { id: 'facebook', label: 'Facebook', href: (_t, u) => `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}` },
  { id: 'threads', label: 'Threads', href: (t, u) => `https://www.threads.net/intent/post?text=${enc(`${t} ${u}`)}` },
  { id: 'whatsapp', label: 'WhatsApp', href: (t, u) => `https://wa.me/?text=${enc(`${t} ${u}`)}` },
  { id: 'instagram', label: 'Instagram (copy)' },
];

export const appUrl = () => window.location.origin;

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Uses the device share sheet when available (phones), which covers Instagram too. */
export async function nativeShare(text: string, url: string): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({ title: 'Daybloom', text, url });
    return true;
  } catch {
    return false;
  }
}
