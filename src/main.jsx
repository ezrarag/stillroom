import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import "./styles.css";

const email = "stillroommke@gmail.com";

const people = [
  {
    name: "JJ Bushman",
    role: "President & Executive Director",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    bio: "Award-winning composer, pianist, and audio engineer based in Milwaukee, with premieres across multiple countries and published multimedia sound work.",
  },
  {
    name: "Bella Brundage",
    role: "Vice President & Marketing Director",
    image:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&w=800&q=80",
    bio: "Award-winning composer, arranger, and singer-songwriter with screen music and choral composition honors, and deep roots in UWM's new-music community.",
  },
  {
    name: "Eli Drews",
    role: "Treasurer & CFO",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    bio: "Milwaukee performing arts advocate and horn player with UWM Symphony, Wind Ensemble, MYSO, community ensemble, and pit orchestra experience.",
  },
];

const auditionSessions = [
  ["May 23", "Instrumentalists - Session A", "Peck School of the Arts - Room TBD - 10:00 AM to 4:00 PM", "Instruments"],
  ["May 24", "Vocalists - Session A", "Peck School of the Arts - Room TBD - 10:00 AM to 2:00 PM", "Vocalists"],
  ["May 30", "Instrumentalists - Session B", "Location TBA - 10:00 AM to 4:00 PM", "Instruments"],
  ["May 31", "Vocalists - Session B", "Location TBA - 10:00 AM to 2:00 PM", "Vocalists"],
];

const tiers = [
  ["Friend of Stillroom", 25],
  ["Composer Supporter", 50],
  ["Ensemble Patron", 100],
  ["Artistic Benefactor", 250],
];

const initialScore = {
  firstName: "",
  lastName: "",
  email: "",
  title: "",
  genre: "Chamber",
  duration: "",
  instrumentation: "",
  scoreLink: "",
  statement: "",
};

const initialAudition = {
  firstName: "",
  lastName: "",
  email: "",
  sessionDate: "May 23",
  sessionType: "Instruments",
  instrument: "",
  experience: "",
};

