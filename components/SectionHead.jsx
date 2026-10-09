import Reveal from './Reveal';

export default function SectionHead({ index, label, title, children }) {
  return (
    <Reveal className="section-head">
      <span className="mono section-index">
        {index} / {label}
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}
