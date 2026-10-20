import { appUrl, copyText, nativeShare, SHARE_TARGETS } from '../lib/share';

export default function ShareButtons({ text, onToast }: { text: string; onToast: (m: string) => void }) {
  const url = appUrl();
  return (
    <div className="row share-row" style={{ gap: 6 }}>
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button className="chip" onClick={() => nativeShare(text, url)}>
          Share…
        </button>
      )}
      {SHARE_TARGETS.map((t) =>
        t.href ? (
          <a key={t.id} className="chip" href={t.href(text, url)} target="_blank" rel="noopener noreferrer">
            {t.label}
          </a>
        ) : (
          <button
            key={t.id}
            className="chip"
            onClick={async () => onToast((await copyText(`${text} ${url}`)) ? 'Copied. Paste it into Instagram.' : 'Copy failed. Select the text and copy it yourself.')}
          >
            {t.label}
          </button>
        ),
      )}
    </div>
  );
}
