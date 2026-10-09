import './BlueprintBackground.css';

// Faint drafting grid behind the whole page.
export default function BlueprintBackground() {
  return (
    <div className="bp" aria-hidden="true">
      <div className="bp-grid" />
      <div className="bp-glow" />
    </div>
  );
}
