import { useState } from "react";

const BRAND  = "#343a40";
const ACCENT = "#007bff";
const SUCCESS= "#28a745";
const DANGER = "#dc3545";
const WARN   = "#ffc107";
const MUTED  = "#6c757d";

const WORKSHOPS = [
  { id:1, title:"Python for Data Science", category:"Computer Science", duration:"3 days, 8 hrs/day", instructor:"Dr. Ananya Sharma", available:["2026-05-10","2026-05-24","2026-06-07"], seats:60, booked:43, level:"Intermediate", description:"Hands-on NumPy, Pandas, Matplotlib and scikit-learn with real datasets." },
  { id:2, title:"Web Development with Django", category:"Information Technology", duration:"2 days, 8 hrs/day", instructor:"Prof. Rajan Mehta", available:["2026-05-15","2026-06-01","2026-06-20"], seats:50, booked:21, level:"Beginner", description:"Build full-stack web apps with Django. Deploy your first project by end of day 2." },
  { id:3, title:"Embedded Systems & IoT", category:"Electronics", duration:"3 days, 6 hrs/day", instructor:"Dr. Priya Nair", available:["2026-05-20","2026-06-10"], seats:40, booked:38, level:"Advanced", description:"From microcontrollers to connected devices — wire, code and publish sensor data to the cloud." },
  { id:4, title:"CFD with OpenFOAM", category:"Mechanical Engineering", duration:"4 days, 8 hrs/day", instructor:"Prof. Aditya Kulkarni", available:["2026-06-05","2026-06-25"], seats:35, booked:12, level:"Advanced", description:"Solve fluid dynamics problems with open-source HPC tools. Covers meshing and post-processing." },
  { id:5, title:"VLSI Design Fundamentals", category:"Electrical Engineering", duration:"2 days, 7 hrs/day", instructor:"Dr. Kavitha Iyer", available:["2026-05-28","2026-06-18"], seats:45, booked:30, level:"Intermediate", description:"Digital IC design from RTL to GDSII using industry-standard EDA tools and FPGA prototyping." },
  { id:6, title:"Bioinformatics with R", category:"Biosciences", duration:"2 days, 8 hrs/day", instructor:"Dr. Sneha Reddy", available:["2026-06-12","2026-07-02"], seats:30, booked:8, level:"Beginner", description:"Analyze genomic data, visualize expression profiles and run differential gene expression pipelines." },
];

const DEPARTMENTS = ["All","Computer Science","Information Technology","Electronics","Mechanical Engineering","Electrical Engineering","Biosciences"];

const LEVEL_BADGE = {
  Beginner:     SUCCESS,
  Intermediate: WARN,
  Advanced:     DANGER,
};

const MOCK_USER = {
  name:"Rahul Verma", email:"rahul.verma@iitb.ac.in",
  institute:"IIT Bombay", department:"Computer Science", position:"Coordinator",
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"long",year:"numeric"});

function Badge({ label, bg }) {
  return (
    <span style={{display:"inline-block",fontSize:11,fontWeight:600,color:"#fff",background:bg,borderRadius:4,padding:"2px 8px"}}>
      {label}
    </span>
  );
}

function SeatBar({ booked, seats }) {
  const pct   = Math.round((booked/seats)*100);
  const color = pct>=90 ? DANGER : pct>=70 ? WARN : SUCCESS;
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <small style={{color:MUTED}}>{booked}/{seats} enrolled</small>
        <small style={{color,fontWeight:600}}>{seats-booked} seats left</small>
      </div>
      <div style={{height:6,background:"#e9ecef",borderRadius:99,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:color,borderRadius:99,transition:"width .4s"}}/>
      </div>
    </div>
  );
}

