import Image from 'next/image';

// The latest screenshot of a product's site, framed in a minimal browser window.
export default function Screenshot({ shot, url }) {
  return (
    <div className="viz-shot">
      <div className="viz-window">
        <div className="viz-bar">
          <i />
          <i />
          <i />
          {url && <span className="viz-url mono">{url}</span>}
        </div>
        <div className="viz-shot-view">
          <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 900px) 100vw, 60vw" />
        </div>
      </div>
    </div>
  );
}
