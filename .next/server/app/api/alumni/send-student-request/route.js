"use strict";(()=>{var e={};e.id=26,e.ids=[26],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},7913:(e,t,o)=>{o.r(t),o.d(t,{originalPathname:()=>x,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>c,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var s={};o.r(s),o.d(s,{OPTIONS:()=>p,POST:()=>d});var r=o(9303),n=o(8716),i=o(670),a=o(7070);let l=process.env.BREVO_API_KEY,u=process.env.BREVO_SENDER_EMAIL;async function d(e){if(console.log("\uD83D\uDCE7 Send Student Request Email - Starting..."),!l)return console.error("❌ BREVO_API_KEY not configured"),a.NextResponse.json({error:"Email service not configured - missing API key"},{status:500});if(!u)return console.error("❌ BREVO_SENDER_EMAIL not configured"),a.NextResponse.json({error:"Email service not configured - missing sender email"},{status:500});try{let{alumniEmail:t,alumniName:o,studentName:s,studentEmail:r,researchTitle:n,consultationNeeds:i}=await e.json();console.log("\uD83D\uDCE7 Send Email - Received data:",{alumniEmail:t?"✓":"✗",alumniName:o?"✓":"✗",studentName:s?"✓":"✗",studentEmail:r?"✓":"✗",researchTitle:n?"✓":"✗",consultationNeeds:i?"✓":"✗"});let d=[];if(t||d.push("alumniEmail"),o||d.push("alumniName"),s||d.push("studentName"),r||d.push("studentEmail"),n||d.push("researchTitle"),i||d.push("consultationNeeds"),d.length>0)return console.error("❌ Missing required fields:",d),a.NextResponse.json({error:"Missing required fields",missingFields:d},{status:400});let p=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #B23B3B; padding-bottom: 20px;">
          <h1 style="color: #B23B3B; margin: 0; font-size: 24px;">Alumni Research Consultation Request</h1>
          <p style="color: #666; margin: 10px 0 0 0;">A student would like your expertise</p>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #FF7F27;">
          <h2 style="color: #B23B3B; margin-top: 0;">Hello ${o},</h2>
          <p style="color: #333; line-height: 1.6; margin: 15px 0;">
            We have a student who believes your expertise would be valuable for their research project and would like to request your consultation.
          </p>
        </div>

        <div style="background-color: #FDF4DD; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 2px solid #FF7F27;">
          <h3 style="color: #B23B3B; margin-top: 0;">Research Project Details</h3>
          
          <div style="margin-bottom: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">Research Title</p>
            <p style="color: #333; margin: 0; font-size: 15px;">${n}</p>
          </div>

          <div style="margin-bottom: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">How Your Expertise is Needed</p>
            <p style="color: #333; margin: 0; font-size: 15px; white-space: pre-wrap;">${i}</p>
          </div>

          <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
            <p style="color: #A03E2D; font-weight: bold; margin: 0 0 5px 0;">Student Contact Information</p>
            <p style="color: #333; margin: 5px 0; font-size: 14px;">
              <strong>Name:</strong> ${s}
            </p>
            <p style="color: #333; margin: 5px 0; font-size: 14px;">
              <strong>Email:</strong> <a href="mailto:${r}" style="color: #B23B3B; text-decoration: none;">${r}</a>
            </p>
          </div>
        </div>

        <div style="background-color: white; padding: 20px; border-radius: 6px; border-left: 4px solid #A03E2D;">
          <h3 style="color: #B23B3B; margin-top: 0;">Next Steps</h3>
          <p style="color: #333; line-height: 1.6;">
            If you're interested in supporting this student's research, please reach out directly to them using the email address above. If you have any questions or concerns, feel free to contact your school registrar.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
          <p style="margin: 5px 0;">This is an automated message from the Alumni Tracking System</p>
          <p style="margin: 5px 0;">\xa9 2024 School Registrar. All rights reserved.</p>
        </div>
      </div>
    `,c=`
Alumni Research Consultation Request

Hello ${o},

We have a student who believes your expertise would be valuable for their research project and would like to request your consultation.

Research Project Details:
- Title: ${n}
- How Your Expertise is Needed: ${i}
- Student Name: ${s}
- Student Email: ${r}

If you're interested in supporting this student's research, please reach out directly to them. If you have any questions, contact your school registrar.

Thank you,
Alumni Tracking System
    `;console.log("\uD83D\uDCE7 Sending email via Brevo API..."),console.log("   From:",u),console.log("   To:",t),console.log("   Subject:",`Research Consultation Request from ${s}: ${n}`);let m={sender:{email:u,name:"School Registrar - Alumni Tracking System"},to:[{email:t,name:o}],replyTo:{email:r,name:s},subject:`Research Consultation Request from ${s}: ${n}`,htmlContent:p,textContent:c};console.log("\uD83D\uDCE7 Email payload prepared, making API call...");let g=await fetch("https://api.brevo.com/v3/smtp/email",{method:"POST",headers:{accept:"application/json","api-key":l,"content-type":"application/json"},body:JSON.stringify(m)}),h=await g.text();if(console.log(`📧 Brevo API Response Status: ${g.status}`),console.log(`📧 Brevo API Response Body: ${h}`),!g.ok){let e;try{e=JSON.parse(h)}catch{e={raw:h}}return console.error("❌ Brevo API Error:",{status:g.status,statusText:g.statusText,error:e}),a.NextResponse.json({error:"Failed to send email to alumni",brevoStatus:g.status,details:e},{status:500})}return console.log("✅ Email sent successfully to:",t),a.NextResponse.json({message:"Email sent to alumni successfully",success:!0})}catch(e){return console.error("❌ Error sending email:",e.message),console.error("   Stack:",e.stack),a.NextResponse.json({error:"Failed to send email",message:e.message},{status:500})}}async function p(e){return new a.NextResponse(null,{status:200,headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}})}let c=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/alumni/send-student-request/route",pathname:"/api/alumni/send-student-request",filename:"route",bundlePath:"app/api/alumni/send-student-request/route"},resolvedPagePath:"C:\\Users\\adestajo\\Desktop\\REPO\\New folder\\Alumni Tracking Website\\src\\app\\api\\alumni\\send-student-request\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=c,x="/api/alumni/send-student-request/route";function y(){return(0,i.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),s=t.X(0,[276,972],()=>o(7913));module.exports=s})();