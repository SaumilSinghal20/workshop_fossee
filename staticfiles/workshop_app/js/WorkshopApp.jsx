const { useState } = React;

/* ─── Design Tokens ─── */
const BRAND   = "#1a1d2e";
const ACCENT  = "#4f6ef7";
const SUCCESS = "#22c55e";
const DANGER  = "#ef4444";
const WARN    = "#f59e0b";
const MUTED   = "#6b7280";

/* Category → gradient map so each card has a unique feel */
const CAT_GRADIENT = {
  "Computer Science":       "linear-gradient(135deg,#4f6ef7 0%,#7c3aed 100%)",
  "Information Technology": "linear-gradient(135deg,#0ea5e9 0%,#4f6ef7 100%)",
  "Electronics":            "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
  "Mechanical Engineering": "linear-gradient(135deg,#10b981 0%,#0ea5e9 100%)",
  "Electrical Engineering": "linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)",
  "Biosciences":            "linear-gradient(135deg,#22c55e 0%,#0ea5e9 100%)",
  "Technical":              "linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)",
  "Core":                   "linear-gradient(135deg,#4f6ef7 0%,#0ea5e9 100%)",
};
const DEFAULT_GRADIENT = "linear-gradient(135deg,#4f6ef7 0%,#7c3aed 100%)";

/* Category icons (Material Icons names) */
const CAT_ICON = {
  "Computer Science":       "code",
  "Information Technology": "language",
  "Electronics":            "memory",
  "Mechanical Engineering": "precision_manufacturing",
  "Electrical Engineering": "bolt",
  "Biosciences":            "biotech",
  "Technical":              "build",
  "Core":                   "school",
};

const LEVEL_COLOR = { Beginner: SUCCESS, Intermediate: WARN, Advanced: DANGER };

/* ─── Data ─── */
const MOCK_WORKSHOPS = [
  {
    id:1, title:"Python for Data Science",
    category:"Computer Science", duration:"3 days, 8 hrs/day",
    instructor:"Dr. Ananya Sharma",
    available:["2026-05-10","2026-05-24","2026-06-07"],
    seats:60, booked:43, level:"Intermediate",
    description:"Gain hands-on experience with NumPy, Pandas, Matplotlib, and scikit-learn using real-world datasets. You will build complete data pipelines — from raw CSV to trained ML model — and learn how to communicate findings with compelling visualisations.",
  },
  {
    id:2, title:"Web Development with Django",
    category:"Information Technology", duration:"2 days, 8 hrs/day",
    instructor:"Prof. Rajan Mehta",
    available:["2026-05-15","2026-06-01","2026-06-20"],
    seats:50, booked:21, level:"Beginner",
    description:"Build and deploy a full-stack web application from scratch using Django. The workshop covers models, views, URL routing, template inheritance, user authentication, and cloud deployment on a live server — all within two focused days.",
  },
  {
    id:3, title:"Embedded Systems & IoT",
    category:"Electronics", duration:"3 days, 6 hrs/day",
    instructor:"Dr. Priya Nair",
    available:["2026-05-20","2026-06-10"],
    seats:40, booked:38, level:"Advanced",
    description:"Bridge the gap between hardware and software. You'll program microcontrollers, wire sensors and actuators, and push live telemetry to the cloud over MQTT. Participants leave with a working IoT prototype they built themselves.",
  },
  {
    id:4, title:"CFD with OpenFOAM",
    category:"Mechanical Engineering", duration:"4 days, 8 hrs/day",
    instructor:"Prof. Aditya Kulkarni",
    available:["2026-06-05","2026-06-25"],
    seats:35, booked:12, level:"Advanced",
    description:"Master computational fluid dynamics using the industry-standard open-source toolkit OpenFOAM. Topics include geometry preparation, meshing with snappyHexMesh, solver configuration, boundary conditions, and results post-processing in ParaView.",
  },
  {
    id:5, title:"VLSI Design Fundamentals",
    category:"Electrical Engineering", duration:"2 days, 7 hrs/day",
    instructor:"Dr. Kavitha Iyer",
    available:["2026-05-28","2026-06-18"],
    seats:45, booked:30, level:"Intermediate",
    description:"Walk through the complete ASIC design flow — from RTL coding in Verilog, through logic synthesis, static timing analysis, and place-and-route — culminating in a physical design ready for tape-out using open-source EDA tools.",
  },
  {
    id:6, title:"Bioinformatics with R",
    category:"Biosciences", duration:"2 days, 8 hrs/day",
    instructor:"Dr. Sneha Reddy",
    available:["2026-06-12","2026-07-02"],
    seats:30, booked:8, level:"Beginner",
    description:"Analyse genomic datasets end-to-end using R and the Bioconductor ecosystem. You will perform quality control, differential gene expression analysis, pathway enrichment, and produce publication-ready heatmaps and volcano plots.",
  },
];

