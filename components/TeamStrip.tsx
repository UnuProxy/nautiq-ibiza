export default function TeamStrip() {
  const team = [
    { name: "Julian", role: "Founder & Host", img: "/people/julian-portrait.jpg" },
    { name: "Romina", role: "Holiday Planner", img: "/people/romina.jpg" },
    { name: "Andreea", role: "Corporate Events", img: "/people/andreea.jpg" },
  ];
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <h2>Real people, real care</h2>
          <p className="section-subtitle">Message us directly — no bots, no call centres.</p>
        </div>
        <div className="grid">
          {team.map((m) => (
            <article key={m.name} className="card" style={{ overflow: "hidden" }}>
              <img src={m.img} alt={`${m.name}, ${m.role}`} style={{ height: 260, objectFit: "cover" }} />
              <div className="card-body">
                <h3>{m.name}</h3>
                <p className="muted">{m.role}</p>
                <div className="hero-buttons" style={{ marginTop: 8 }}>
                  <a className="btn" href="https://wa.me/34600000000">WhatsApp</a>
                  <a className="btn btn-primary" href="#contact">Plan my day</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
