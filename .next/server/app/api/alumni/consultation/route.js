"use strict";(()=>{var e={};e.id=365,e.ids=[365],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4770:e=>{e.exports=require("crypto")},665:e=>{e.exports=require("dns")},7702:e=>{e.exports=require("events")},2048:e=>{e.exports=require("fs")},2615:e=>{e.exports=require("http")},2694:e=>{e.exports=require("http2")},8216:e=>{e.exports=require("net")},9801:e=>{e.exports=require("os")},5315:e=>{e.exports=require("path")},5816:e=>{e.exports=require("process")},6162:e=>{e.exports=require("stream")},2452:e=>{e.exports=require("tls")},7360:e=>{e.exports=require("url")},1764:e=>{e.exports=require("util")},1568:e=>{e.exports=require("zlib")},9972:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>y,patchFetch:()=>f,requestAsyncStorage:()=>m,routeModule:()=>g,serverHooks:()=>h,staticGenerationAsyncStorage:()=>x});var o={};r.r(o),r.d(o,{GET:()=>c,POST:()=>u});var i=r(9303),n=r(8716),s=r(670),a=r(7070),l=r(9419),d=r(8629);!function(){var e=Error("Cannot find module 'brevo'");throw e.code="MODULE_NOT_FOUND",e}();let p=Object(function(){var e=Error("Cannot find module 'brevo'");throw e.code="MODULE_NOT_FOUND",e}())();async function u(e){try{let{alumniId:t,studentName:r,studentEmail:o,studentContact:i,researchTitle:n,researchDescription:s,consultationNeeds:u,expectedDuration:c,senderName:g}=await e.json();if(!t||!r||!o||!n||!u)return a.NextResponse.json({error:"Missing required fields"},{status:400});if(!process.env.BREVO_API_KEY)return a.NextResponse.json({error:"Email service not configured. Please set BREVO_API_KEY in environment variables."},{status:500});let m=(0,d.JU)(l.db,"alumni",t),x=await (0,d.QT)(m);if(!x.exists())return a.NextResponse.json({error:"Alumni not found"},{status:404});let h=x.data();if(!h.email||""===h.email.trim())return a.NextResponse.json({error:"Alumni email not found. Please update alumni record with an email address."},{status:400});let y=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <header style="background: linear-gradient(135deg, #B23B3B, #8B2E2E); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Research Consultation Request</h1>
          <p style="margin: 10px 0 0; font-size: 14px;">Alumni Expert Consultation Program</p>
        </header>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Dear <strong>${h.name}</strong>,
          </p>
          
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            We hope this message finds you well. We are reaching out to invite you to serve as a consultant for one of our students' research projects. Your expertise in <strong>${h.collegeCourse}</strong> and experience as a <strong>${h.currentOccupation}</strong> makes you an ideal candidate to guide and mentor our student researcher.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B23B3B;">
            <h3 style="color: #B23B3B; margin-top: 0;">Research Project Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Research Title:</td>
                <td style="padding: 8px 0; color: #333;">${n}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Student Researcher:</td>
                <td style="padding: 8px 0; color: #333;">${r}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Duration:</td>
                <td style="padding: 8px 0; color: #333;">${c||"To be discussed"}</td>
              </tr>
            </table>
          </div>
          
          ${s?`
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #B23B3B; margin-top: 0;">Research Description</h4>
            <p style="color: #555; line-height: 1.6; margin: 0;">${s}</p>
          </div>
          `:""}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #B23B3B; margin-top: 0;">What We Need From You</h4>
            <p style="color: #555; line-height: 1.6; margin: 0;">${u}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF7F27;">
            <h4 style="color: #FF7F27; margin-top: 0;">Student Contact Information</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Name:</td>
                <td style="padding: 8px 0; color: #333;">${r}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 8px 0; color: #333;"><a href="mailto:${o}" style="color: #B23B3B;">${o}</a></td>
              </tr>
              ${i?`
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Contact:</td>
                <td style="padding: 8px 0; color: #333;">${i}</td>
              </tr>
              `:""}
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #555; margin-bottom: 20px;">
              If you are interested in participating in this research consultation, please contact the student directly using the information provided above.
            </p>
            <div style="background: #e8f5e8; border: 1px solid #4CAF50; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #2e7d32; font-weight: bold;">
                📧 Simply reply to this email or reach out directly to ${r} at ${o}
              </p>
            </div>
          </div>
          
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Your participation would be invaluable in helping our student conduct meaningful research and develop their academic and professional skills. We appreciate your continued connection to our institution and your willingness to support the next generation of researchers.
          </p>
          
          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            Best regards,<br>
            <strong>${g||"School Registrar"}</strong><br>
            <em>Alumni Relations & Research Coordination</em>
          </p>
        </div>
        
        <footer style="background: #333; color: white; padding: 15px; border-radius: 0 0 10px 10px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This email was sent as part of our Alumni Expert Consultation Program</p>
          <p style="margin: 5px 0 0;">\xa9 2026 Alumni Tracking System</p>
        </footer>
      </div>
    `;try{await p.sendTransacEmail({to:[{email:h.email}],sender:{name:"Alumni Research",email:"noreply@alumni.scihi.com"},subject:`Research Consultation Request - ${n}`,htmlContent:y})}catch(e){return console.error("Error sending email via Brevo:",e),a.NextResponse.json({error:"Failed to send consultation request email",details:e.message||"Unknown error"},{status:500})}return await (0,d.ET)((0,d.hJ)(l.db,"consultationRequests"),{alumniId:t,alumniName:h.name,alumniEmail:h.email,studentName:r,studentEmail:o,studentContact:i||"",researchTitle:n,researchDescription:s||"",consultationNeeds:u,expectedDuration:c||"",senderName:g||"School Registrar",sentAt:d.EK.now(),status:"sent"}),a.NextResponse.json({success:!0,message:`Consultation request sent successfully to ${h.name} at ${h.email}`})}catch(t){console.error("Error sending consultation request:",t);let e="Failed to send consultation request";return t.message?.includes("configuration missing")&&(e="Email service not configured. Please contact administrator."),a.NextResponse.json({error:e,details:t.message},{status:500})}}async function c(e){try{let{searchParams:t}=new URL(e.url),r=t.get("alumniId"),o=(0,d.hJ)(l.db,"consultationRequests");try{let e;if(r){let t=(0,d.IO)(o,(0,d.ar)("alumniId","==",r),(0,d.Xo)("sentAt","desc"));e=await (0,d.PL)(t)}else{let t=(0,d.IO)(o,(0,d.Xo)("sentAt","desc"));e=await (0,d.PL)(t)}let t=e.docs.map(e=>({id:e.id,...e.data()}));return a.NextResponse.json(t)}catch(e){if("not-found"===e.code||e.message?.includes("does not exist"))return console.log("Consultation requests collection not found, returning empty array"),a.NextResponse.json([]);throw e}}catch(e){return console.error("Error fetching consultation requests:",e),a.NextResponse.json({error:"Failed to fetch consultation requests",details:e.message},{status:500})}}process.env.BREVO_API_KEY&&p.setApiKey(Object(function(){var e=Error("Cannot find module 'brevo'");throw e.code="MODULE_NOT_FOUND",e}()).apiKey,process.env.BREVO_API_KEY);let g=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/alumni/consultation/route",pathname:"/api/alumni/consultation",filename:"route",bundlePath:"app/api/alumni/consultation/route"},resolvedPagePath:"C:\\Users\\adestajo\\Desktop\\REPO\\New folder\\Alumni Tracking Website\\src\\app\\api\\alumni\\consultation\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:m,staticGenerationAsyncStorage:x,serverHooks:h}=g,y="/api/alumni/consultation/route";function f(){return(0,s.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:x})}},9419:(e,t,r)=>{let o;r.d(t,{db:()=>a});var i=r(9362),n=r(8629);let s={apiKey:"AIzaSyAm0MdHaVr6cVA147cwMQiCL7wvpB1c1Ho",authDomain:"scihi-alumni-tracking.firebaseapp.com",projectId:"scihi-alumni-tracking",storageBucket:"scihi-alumni-tracking.firebasestorage.app",messagingSenderId:"776095020338",appId:"1:776095020338:web:77e44b70e46d77203e932b"};try{(function(){let e=["apiKey","authDomain","projectId","appId"].filter(e=>!s[e]);if(e.length>0)throw console.error("❌ Firebase configuration is incomplete. Missing:",e),console.error("Make sure you have a .env.local file with all NEXT_PUBLIC_FIREBASE_* variables"),Error(`Firebase configuration missing: ${e.join(", ")}`)})(),o=0===(0,i.C6)().length?(0,i.ZF)(s):(0,i.Mq)(),console.log("✅ Firebase initialized successfully for project:",s.projectId)}catch(e){throw console.error("❌ Firebase initialization failed:",e),e}let a=(0,n.ad)(o)}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,532],()=>r(9972));module.exports=o})();