const WORKSHOPS = (window.DJANGO_WORKSHOPS && window.DJANGO_WORKSHOPS.length > 0)
  ? window.DJANGO_WORKSHOPS
  : MOCK_WORKSHOPS;

const DEPARTMENTS = ["All", ...new Set(WORKSHOPS.map(w => w.category))];

const MOCK_USER = window.DJANGO_USER || {
  name:"Guest User", email:"guest@example.com",
  institute:"IIT Bombay", department:"General", position:"Guest",
};

const fmtDate = d =>
  new Date(d).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"});

/* ─── Reusable Badge ─── */
function Badge({ label, bg, small=false }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      gap:4, fontSize: small ? 10 : 11, fontWeight:600,
      color:"#fff", background:bg, borderRadius:20,
      padding: small ? "2px 7px" : "3px 9px",
      letterSpacing:"0.02em",
    }}>
      {label}
    </span>
  );
}

/* ─── Seat Availability Bar ─── */
function SeatBar({ booked, seats }) {
  const pct   = Math.round((booked / seats) * 100);
  const color = pct >= 90 ? DANGER : pct >= 65 ? WARN : SUCCESS;
  const left  = seats - booked;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:12,color:MUTED}}>{booked}/{seats} enrolled</span>
        <span style={{fontSize:12,fontWeight:700,color}}>
          {left === 0 ? "Full" : `${left} seat${left !== 1 ? "s" : ""} left`}
        </span>
      </div>
      <div style={{height:7,background:"#e5e7eb",borderRadius:99,overflow:"hidden",position:"relative"}}>
        <div style={{
          width:`${pct}%`, height:"100%", background:color,
          borderRadius:99, transition:"width .5s ease",
        }}/>
      </div>
      <div style={{textAlign:"right",fontSize:10,color:MUTED,marginTop:3}}>{pct}% filled</div>
    </div>
  );
}

