import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  PhoneCall, 
  AlertOctagon, 
  History, 
  RotateCcw, 
  ShieldCheck, 
  Footprints,
  Compass,
  X,
  BellRing
} from 'lucide-react';

const CAMPUS_LOCATIONS = [
  'Central Science Library',
  'Student Center & Union',
  'Turing Computer Science Building',
  'North Commuter Parking Lot C',
  'West Campus Residence Quad (Oak Hall)',
  'South Gate Bus & Light Rail Station',
  'University Athletics & Recreation Gym',
  'Graduate Research Complex',
  'Campus Health & Counseling Center'
];

const INITIAL_HISTORY = [
  {
    id: 'W-901',
    from: 'Central Science Library',
    to: 'West Campus Residence Quad (Oak Hall)',
    durationMin: 12,
    date: 'Yesterday, 10:45 PM',
    status: 'Arrived Safely',
    checkIns: 2,
  },
  {
    id: 'W-902',
    from: 'Turing Computer Science Building',
    to: 'North Commuter Parking Lot C',
    durationMin: 8,
    date: 'Nov 9, 11:15 PM',
    status: 'Arrived Safely',
    checkIns: 1,
  },
  {
    id: 'W-903',
    from: 'University Athletics Gym',
    to: 'Student Center & Union',
    durationMin: 15,
    date: 'Nov 8, 9:30 PM',
    status: 'Arrived Safely',
    checkIns: 3,
  },
];