function mailto(subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function App() {
  const [score, setScore] = useState(initialScore);
  const [scoreState, setScoreState] = useState("idle");
  const [audition, setAudition] = useState(initialAudition);
  const [auditionState, setAuditionState] = useState("idle");
  const [subEmail, setSubEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [subState, setSubState] = useState("idle");
  const [donationTier, setDonationTier] = useState(100);

  const donationHref = mailto(
    "Stillroom donation",
    `I would like to support Stillroom Music Inc. with a donation of $${donationTier}. Please send the current donation instructions.`
  );

  const updateScore = (field) => (event) => {
    if (scoreState !== "idle") {
      setScoreState("idle");
    }
    setScore((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateAudition = (field) => (event) => {
    if (auditionState !== "idle") {
      setAuditionState("idle");
    }

    if (field === "sessionDate") {
      const selectedSession = auditionSessions.find(([date]) => date === event.target.value);
      setAudition((current) => ({
        ...current,
        sessionDate: event.target.value,
        sessionType: selectedSession?.[3] ?? current.sessionType,
      }));
      return;
    }

    setAudition((current) => ({ ...current, [field]: event.target.value }));
  };

  const submitScore = async () => {
    if (scoreState === "submitting") {
      return;
    }

    setScoreState("submitting");

    try {
      await addDoc(collection(db, 'scores'), {
        ...score,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setScore(initialScore);
      setScoreState("success");
    } catch (error) {
      console.error("Score submission failed", error);
      setScoreState("error");
    }
  };

  const submitAudition = async () => {
    if (auditionState === "submitting") {
      return;
    }

    setAuditionState("submitting");

    try {
      await addDoc(collection(db, 'auditions'), {
        ...audition,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setAudition(initialAudition);
      setAuditionState("success");
    } catch (error) {
      console.error("Audition registration failed", error);
      setAuditionState("error");
    }
  };

  const submitSubscriber = async () => {
    if (subState === "submitting") {
      return;
    }

    setSubState("submitting");

    try {
      await addDoc(collection(db, 'subscribers'), {
        name: subName,
        email: subEmail,
        createdAt: serverTimestamp(),
      });
      setSubName("");
      setSubEmail("");
      setSubState("success");
    } catch (error) {
      console.error("Subscriber signup failed", error);
      setSubState("error");
    }
  };

  return (
    <>
      <nav className="nav" aria-label="Primary navigation">
        <a className="nav-logo" href="#top">
          Still<span>room</span>
        </a>
        <div className="nav-links">
          <a href="#mission">Mission</a>
          <a href="#scores">Scores</a>
          <a href="#auditions">Auditions</a>
          <a href="#people">Ensemble</a>
          <a href="#events">Events</a>
        </div>
        <a className="nav-cta" href="#donate">
          Donate
        </a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-media" aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Milwaukee contemporary ensemble - Est. 2025</p>
          <h1>Stillroom Music Inc.</h1>
          <p className="hero-subhead">
            New music with room for the voices the canon missed.
          </p>
          <p className="hero-body">
            Stillroom is a not-for-profit ensemble dedicated to amplifying composers of all
            identities, especially those historically underrepresented, across the Midwest
            and beyond.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#scores">
              Submit a Score
            </a>
            <a className="button secondary" href="#auditions">
              2026 Auditions
            </a>
          </div>
        </div>
      </header>

      <main>
        <div className="marquee" aria-hidden="true">
          <span>Call for Scores</span>
          <span>2026 Auditions</span>
          <span>Milwaukee New Music</span>
          <span>Midwest Composers</span>
          <span>Inclusive Programming</span>
          <span>UWM Alumni Founded</span>
        </div>

        <section className="mission section" id="mission">
          <div className="container mission-grid">
            <div>
              <p className="section-label">Who We Are</p>
              <h2>Music as a Vehicle for Equity</h2>
              <blockquote>
                "To cultivate an inclusive musical culture where composers of all identities,
                especially those historically underrepresented, are valued and empowered to
                shape the future of contemporary music."
              </blockquote>
            </div>
            <div className="stat-grid">
              <div>
                <strong>2025</strong>
                <span>Founded in Milwaukee</span>
              </div>
              <div>
                <strong>MKE</strong>
                <span>Community-rooted</span>
              </div>
              <div>
                <strong>All</strong>
                <span>Genres and instrumentations</span>
              </div>
              <div>
                <strong>501c3</strong>
                <span>Not-for-profit organization</span>
              </div>
            </div>
          </div>
        </section>

        <section className="scores section" id="scores">
          <div className="container split">
            <div>
              <p className="section-label">Composers</p>
              <h2>Call for Scores</h2>
              <p>
                Stillroom has an open call for composers across the Midwest. Scores of all
                genres and instrumentations are welcome for the 2026 season, from chamber
                music and full orchestra to electronics and experimental forms.
              </p>
              <div className="tags">
                {["All Genres", "Midwest Open", "Emerging Composers", "Electronic Welcome", "Underrepresented Voices"].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p className="muted">
                Submissions are reviewed by the Artistic Directors on a rolling basis.
                Selected composers will be contacted for programming consideration.
              </p>
            </div>

            <form className="panel" onSubmit={(event) => event.preventDefault()}>
              <h3>Submit Your Score</h3>
              <p>2026 season - rolling submissions open</p>
              <div className="form-row">
                <label>
                  First name
                  <input value={score.firstName} onChange={updateScore("firstName")} placeholder="Jean" />
                </label>
                <label>
                  Last name
                  <input value={score.lastName} onChange={updateScore("lastName")} placeholder="Sibelius" />
                </label>
              </div>
              <label>
                Email address
                <input type="email" value={score.email} onChange={updateScore("email")} placeholder="composer@email.com" />
              </label>
              <label>
                Piece title
                <input value={score.title} onChange={updateScore("title")} placeholder="Piece title" />
              </label>
              <div className="form-row">
                <label>
                  Genre
                  <select value={score.genre} onChange={updateScore("genre")}>
                    {["Chamber", "Orchestral", "Electronic", "Choral", "Jazz / Improvised", "Mixed / Experimental", "Other"].map((genre) => (
                      <option key={genre}>{genre}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Duration
                  <input value={score.duration} onChange={updateScore("duration")} placeholder="8 min" />
                </label>
              </div>
              <label>
                Instrumentation
                <input value={score.instrumentation} onChange={updateScore("instrumentation")} placeholder="String quartet + piano" />
              </label>
              <label>
                Score link
                <input type="url" value={score.scoreLink} onChange={updateScore("scoreLink")} placeholder="https://" />
              </label>
              <label>
                Composer statement
                <textarea value={score.statement} onChange={updateScore("statement")} placeholder="Tell us about yourself and this piece." />
              </label>
              <button
                className="button primary full"
                disabled={scoreState === "submitting"}
                onClick={submitScore}
                type="button"
              >
                {scoreState === "submitting" ? "Submitting..." : "Submit Score"}
              </button>
              {scoreState === "success" && (
                <div role="status">Score received. Our Artistic Directors will be in touch.</div>
              )}
              {scoreState === "error" && (
                <div role="alert">Submission failed. Please email stillroommke@gmail.com directly.</div>
              )}
            </form>
          </div>
        </section>

        <section className="auditions section" id="auditions">
          <div className="container audition-grid">
            <div>
              <p className="section-label">Join Us</p>
              <h2>2026 Auditions</h2>
              <p>
                Stillroom is assembling its inaugural ensemble. Auditions are split between
                instrumentalists and vocalists.
              </p>
              <a className="button dark" href="#audition-registration">
                Register for Audition
              </a>
            </div>
            <div className="session-list">
              {auditionSessions.map(([date, title, location, type]) => (
                <article className="session" key={title}>
                  <time>{date}</time>
                  <div>
                    <h3>{title}</h3>
                    <p>{location}</p>
                  </div>
                  <span>{type}</span>
                </article>
              ))}
              <form className="panel" id="audition-registration" onSubmit={(event) => event.preventDefault()}>
                <h3>Register for Auditions</h3>
                <p>Choose a session and tell us where you fit best.</p>
                <div className="form-row">
                  <label>
                    First name
                    <input value={audition.firstName} onChange={updateAudition("firstName")} placeholder="First name" />
                  </label>
                  <label>
                    Last name
                    <input value={audition.lastName} onChange={updateAudition("lastName")} placeholder="Last name" />
                  </label>
                </div>
                <label>
                  Email address
                  <input type="email" value={audition.email} onChange={updateAudition("email")} placeholder="performer@email.com" />
                </label>
                <label>
                  Session
                  <select value={audition.sessionDate} onChange={updateAudition("sessionDate")}>
                    {auditionSessions.map(([date, title]) => (
                      <option key={title} value={date}>{date} - {title}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Instrument / Voice type
                  <input value={audition.instrument} onChange={updateAudition("instrument")} placeholder="Violin, soprano, percussion..." />
                </label>
                <label>
                  Brief experience note
                  <textarea value={audition.experience} onChange={updateAudition("experience")} placeholder="Tell us about your ensemble, solo, or new-music experience." />
                </label>
                <button
                  className="button primary full"
                  disabled={auditionState === "submitting"}
                  onClick={submitAudition}
                  type="button"
                >
                  {auditionState === "submitting" ? "Submitting..." : "Register for Audition"}
                </button>
                {auditionState === "success" && (
                  <div role="status">Registration received. We will be in touch with audition details.</div>
                )}
                {auditionState === "error" && (
                  <div role="alert">Registration failed. Please email stillroommke@gmail.com directly.</div>
                )}
              </form>
            </div>
          </div>
        </section>

        <section className="people section" id="people">
          <div className="container">
            <p className="section-label">The Ensemble</p>
            <h2>Artistic Directors</h2>
            <p className="intro">
              Founded by composers, engineers, and performers who believe Milwaukee is the
              next great center for new music.
            </p>
            <div className="people-grid">
              {people.map((person) => (
                <article className="person" key={person.name}>
                  <img src={person.image} alt={person.name} />
                  <div>
                    <h3>{person.name}</h3>
                    <p className="role">{person.role}</p>
                    <p>{person.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="events section" id="events">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="section-label">Season</p>
                <h2>Upcoming Events</h2>
              </div>
              <a className="button dark" href={mailto("Stillroom event updates", "Please add me to the Stillroom event update list.")}>
                Event Updates
              </a>
            </div>
            <div className="events-grid">
              <article className="event featured">
                <p>Fall 2026 - Season Opener</p>
                <h3>Inaugural Concert Season</h3>
                <span>Venue TBA - Milwaukee, WI</span>
                <small>Works by emerging and established composers from across the Midwest.</small>
              </article>
              <article className="event">
                <p>TBD - 2026</p>
                <h3>Composer Showcase</h3>
                <span>Milwaukee - TBA</span>
                <small>An intimate showcase of submitted scores selected by the Artistic Directors.</small>
              </article>
              <article className="event">
                <p>Stay Tuned</p>
                <h3>Open Rehearsal</h3>
                <span>Milwaukee - TBA</span>
                <small>Open rehearsals will be announced through the newsletter.</small>
              </article>
            </div>
          </div>
        </section>

        <section className="donate section" id="donate">
          <div className="container split">
            <div>
              <p className="section-label">Support the Mission</p>
              <h2>Help Us Make History</h2>
              <p>
                Every dollar supports musician compensation, composer commissions, and the
                infrastructure behind Milwaukee's next contemporary music institution.
              </p>
            </div>
            <div className="donation-panel">
              {tiers.map(([name, amount]) => (
                <button
                  className={donationTier === amount ? "tier selected" : "tier"}
                  key={name}
                  onClick={() => setDonationTier(amount)}
                  type="button"
                >
                  <span>{name}</span>
                  <strong>${amount}</strong>
                </button>
              ))}
              <a className="button light full" href={donationHref}>
                Request Donation Instructions
              </a>
              <p>Stillroom Music Inc. is described as a 501(c)(3) nonprofit organization.</p>
            </div>
          </div>
        </section>

        <section className="subscribe section">
          <div className="container">
            <h2>Stay in the Room</h2>
            <p>Get updates on auditions, score calls, and concert season.</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <div className="form-row">
                <label>
                  Name
                  <input
                    value={subName}
                    onChange={(event) => {
                      setSubState("idle");
                      setSubName(event.target.value);
                    }}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={subEmail}
                    onChange={(event) => {
                      setSubState("idle");
                      setSubEmail(event.target.value);
                    }}
                    placeholder="you@email.com"
                  />
                </label>
              </div>
              <button
                className="button primary"
                disabled={subState === "submitting"}
                onClick={submitSubscriber}
                type="button"
              >
                {subState === "submitting" ? "Submitting..." : "Subscribe"}
              </button>
              {subState === "success" && (
                <div role="status">You're on the list.</div>
              )}
              {subState === "error" && (
                <div role="alert">Signup failed. Please email stillroommke@gmail.com directly.</div>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-logo">Still<span>room</span></div>
            <p>Milwaukee's contemporary music ensemble for a wider, bolder future.</p>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#mission">Mission</a>
            <a href="#people">Ensemble</a>
            <a href="#events">Events</a>
          </div>
          <div>
            <h3>Participate</h3>
            <a href="#scores">Submit a Score</a>
            <a href="#auditions">Auditions</a>
            <a href={mailto("Stillroom volunteer interest", "I would like to learn about volunteering with Stillroom.")}>Volunteer</a>
          </div>
          <div>
            <h3>Connect</h3>
            <a href={`mailto:${email}`}>Contact</a>
            <a href="https://readyaimgo.biz" target="_blank" rel="noreferrer">ReadyAimGo</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 Stillroom Music Incorporated - Milwaukee, WI</p>
          <p>Built by ReadyAimGo</p>
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
