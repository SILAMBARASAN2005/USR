const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const port = Number(process.env.PORT) || 3001;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

async function sendEmail({ to, subject, message }) {
  const smtpPort = Number(process.env.MAIL_PORT) || 587;
  const smtpUser = process.env.MAIL_USER?.trim();
  const smtpPassword = process.env.MAIL_PASSWORD?.replace(/\s/g, '');
  const smtpFrom = process.env.MAIL_FROM?.trim();

  if (!smtpUser || smtpUser === 'your-email@gmail.com' || !smtpPassword || smtpPassword.length !== 16) {
    throw new Error('SMTP configuration error: use a real Gmail address and its 16-character app password in .env');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST?.trim(),
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPassword
    },
    tls: {
      rejectUnauthorized: false // For development/testing
    }
  });

  // Verify SMTP connection on first use
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP verification failed:', error.message);
    throw new Error('SMTP configuration error: ' + error.message);
  }

  await transporter.sendMail({
    from: smtpFrom,
    to,
    subject,
    text: message,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #1a3a5c; border-bottom: 3px solid #c9972b; padding-bottom: 10px;">New Contact Form Submission</h2>
        <div style="line-height: 1.8; color: #333;">
          ${message.split('\n').map(line => {
            if (line.startsWith('Name:') || line.startsWith('Phone:') || line.startsWith('Email:') || 
                line.startsWith('Project Type:') || line.startsWith('Estimated Budget:')) {
              return `<p style="margin: 10px 0;"><strong>${line}</strong></p>`;
            } else if (line === 'Project Details:') {
              return `<h3 style="color: #1a3a5c; margin-top: 20px;">${line}</h3>`;
            } else if (line === '') {
              return '<br>';
            } else {
              return `<p style="margin: 5px 0;">${line}</p>`;
            }
          }).join('')}
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #888; font-size: 12px; text-align: center;">Sent from USR Builders Website Contact Form</p>
      </div>
    </div>`
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'POST' && requestUrl.pathname === '/api/send-email') {
    try {
      const body = await readRequestBody(req);
      const { name, phone, email, service, budget, message } = body;
      const to = process.env.MAIL_TO || process.env.MAIL_FROM || 'your-email@gmail.com';

      if (!name || !phone || !service || !message) {
        return sendJson(res, 400, { message: 'Missing required form fields' });
      }

      if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASSWORD || !process.env.MAIL_FROM) {
        return sendJson(res, 500, { message: 'SMTP configuration is missing' });
      }

      const emailBody = [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email || 'Not provided'}`,
        `Project Type: ${service}`,
        `Estimated Budget: ${budget || 'Not specified'}`,
        '',
        'Project Details:',
        message
      ].join('\n');

      await sendEmail({
        to,
        subject: `New project inquiry from ${name}`,
        message: emailBody
      });

      console.log(`✅ Email sent successfully to ${to}`);
      console.log(`   From: ${name} (${phone})`);
      console.log(`   Project: ${service}\n`);

      return sendJson(res, 200, { message: 'Email sent successfully' });
    } catch (error) {
      console.error('❌ Email send failed:', error.message);
      console.error('   Error details:', error);
      
      let errorMessage = 'Failed to send email';
      
      // Provide more specific error messages
      if (error.message.includes('Invalid login') || error.code === 'EAUTH' || error.responseCode === 535) {
        errorMessage = 'Email authentication failed. Please check your email credentials.';
      } else if (error.message.includes('SMTP configuration error')) {
        errorMessage = 'SMTP configuration error. Please check your email settings.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to email server. Please check your network connection.';
      } else if (error.message.includes('ETIMEDOUT')) {
        errorMessage = 'Connection timeout. Please try again later.';
      }
      
      return sendJson(res, 500, { message: errorMessage, details: error.message });
    }
  }

  let filePath = requestUrl.pathname === '/' ? path.join(rootDir, 'index.html') : path.join(rootDir, requestUrl.pathname);

  if (!filePath.startsWith(rootDir)) {
    return sendJson(res, 403, { message: 'Forbidden' });
  }

  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🏗️  USR Builders Website Server');
  console.log('='.repeat(50));
  console.log(`\n✅ Server running at http://localhost:${port}`);
  console.log(`\n📧 SMTP Configuration:`);
  console.log(`   Host: ${process.env.MAIL_HOST || '❌ NOT SET'}`);
  console.log(`   Port: ${process.env.MAIL_PORT || '❌ NOT SET'}`);
  console.log(`   User: ${process.env.MAIL_USER || '❌ NOT SET'}`);
  console.log(`   From: ${process.env.MAIL_FROM || '❌ NOT SET'}`);
  console.log(`   To: ${process.env.MAIL_TO || '❌ NOT SET'}`);
  
  if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASSWORD) {
    console.log(`\n⚠️  WARNING: SMTP is not fully configured!`);
    console.log(`   Please configure .env file with your SMTP settings.`);
    console.log(`   See README.md or SMTP_SETUP_GUIDE.md for instructions.\n`);
  } else {
    console.log(`\n✅ SMTP appears to be configured`);
    console.log(`   Email notifications will be sent to: ${process.env.MAIL_TO || process.env.MAIL_FROM}\n`);
  }
  
  console.log('='.repeat(50) + '\n');
});