/* ─── Workshop Card ─── */
function WorkshopCard({ w, onBook }) {
  const [hovered, setHovered] = useState(false);
  const full = w.booked >= w.seats;
  const gradient = CAT_GRADIENT[w.category] || DEFAULT_GRADIENT;
  const icon     = CAT_ICON[w.category] || "school";
  const levelColor = LEVEL_COLOR[w.level] || SUCCESS;

  return (
    <div
      onClick={() => !full && onBook(w)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"#fff",
        borderRadius:12,
        overflow:"hidden",
        display:"flex",
        flexDirection:"column",
        cursor: full ? "default" : "pointer",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,.14)"
          : "0 2px 12px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition:"all .25s ease",
        border:"1px solid #e5e7eb",
      }}
    >
      {/* ── Gradient header banner ── */}
      <div style={{
        background: gradient,
        padding:"22px 20px 16px",
        position:"relative",
        minHeight:96,
      }}>
        {/* translucent circle decoration */}
        <div style={{
          position:"absolute", top:-20, right:-20,
          width:100, height:100, borderRadius:"50%",
          background:"rgba(255,255,255,.08)",
        }}/>
        <div style={{
          position:"absolute", bottom:-10, left:60,
          width:60, height:60, borderRadius:"50%",
          background:"rgba(255,255,255,.06)",
        }}/>

        {/* icon + level badge row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{
            width:40, height:40, borderRadius:10,
            background:"rgba(255,255,255,.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <span className="material-icons" style={{fontSize:22,color:"#fff"}}>{icon}</span>
          </div>
          <Badge
            label={w.level}
            bg={full ? "#6b7280" : levelColor}
          />
        </div>

        {/* title */}
        <h6 style={{
          margin:0, fontSize:16, fontWeight:700,
          color:"#fff", lineHeight:1.35,
          textShadow:"0 1px 3px rgba(0,0,0,.2)",
        }}>
          {w.title}
        </h6>

        {/* category chip */}
        <div style={{marginTop:6}}>
          <span style={{
            fontSize:11, color:"rgba(255,255,255,.8)",
            background:"rgba(255,255,255,.15)",
            borderRadius:20, padding:"2px 9px", fontWeight:500,
          }}>
            {w.category}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{padding:"16px 18px",flex:1,display:"flex",flexDirection:"column",gap:12}}>

        {/* Description — full text, not truncated */}
        <p style={{
          margin:0, fontSize:13.5, color:"#374151",
          lineHeight:1.65, flex:1,
        }}>
          {w.description}
        </p>

        {/* Meta row: instructor + duration */}
        <div style={{
          display:"flex", gap:12, flexWrap:"wrap",
          padding:"10px 12px",
          background:"#f9fafb",
          borderRadius:8,
          border:"1px solid #f0f0f0",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:"#374151"}}>
            <span className="material-icons" style={{fontSize:15,color:ACCENT}}>person</span>
            <span style={{fontWeight:500}}>{w.instructor}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:"#374151"}}>
            <span className="material-icons" style={{fontSize:15,color:ACCENT}}>schedule</span>
            <span>{w.duration}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,fontSize:12.5,color:"#374151"}}>
            <span className="material-icons" style={{fontSize:15,color:ACCENT}}>event</span>
            <span>{w.available.length} date{w.available.length !== 1 ? "s" : ""} available</span>
          </div>
        </div>

        {/* Seat bar */}
        <SeatBar booked={w.booked} seats={w.seats} />

        {/* CTA button */}
        <button
          onClick={e => { e.stopPropagation(); !full && onBook(w); }}
          disabled={full}
          style={{
            padding:"10px 0",
            width:"100%",
            border:"none",
            borderRadius:8,
            background: full
              ? "#9ca3af"
              : hovered
                ? (gradient.includes("7c3aed") ? "#4338ca" : ACCENT)
                : ACCENT,
            color:"#fff",
            fontWeight:700,
            fontSize:14,
            cursor: full ? "not-allowed" : "pointer",
            letterSpacing:"0.02em",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"background .2s",
          }}
        >
          <span className="material-icons" style={{fontSize:17}}>
            {full ? "block" : "edit_calendar"}
          </span>
          {full ? "Fully Booked" : "Book This Workshop"}
        </button>
      </div>
    </div>
  );
}

