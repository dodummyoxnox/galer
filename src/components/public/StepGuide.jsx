import './StepGuide.css';

export default function StepGuide({ steps }) {
  return (
    <div className="step-guide" id="step-guide">
      {steps.map((step) => (
        <div key={step.nomor} className="step-guide__item">
          <span className="step-guide__num font-display">{String(step.nomor).padStart(2, '0')}</span>
          <div className="step-guide__content">
            <h4 className="step-guide__title font-display">{step.judul}</h4>
            <p className="step-guide__desc font-mono">{step.deskripsi}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