export default function App() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('safewalk_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Walk states: 'idle' | 'active' | 'completed'
  const [walkState, setWalkState] = useState('idle');
  const [origin, setOrigin] = useState(CAMPUS_LOCATIONS[0]);
  const [destination, setDestination] = useState(CAMPUS_LOCATIONS[4]);
  const [targetMinutes, setTargetMinutes] = useState(12);

  // Active walk session data
  const [secondsRemaining, setSecondsRemaining] = useState(12 * 60);
  const [checkInCount, setCheckInCount] = useState(0);
  const [lastCheckInMsg, setLastCheckInMsg] = useState('');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [mockAlertTriggered, setMockAlertTriggered] = useState(false);

  useEffect(() => {
    localStorage.setItem('safewalk_history', JSON.stringify(history));
  }, [history]);

  // Countdown timer for active walk
  useEffect(() => {
    let timer = null;
    if (walkState === 'active' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [walkState, secondsRemaining]);

  const handleStartWalk = (e) => {
    e.preventDefault();
    if (origin === destination) {
      alert('Please select different starting and destination points.');
      return;
    }
    setSecondsRemaining(targetMinutes * 60);
    setCheckInCount(0);
    setLastCheckInMsg('');
    setWalkState('active');
  };

  const handleCheckIn = () => {
    setCheckInCount(prev => prev + 1);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastCheckInMsg(`Checked in safe at ${now}! (Total: ${checkInCount + 1})`);
  };

  const handleFinishWalk = () => {
    const elapsedMinutes = Math.max(1, Math.round((targetMinutes * 60 - secondsRemaining) / 60));
    const newEntry = {
      id: `W-${Math.floor(100 + Math.random() * 900)}`,
      from: origin,
      to: destination,
      durationMin: elapsedMinutes,
      date: 'Just now',
      status: 'Arrived Safely',
      checkIns: checkInCount,
    };

    setHistory([newEntry, ...history]);
    setWalkState('completed');
  };

  const handleCancelWalk = () => {
    if (window.confirm('Cancel active walk session?')) {
      setWalkState('idle');
    }
  };

  const handleResetHistory = () => {
    if (window.confirm('Reset walk history to default samples?')) {
      setHistory(INITIAL_HISTORY);
      localStorage.removeItem('safewalk_history');
    }
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalSeconds = targetMinutes * 60;
  const progressPercent = totalSeconds > 0 ? Math.min(100, Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)) : 0;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <div className="nav-content">
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <ShieldAlert size={22} />
            </div>
            <span>SafeWalk</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              className="btn btn-sos" 
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
              onClick={() => setIsEmergencyModalOpen(true)}
            >
              <PhoneCall size={16} />
              <span>Campus SOS</span>
            </button>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              onClick={handleResetHistory}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        {/* State 1: Active Walk Session */}
        {walkState === 'active' && (
          <div className="active-walk-container">
            <div className="route-badge">
              <Compass size={16} color="#fb7185" />
              <span>Walking from <strong>{origin}</strong> to <strong>{destination}</strong></span>
            </div>

            {/* Glowing Timer Circle */}
            <div className="timer-circle">
              <div className="timer-digits">{formatTimer(secondsRemaining)}</div>
              <div className="timer-label">Remaining Time</div>
            </div>

            {/* Progress bar */}
            <div style={{ maxWidth: '400px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: '#10b981', transition: 'width 1s linear' }} />
            </div>

            {lastCheckInMsg && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={16} />
                <span>{lastCheckInMsg}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="action-buttons-group">
              <button className="btn btn-secondary" onClick={handleCheckIn}>
                <CheckCircle2 size={18} color="#10b981" />
                <span>Check In (I'm Ok)</span>
              </button>
              <button className="btn btn-success" onClick={handleFinishWalk}>
                <ShieldCheck size={18} />
                <span>I've Arrived Safely</span>
              </button>
              <button 
                className="btn btn-sos" 
                onClick={() => setIsEmergencyModalOpen(true)}
                style={{ gridColumn: '1 / -1' }}
              >
                <AlertOctagon size={18} />
                <span>Request Campus Safety Help</span>
              </button>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button 
                onClick={handleCancelWalk}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cancel this walk session
              </button>
            </div>
          </div>
        )}

        {/* State 2: Completed Screen */}
        {walkState === 'completed' && (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', marginBottom: '2rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <ShieldCheck size={36} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.5rem' }}>
              You Arrived Safely!
            </h2>
            <p style={{ color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
              Your companion session from <strong>{origin}</strong> to <strong>{destination}</strong> has been completed and saved to your history.
            </p>
            <button className="btn btn-primary" onClick={() => setWalkState('idle')}>
              <Footprints size={18} />
              <span>Start Another Walk</span>
            </button>
          </div>
        )}

        {/* State 3: Idle (Start Walk Page) */}
        {walkState === 'idle' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', marginBottom: '2rem' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Navigation size={20} color="#e11d48" />
                  Plan Your Campus Walk
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Simulated Companion Guard</span>
              </div>
              <form onSubmit={handleStartWalk} className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {/* Origin */}
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={15} style={{ display: 'inline', marginRight: '4px', color: '#059669' }} />
                      Starting Point
                    </label>
                    <select 
                      className="form-select"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    >
                      {CAMPUS_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Destination */}
                  <div className="form-group">
                    <label className="form-label">
                      <MapPin size={15} style={{ display: 'inline', marginRight: '4px', color: '#e11d48' }} />
                      Destination
                    </label>
                    <select 
                      className="form-select"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    >
                      {CAMPUS_LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duration Picker */}
                <div className="form-group">
                  <label className="form-label">
                    <Clock size={15} style={{ display: 'inline', marginRight: '4px', color: '#0284c7' }} />
                    Estimated Walking Duration
                  </label>
                  <div className="duration-grid">
                    {[5, 10, 15, 20].map(mins => (
                      <div
                        key={mins}
                        className={`duration-chip ${targetMinutes === mins ? 'selected' : ''}`}
                        onClick={() => setTargetMinutes(mins)}
                      >
                        {mins} Minutes
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '1rem', marginTop: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <ShieldAlert size={20} color="#e11d48" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.825rem', color: '#9f1239', lineHeight: 1.4 }}>
                    <strong>Safety Promise:</strong> Once activated, SafeWalk keeps a countdown timer running. You can check in at any time to confirm you're safe, or tap SOS to view campus police contacts.
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <Footprints size={18} />
                    <span>Start Monitored Walk Session</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Walk History Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <History size={18} color="#64748b" />
              Past Campus Walks Log
            </h2>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{history.length} logged walks</span>
          </div>
          <div>
            {history.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No recorded walks yet.</p>
            ) : (
              <div>
                {history.map(item => (
                  <div key={item.id} className="history-item">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                        {item.from} → {item.to}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', gap: '1rem' }}>
                        <span>🕒 {item.durationMin} mins</span>
                        <span>🗓️ {item.date}</span>
                        <span>🛡️ {item.checkIns} check-ins</span>
                      </div>
                    </div>
                    <div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#d1fae5', color: '#065f46', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '9999px' }}>
                        <CheckCircle2 size={13} />
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Campus Emergency Modal */}
      {isEmergencyModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="card-header" style={{ background: '#fef2f2' }}>
              <h3 className="card-title" style={{ color: '#991b1b' }}>
                <PhoneCall size={20} color="#dc2626" />
                Campus Safety & Emergency Assistance
              </h3>
              <button 
                onClick={() => { setIsEmergencyModalOpen(false); setMockAlertTriggered(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="card-body">
              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem' }}>
                If you ever feel unsafe on campus grounds, use these immediate emergency options:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Campus Police (24/7 Patrol Dispatch)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
                    (555) 019-SAFE
                  </div>
                </div>

                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Student Night Escort Walking Service</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7', marginTop: '0.2rem' }}>
                    (555) 019-WALK
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>Available 8:00 PM – 3:00 AM daily</div>
                </div>
              </div>

              {mockAlertTriggered ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <CheckCircle2 size={24} color="#059669" style={{ margin: '0 auto 0.4rem' }} />
                  <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.9rem' }}>Simulated Alert Dispatched!</div>
                  <p style={{ fontSize: '0.775rem', color: '#047857', marginTop: '0.25rem' }}>
                    (Demo Mode: Virtual ping recorded at nearest campus station).
                  </p>
                </div>
              ) : (
                <button 
                  className="btn btn-sos" 
                  style={{ width: '100%' }}
                  onClick={() => setMockAlertTriggered(true)}
                >
                  <BellRing size={18} />
                  <span>Simulate "Alert Campus Security" Ping</span>
                </button>
              )}

              <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%' }}
                  onClick={() => { setIsEmergencyModalOpen(false); setMockAlertTriggered(false); }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>SafeWalk &copy; 2026 — Campus Security & Student Association Initiative</p>
      </footer>
    </div>
  );
}