/* ─── Booking Modal (unchanged logic, minor style polish) ─── */
function BookingModal({ w, user, onClose, onConfirm }) {
  const [step,setStep]   = useState(1);
  const [date,setDate]   = useState("");
  const [conds,setConds] = useState({c1:false,c2:false,c3:false});
  if (!w) return null;
  const allOk = conds.c1 && conds.c2 && conds.c3 && date;
  const CONDITIONS = [
    {key:"c1",text:"We assure to give minimum 50 participants for the workshop."},
    {key:"c2",text:"We agree that this booking won't be cancelled without 2 days prior notice to the instructor and FOSSEE."},
    {key:"c3",text:"This proposal is subject to FOSSEE and instructor approval."},
  ];
  const Btn = ({label,bg,onClick,disabled=false}) => (
    <button onClick={onClick} disabled={disabled} style={{
      flex:1, padding:"10px 0", border:"none", borderRadius:7,
      background: disabled ? "#9ca3af" : bg,
      color:"#fff", fontWeight:700, fontSize:14,
      cursor: disabled ? "not-allowed" : "pointer",
    }}>{label}</button>
  );
  const gradient = CAT_GRADIENT[w.category] || DEFAULT_GRADIENT;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1050,padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:12,width:"100%",maxWidth:500,boxShadow:"0 20px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
        {/* header */}
        <div style={{background:gradient,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"rgba(255,255,255,.7)",fontSize:11,marginBottom:3,letterSpacing:"0.05em",textTransform:"uppercase"}}>Book Workshop</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:17}}>{w.title}</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",fontSize:20,cursor:"pointer",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* step tabs */}
        <div style={{display:"flex",borderBottom:"1px solid #e5e7eb"}}>
          {["Your Info","Pick Date","Confirm"].map((label,i)=>{
            const active=step===i+1, done=step>i+1;
            return (
              <div key={label} style={{flex:1,padding:"11px 0",textAlign:"center",fontSize:12,fontWeight:600,color:active?ACCENT:done?SUCCESS:MUTED,borderBottom:active?`2px solid ${ACCENT}`:"2px solid transparent",background:active?"#f0f5ff":"#fff",transition:"all .2s"}}>
                {done?"✓ ":`${i+1}. `}{label}
              </div>
            );
          })}
        </div>
        <div style={{padding:"22px 24px"}}>
          {step===1&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Review your registration details before continuing.</p>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:16}}>
                {[["Full Name",user.name],["Email",user.email],["Institute",user.institute],["Department",user.department],["Role",user.position]].map(([k,v])=>(
                  <tr key={k} style={{borderBottom:"1px solid #f3f4f6"}}>
                    <td style={{padding:"8px 0",color:MUTED,width:"38%"}}>{k}</td>
                    <td style={{padding:"8px 0",fontWeight:600,color:"#111827"}}>{v}</td>
                  </tr>
                ))}
              </table>
              <div style={{display:"flex",gap:8}}><Btn label="Next →" bg={ACCENT} onClick={()=>setStep(2)}/></div>
            </div>
          )}
          {step===2&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Select your preferred workshop date.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {w.available.map(d=>(
                  <label key={d} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:8,cursor:"pointer",border:`1.5px solid ${date===d?ACCENT:"#e5e7eb"}`,background:date===d?"#eef2ff":"#fafafa",transition:"all .15s"}}>
                    <input type="radio" name="date" value={d} checked={date===d} onChange={()=>setDate(d)} style={{accentColor:ACCENT}}/>
                    <span style={{fontSize:13,fontWeight:date===d?700:400,color:"#111827"}}>{fmtDate(d)}</span>
                  </label>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6b7280" onClick={()=>setStep(1)}/>
                <Btn label="Next →" bg={ACCENT} onClick={()=>setStep(3)} disabled={!date}/>
              </div>
            </div>
          )}
          {step===3&&(
            <div>
              <p style={{margin:"0 0 12px",fontSize:13,color:MUTED}}>Accept all conditions to confirm your booking.</p>
              {CONDITIONS.map(({key,text})=>(
                <label key={key} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12,cursor:"pointer"}}>
                  <input type="checkbox" checked={conds[key]} onChange={e=>setConds(c=>({...c,[key]:e.target.checked}))} style={{accentColor:ACCENT,marginTop:2,flexShrink:0}}/>
                  <span style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{text}</span>
                </label>
              ))}
              <div style={{background:"#f9fafb",border:"1px solid #e5e7eb",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13}}>
                <div style={{color:MUTED,marginBottom:2,fontSize:11,textTransform:"uppercase",letterSpacing:"0.05em"}}>Selected date</div>
                <div style={{fontWeight:700,color:"#111827"}}>{fmtDate(date)}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6b7280" onClick={()=>setStep(2)}/>
                <Btn label="✓ Confirm Booking" bg={SUCCESS} onClick={()=>allOk&&onConfirm(w,date)} disabled={!allOk}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Success Alert ─── */
