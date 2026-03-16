const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || 'JanMitraN <onboarding@resend.dev>';

const sectorEmails = {
    garbage: process.env.SECTOR_EMAIL_GARBAGE || '',
    electricity: process.env.SECTOR_EMAIL_ELECTRICITY || '',
    water: process.env.SECTOR_EMAIL_WATER || '',
    roads: process.env.SECTOR_EMAIL_ROADS || '',
    other: process.env.SECTOR_EMAIL_OTHER || '',
};

const sectorNames = {
    garbage: 'Garbage & Sanitation',
    electricity: 'Electricity Supply',
    water: 'Water Supply',
    roads: 'Roads & Infrastructure',
    other: 'General',
};

async function sendComplaintEmail(data) {
    const sectorEmail = sectorEmails[data.sector];

    if (!sectorEmail || !process.env.RESEND_API_KEY) {
        console.warn('[Email] Resend not configured or sector email missing, skipping department email.');
        return null;
    }

    const sectorName = sectorNames[data.sector] || data.sector;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a5f2a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">🏛️ New Civic Complaint — JanMitraN</h2>
        <p style="margin: 5px 0 0; opacity: 0.9;">Department: ${sectorName}</p>
      </div>
      <div style="padding: 20px; background: #f9f9f9; border: 1px solid #ddd;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Complaint ID</td><td style="padding: 8px;">${data.complaintId}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name</td><td style="padding: 8px;">${data.fullName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${data.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Location</td><td style="padding: 8px;">${data.address}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Subject</td><td style="padding: 8px;">${data.subject}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #eee;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px;">Description:</p>
          <p style="margin: 0; color: #333;">${data.description}</p>
        </div>
        ${data.photoUrl ? `
        <div style="margin-top: 16px; padding: 12px; background: white; border-radius: 6px; border: 1px solid #eee; text-align: center;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px; text-align: left;">Attached Evidence:</p>
          <img src="${data.photoUrl}" alt="Complaint Photo Evidence" style="max-width: 100%; border-radius: 4px; border: 1px solid #ddd;" />
        </div>
        ` : ''}
      </div>
      <div style="padding: 12px; background: #eee; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; color: #888;">
        JanMitraN — Citizens Civic Complaint Portal
      </div>
    </div>
  `;

    try {
        const { data: result, error } = await resend.emails.send({
            from: fromEmail,
            to: [sectorEmail],
            subject: `[${data.complaintId}] New Complaint: ${data.subject}`,
            html: htmlContent,
        });

        if (error) {
            console.error('[Email] Resend error (department):', error);
            return null;
        }

        console.log('[Email] Sent to department:', sectorEmail, '| Id:', result.id);
        return result;
    } catch (error) {
        console.error('[Email] Failed to send department email:', error);
        return null;
    }
}

async function sendCitizenConfirmationEmail(data) {
    if (!data.email || !process.env.RESEND_API_KEY) {
        console.warn('[Email] Citizen email or Resend not configured, skipping confirmation.');
        return null;
    }

    const sectorName = sectorNames[data.sector] || data.sector;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a5f2a, #2d8a4e); color: white; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">✅ Complaint Registered Successfully</h2>
        <p style="margin: 8px 0 0; opacity: 0.9;">JanMitraN Civic Complaint Portal</p>
      </div>
      <div style="padding: 24px; background: #f9f9f9; border: 1px solid #ddd;">
        <p style="color: #333; margin: 0 0 16px;">Dear <strong>${data.fullName}</strong>,</p>
        <p style="color: #555; margin: 0 0 20px;">
          Your civic complaint has been successfully registered. Below are the details for your records:
        </p>
        
        <div style="background: #e8f5e9; border: 2px solid #1a5f2a; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 12px; color: #555; margin: 0 0 4px;">Your Complaint ID</p>
          <p style="font-size: 24px; font-weight: bold; color: #1a5f2a; margin: 0; font-family: monospace;">${data.complaintId}</p>
          <p style="font-size: 11px; color: #888; margin: 8px 0 0;">Please save this ID — you'll need it to track your complaint status.</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Department</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${sectorName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555; border-bottom: 1px solid #eee;">Subject</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.subject}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Status</td><td style="padding: 8px;"><span style="background: #fff3e0; color: #e65100; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: bold;">Open</span></td></tr>
        </table>

        <div style="background: #fff; border-radius: 6px; border: 1px solid #eee; padding: 16px; margin-bottom: 16px;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px; font-size: 13px;">What happens next?</p>
          <ol style="margin: 0; padding-left: 20px; color: #666; font-size: 13px; line-height: 1.8;">
            <li>Your complaint will be reviewed by the concerned department within 24 hours.</li>
            <li>You will receive updates as the status of your complaint changes.</li>
            <li>The authorities will take appropriate action to resolve your issue.</li>
          </ol>
        </div>

        ${data.photoUrl ? `
        <div style="background: #fff; border-radius: 6px; border: 1px solid #eee; padding: 16px; margin-bottom: 16px;">
          <p style="font-weight: bold; color: #555; margin: 0 0 8px; font-size: 13px;">Your Attached Evidence:</p>
          <div style="text-align: center;">
            <img src="${data.photoUrl}" alt="Complaint Photo Evidence" style="max-width: 100%; max-height: 300px; border-radius: 4px; border: 1px solid #ddd;" />
          </div>
        </div>
        ` : ''}
      </div>
      <div style="padding: 16px; background: #1a5f2a; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="color: white; font-size: 12px; margin: 0; opacity: 0.8;">
          JanMitraN — Making Your City Better, Together 🌱
        </p>
      </div>
    </div>
  `;

    try {
        const { data: result, error } = await resend.emails.send({
            from: fromEmail,
            to: [data.email],
            subject: `[${data.complaintId}] Your Complaint Has Been Registered — JanMitraN`,
            html: htmlContent,
        });

        if (error) {
            console.error('[Email] Resend error (citizen):', error);
            return null;
        }

        console.log('[Email] Confirmation sent to citizen:', data.email, '| Id:', result.id);
        return result;
    } catch (error) {
        console.error('[Email] Failed to send citizen confirmation:', error);
        return null;
    }
}

module.exports = { sendComplaintEmail, sendCitizenConfirmationEmail };