function WorkshopCard({ w, onBook }) {
  const full = w.booked >= w.seats;
  return (
    <div
      style={{background:"#fff",border:"1px solid #dee2e6",borderRadius:6,display:"flex",flexDirection:"column",overflow:"hidden",transition:"box-shadow .2s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,.12)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
    >
      <div style={{height:4,background:ACCENT}}/>
      <div style={{padding:"16px 18px",flex:1,display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <h6 style={{margin:0,fontSize:15,fontWeight:700,color:"#212529",lineHeight:1.3}}>{w.title}</h6>
          <Badge label={w.level} bg={LEVEL_BADGE[w.level]}/>
        </div>
        <div><Badge label={w.category} bg={MUTED}/></div>
        <p style={{margin:0,fontSize:13,color:MUTED,lineHeight:1.55,flex:1}}>{w.description}</p>
        <div style={{fontSize:13,color:"#495057"}}>
          <div style={{marginBottom:3}}><strong>Instructor:</strong> {w.instructor}</div>
          <div><strong>Duration:</strong> {w.duration}</div>
        </div>
        <SeatBar booked={w.booked} seats={w.seats}/>
        <button
          onClick={()=>!full&&onBook(w)}
          disabled={full}
          style={{padding:"8px 0",width:"100%",border:"none",borderRadius:4,background:full?"#6c757d":ACCENT,color:"#fff",fontWeight:600,fontSize:14,cursor:full?"not-allowed":"pointer"}}
          onMouseEnter={e=>{if(!full)e.currentTarget.style.opacity=".85"}}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}
        >
          {full ? "Fully Booked" : "Book Workshop"}
        </button>
      </div>
    </div>
  );
}

function BookingModal({ w, user, onClose, onConfirm }) {
  const [step,setStep]   = useState(1);
  const [date,setDate]   = useState("");
  const [conds,setConds] = useState({c1:false,c2:false,c3:false});
  if (!w) return null;
  const allOk = conds.c1&&conds.c2&&conds.c3&&date;
  const CONDITIONS = [
    {key:"c1",text:"We assure to give minimum 50 participants for the workshop."},
    {key:"c2",text:"We agree that this booking won't be cancelled without 2 days prior notice to the instructor and FOSSEE."},
    {key:"c3",text:"This proposal is subject to FOSSEE and instructor approval."},
  ];
  const Btn = ({label,bg,onClick,disabled=false,style={}}) => (
    <button
      onClick={onClick} disabled={disabled}
      style={{flex:1,padding:"9px 0",border:"none",borderRadius:4,background:disabled?"#adb5bd":bg,color:"#fff",fontWeight:600,fontSize:14,cursor:disabled?"not-allowed":"pointer",...style}}
    >{label}</button>
  );
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1050,padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:6,width:"100%",maxWidth:500,boxShadow:"0 8px 40px rgba(0,0,0,.25)",overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:BRAND,padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"rgba(255,255,255,.65)",fontSize:12,marginBottom:2}}>Book Workshop</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{w.title}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        {/* Step tabs */}
        <div style={{display:"flex",borderBottom:"1px solid #dee2e6"}}>
          {["Your Info","Pick Date","Confirm"].map((label,i)=>{
            const active=step===i+1, done=step>i+1;
            return (
              <div key={label} style={{flex:1,padding:"10px 0",textAlign:"center",fontSize:12,fontWeight:600,color:active?ACCENT:done?SUCCESS:MUTED,borderBottom:active?`2px solid ${ACCENT}`:"2px solid transparent",background:active?"#f0f7ff":"#fff"}}>
                {done?"✓ ":`${i+1}. `}{label}
              </div>
            );
          })}
        </div>
        <div style={{padding:"20px 22px"}}>
          {step===1&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Review your registration details before continuing.</p>
              <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:16}}>
                {[["Full Name",user.name],["Email",user.email],["Institute",user.institute],["Department",user.department],["Role",user.position]].map(([k,v])=>(
                  <tr key={k} style={{borderBottom:"1px solid #f1f3f5"}}>
                    <td style={{padding:"8px 0",color:MUTED,width:"38%"}}>{k}</td>
                    <td style={{padding:"8px 0",fontWeight:600,color:"#212529"}}>{v}</td>
                  </tr>
                ))}
              </table>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <Btn label="Next →" bg={ACCENT} onClick={()=>setStep(2)}/>
              </div>
            </div>
          )}
          {step===2&&(
            <div>
              <p style={{margin:"0 0 14px",fontSize:13,color:MUTED}}>Select your preferred workshop date.</p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
                {w.available.map(d=>(
                  <label key={d} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:4,cursor:"pointer",border:`1px solid ${date===d?ACCENT:"#dee2e6"}`,background:date===d?"#f0f7ff":"#fff",transition:"all .15s"}}>
                    <input type="radio" name="date" value={d} checked={date===d} onChange={()=>setDate(d)} style={{accentColor:ACCENT}}/>
                    <span style={{fontSize:13,fontWeight:date===d?600:400,color:"#212529"}}>{fmtDate(d)}</span>
                  </label>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6c757d" onClick={()=>setStep(1)}/>
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
                  <span style={{fontSize:13,color:"#212529",lineHeight:1.5}}>{text}</span>
                </label>
              ))}
              <div style={{background:"#f8f9fa",border:"1px solid #dee2e6",borderRadius:4,padding:"10px 14px",marginBottom:16,fontSize:13}}>
                <div style={{color:MUTED,marginBottom:2}}>Selected date</div>
                <div style={{fontWeight:700,color:"#212529"}}>{fmtDate(date)}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn label="← Back" bg="#6c757d" onClick={()=>setStep(2)}/>
                <Btn label="Confirm Booking" bg={SUCCESS} onClick={()=>allOk&&onConfirm(w,date)} disabled={!allOk}/>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SuccessAlert({ booking, onDismiss }) {
  if (!booking) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100,padding:16}}>
      <div style={{background:"#fff",borderRadius:6,maxWidth:420,width:"100%",boxShadow:"0 8px 40px rgba(0,0,0,.25)",overflow:"hidden"}}>
        <div style={{background:SUCCESS,padding:"14px 20px",color:"#fff",fontWeight:700,fontSize:16}}>Booking Submitted!</div>
        <div style={{padding:"20px 22px"}}>
          <p style={{margin:"0 0 14px",fontSize:13,color:"#212529"}}>Your request is submitted and pending instructor/FOSSEE approval.</p>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse",marginBottom:18}}>
            {[["Workshop",booking.workshop.title],["Instructor",booking.workshop.instructor],["Date",fmtDate(booking.date)],["Status","Pending Approval"]].map(([k,v])=>(
              <tr key={k} style={{borderBottom:"1px solid #f1f3f5"}}>
                <td style={{padding:"7px 0",color:MUTED,width:"38%"}}>{k}</td>
                <td style={{padding:"7px 0",fontWeight:600,color:"#212529"}}>{v}</td>
              </tr>
            ))}
          </table>
          <button onClick={onDismiss} style={{width:"100%",padding:"9px",border:"none",borderRadius:4,background:SUCCESS,color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

function MyBookingsPage({ bookings }) {
  if (bookings.length===0) return (
    <div style={{textAlign:"center",padding:"60px 20px"}}>
      <div style={{fontSize:48,marginBottom:16}}>📋</div>
      <h5 style={{color:"#212529"}}>No bookings yet</h5>
      <p style={{color:MUTED,fontSize:14}}>Browse workshops and make your first booking.</p>
    </div>
  );
  return (
    <div>
      <h5 style={{margin:"0 0 18px",fontWeight:700,color:"#212529"}}>My Bookings</h5>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {bookings.map((b,i)=>(
          <div key={i} style={{background:"#fff",border:"1px solid #dee2e6",borderRadius:6,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,borderRadius:6,background:"#f0f7ff",border:`2px solid ${ACCENT}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:ACCENT,fontSize:13,flexShrink:0}}>
              {b.workshop.title.slice(0,2).toUpperCase()}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:14,color:"#212529",marginBottom:2}}>{b.workshop.title}</div>
              <div style={{fontSize:12,color:MUTED}}>{b.workshop.instructor} · {fmtDate(b.date)}</div>
            </div>
            <Badge label="Pending Approval" bg={WARN}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [page,setPage]         = useState("workshops");
  const [filter,setFilter]     = useState("All");
  const [search,setSearch]     = useState("");
  const [booking,setBooking]   = useState(null);
  const [success,setSuccess]   = useState(null);
  const [bookings,setBookings] = useState([]);
  const user = MOCK_USER;

  const filtered = WORKSHOPS.filter(w =>
    (filter==="All"||w.category===filter) &&
    (w.title.toLowerCase().includes(search.toLowerCase())||w.instructor.toLowerCase().includes(search.toLowerCase()))
  );

  const handleConfirm = (w,date) => {
    setBookings(b=>[...b,{workshop:w,date}]);
    setBooking(null);
    setSuccess({workshop:w,date});
  };

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",background:"#f8f9fa",minHeight:"100vh"}}>
      {/* Navbar */}
      <nav style={{background:BRAND,position:"fixed",top:0,left:0,right:0,zIndex:999,boxShadow:"0 2px 4px rgba(0,0,0,.3)"}}>
        <div style={{maxWidth:1140,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",height:56,gap:8}}>
          <a href="#" onClick={e=>{e.preventDefault();setPage("workshops");}} style={{color:"#fff",fontWeight:700,fontSize:18,textDecoration:"none",marginRight:16,whiteSpace:"nowrap"}}>
            FOSSEE Workshops
          </a>
          {[{key:"workshops",label:"Workshops"},{key:"my-bookings",label:`My Bookings${bookings.length>0?` (${bookings.length})`:""}`}].map(({key,label})=>(
            <button key={key} onClick={()=>setPage(key)} style={{background:"none",border:"none",cursor:"pointer",color:page===key?"#fff":"rgba(255,255,255,.65)",fontWeight:page===key?600:400,fontSize:14,padding:"6px 12px",borderRadius:4,borderBottom:page===key?`2px solid ${ACCENT}`:"2px solid transparent"}}>
              {label}
            </button>
          ))}
          <div style={{flex:1}}/>
          <div style={{background:"rgba(255,255,255,.12)",border:"1px solid rgba(255,255,255,.2)",borderRadius:20,padding:"5px 12px",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:ACCENT,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>
              {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <span style={{color:"#fff",fontSize:13,fontWeight:500}}>{user.name.split(" ")[0]}</span>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1140,margin:"0 auto",padding:"72px 16px 40px"}}>
        {page==="workshops"&&(
          <div>
            <div style={{marginBottom:20}}>
              <h4 style={{margin:"0 0 4px",fontWeight:700,color:"#212529"}}>Available Workshops</h4>
              <p style={{margin:0,fontSize:14,color:MUTED}}>Browse and book from our upcoming FOSSEE workshops</p>
            </div>
            {/* Filter bar */}
            <div style={{background:"#fff",border:"1px solid #dee2e6",borderRadius:6,padding:"12px 16px",marginBottom:20,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
              <input
                type="text" placeholder="Search workshops or instructors..."
                value={search} onChange={e=>setSearch(e.target.value)}
                style={{flex:"1 1 200px",padding:"7px 12px",border:"1px solid #ced4da",borderRadius:4,fontSize:13,outline:"none"}}
              />
              <select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"7px 12px",border:"1px solid #ced4da",borderRadius:4,fontSize:13,background:"#fff",color:"#212529",cursor:"pointer"}}>
                {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>
              <span style={{fontSize:13,color:MUTED,whiteSpace:"nowrap"}}>{filtered.length} workshop{filtered.length!==1?"s":""}</span>
            </div>
            {filtered.length===0
              ? <div style={{textAlign:"center",padding:"48px 0",color:MUTED,fontSize:14}}>No workshops match your search.</div>
              : <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
                  {filtered.map(w=><WorkshopCard key={w.id} w={w} onBook={setBooking}/>)}
                </div>
            }
          </div>
        )}
        {page==="my-bookings"&&<MyBookingsPage bookings={bookings}/>}
      </div>

      {booking&&<BookingModal w={booking} user={user} onClose={()=>setBooking(null)} onConfirm={handleConfirm}/>}
      {success&&<SuccessAlert booking={success} onDismiss={()=>setSuccess(null)}/>}
    </div>
  );
}