function SuccessAlert({ booking, onDismiss }) {
  if (!booking) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16}}>
      <div style={{background:"#fff",borderRadius:12,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.3)",overflow:"hidden"}}>
        <div style={{background:"linear-gradient(135deg,#22c55e,#16a34a)",padding:"16px 20px",color:"#fff",fontWeight:700,fontSize:17,display:"flex",alignItems:"center",gap:8}}>
          <span className="material-icons">check_circle</span> Booking Submitted!
        </div>
        <div style={{padding:"20px 24px"}}>
          <p style={{margin:"0 0 14px",fontSize:13,color:"#374151"}}>Your request is pending instructor / FOSSEE approval. You'll receive a confirmation email shortly.</p>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:18}}>
            {[["Workshop",booking.workshop.title],["Instructor",booking.workshop.instructor],["Date",fmtDate(booking.date)],["Status","Pending Approval"]].map(([k,v])=>(
              <tr key={k} style={{borderBottom:"1px solid #f3f4f6"}}>
                <td style={{padding:"7px 0",color:MUTED,width:"38%"}}>{k}</td>
                <td style={{padding:"7px 0",fontWeight:600,color:"#111827"}}>{v}</td>
              </tr>
            ))}
          </table>
          <button onClick={onDismiss} style={{width:"100%",padding:"10px",border:"none",borderRadius:8,background:SUCCESS,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── My Bookings Page ─── */
function MyBookingsPage({ bookings }) {
  if (bookings.length===0) return (
    <div style={{textAlign:"center",padding:"80px 20px"}}>
      <span className="material-icons" style={{fontSize:56,color:"#d1d5db",marginBottom:16}}>event_busy</span>
      <h5 style={{color:"#111827",margin:"0 0 8px"}}>No bookings yet</h5>
      <p style={{color:MUTED,fontSize:14,margin:0}}>Browse the workshops above and make your first booking.</p>
    </div>
  );
  return (
    <div>
      <h5 style={{margin:"0 0 18px",fontWeight:700,color:"#111827"}}>My Bookings</h5>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {bookings.map((b,i)=>{
          const gradient = CAT_GRADIENT[b.workshop.category] || DEFAULT_GRADIENT;
          return (
            <div key={i} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"14px 18px",display:"flex",alignItems:"center",gap:14,boxShadow:"0 2px 8px rgba(0,0,0,.05)"}}>
              <div style={{width:44,height:44,borderRadius:10,background:gradient,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span className="material-icons" style={{fontSize:22,color:"#fff"}}>{CAT_ICON[b.workshop.category]||"school"}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:14,color:"#111827",marginBottom:2}}>{b.workshop.title}</div>
                <div style={{fontSize:12,color:MUTED}}>{b.workshop.instructor} · {fmtDate(b.date)}</div>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:WARN,background:"#fef3c7",borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap"}}>Pending</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main App ─── */
function WorkshopApp() {
  const [page,setPage]         = useState("workshops");
  const [filter,setFilter]     = useState("All");
  const [search,setSearch]     = useState("");
  const [booking,setBooking]   = useState(null);
  const [success,setSuccess]   = useState(null);
  const [bookings,setBookings] = useState([]);
  const user = MOCK_USER;

  const filtered = WORKSHOPS.filter(w =>
    (filter==="All" || w.category===filter) &&
    (w.title.toLowerCase().includes(search.toLowerCase()) ||
     w.instructor.toLowerCase().includes(search.toLowerCase()) ||
     (w.description||"").toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = (w,date) => {
    setBookings(b=>[...b,{workshop:w,date}]);
    setBooking(null);
    setSuccess({workshop:w,date});
  };

  return (
    <div style={{fontFamily:"'Inter','Segoe UI',sans-serif",background:"transparent",minHeight:"80vh"}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 20px 60px"}}>

        {/* ── Workshops page ── */}
        {page==="workshops" && (
          <div>
            {/* Hero header */}
            <div style={{marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
              <div>
                <h2 style={{margin:"0 0 5px",fontWeight:800,color:"#111827",fontSize:"1.75rem"}}>
                  Discovery Center
                </h2>
                <p style={{margin:0,fontSize:14,color:MUTED}}>
                  Explore {WORKSHOPS.length} premium FOSSEE technical training programs
                </p>
              </div>
              <button
                onClick={()=>setPage("my-bookings")}
                style={{
                  background:"#fff", border:"1.5px solid #e5e7eb",
                  padding:"9px 18px", borderRadius:9,
                  fontSize:13, fontWeight:700, color:"#374151",
                  cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                  boxShadow:"0 1px 4px rgba(0,0,0,.06)",
                }}
              >
                <span className="material-icons" style={{fontSize:17}}>bookmarks</span>
                My Shortlist {bookings.length>0 && `(${bookings.length})`}
              </button>
            </div>

            {/* Filter bar */}
            <div style={{
              background:"#fff", border:"1px solid #e5e7eb", borderRadius:10,
              padding:"12px 16px", marginBottom:28,
              display:"flex", gap:10, flexWrap:"wrap", alignItems:"center",
              boxShadow:"0 2px 12px rgba(0,0,0,.05)",
            }}>
              <div style={{position:"relative",flex:"1 1 280px"}}>
                <input
                  type="text"
                  placeholder="Search workshops, instructors, or topics..."
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  style={{
                    width:"100%", padding:"10px 12px 10px 38px",
                    border:"1.5px solid #e5e7eb", borderRadius:8,
                    fontSize:13.5, outline:"none", background:"#f9fafb",
                    transition:"border .2s",
                  }}
                  onFocus={e=>e.target.style.borderColor=ACCENT}
                  onBlur={e=>e.target.style.borderColor="#e5e7eb"}
                />
                <span className="material-icons" style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:18,color:MUTED,pointerEvents:"none"}}>search</span>
              </div>
              <select
                value={filter}
                onChange={e=>setFilter(e.target.value)}
                style={{padding:"10px 14px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:13.5,background:"#f9fafb",color:"#374151",cursor:"pointer",outline:"none"}}
              >
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
              <span style={{fontSize:13,color:MUTED,whiteSpace:"nowrap",marginLeft:"auto"}}>
                {filtered.length} of {WORKSHOPS.length} workshop{WORKSHOPS.length!==1?"s":""}
              </span>
            </div>

            {/* Cards grid */}
            {filtered.length === 0
              ? (
                <div style={{textAlign:"center",padding:"80px 0",color:MUTED}}>
                  <span className="material-icons" style={{fontSize:52,color:"#d1d5db",marginBottom:12}}>search_off</span>
                  <p style={{fontSize:16,margin:0}}>No workshops match your search.</p>
                  <button onClick={()=>{setSearch("");setFilter("All");}} style={{marginTop:12,background:"none",border:"none",color:ACCENT,fontSize:13,fontWeight:600,cursor:"pointer"}}>Clear filters</button>
                </div>
              )
              : (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:24}}>
                  {filtered.map(w=><WorkshopCard key={w.id} w={w} onBook={setBooking}/>)}
                </div>
              )
            }
          </div>
        )}

        {/* ── My Bookings page ── */}
        {page==="my-bookings" && (
          <div>
            <button
              onClick={()=>setPage("workshops")}
              style={{background:"none",border:"none",padding:0,fontSize:14,color:ACCENT,fontWeight:700,cursor:"pointer",marginBottom:20,display:"flex",alignItems:"center",gap:4}}
            >
              <span className="material-icons" style={{fontSize:18}}>arrow_back</span> Back to Discovery
            </button>
            <MyBookingsPage bookings={bookings}/>
          </div>
        )}
      </div>

      {booking && <BookingModal w={booking} user={user} onClose={()=>setBooking(null)} onConfirm={handleConfirm}/>}
      {success  && <SuccessAlert booking={success} onDismiss={()=>setSuccess(null)}/>}
    </div>
  );
}

/* ─── Mount ─── */
const root = ReactDOM.createRoot(document.getElementById('workshop-app-root'));
root.render(<WorkshopApp />);
