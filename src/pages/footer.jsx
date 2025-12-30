import "../CSS/footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div>
        <strong>FastTrack</strong> — Real-Time Delivery Tracking System
      </div>

      <div className="footer-meta">
        <span>React · FastAPI · WebSockets · Redis</span>
        <a
          href="https://github.com/roshanmishra17"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
