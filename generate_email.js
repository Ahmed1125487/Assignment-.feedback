
const fs = require('fs');
const path = require('path');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getScoreStyle(score) {
  const safeScore = Number(score) || 0;

  if (safeScore <= 4) {
    return { color: '#e53935', bg: '#fdecea', label: 'red' };
  } else if (safeScore <= 6) {
    return { color: '#f9a825', bg: '#fff8e1', label: 'yellow' };
  } else {
    return { color: '#0fae66', bg: '#e7f8ef', label: 'green' };
  }
}

function generateEmail({ studentName, subject, score, feedback, mentorName, whatsappNumber }) {
  const maxScore = 10;
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), maxScore);
  const percent = Math.round((safeScore / maxScore) * 100);
  const style = getScoreStyle(safeScore);

  const feedbackHtml = Array.isArray(feedback) && feedback.length
    ? feedback.map(f => `<li style="margin-bottom:6px;">${escapeHtml(f)}</li>`).join('')
    : null;

  const templatePath = path.join(__dirname, 'feedback_email_template.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  const html = template
    .replace(/{{STUDENT_NAME}}/g, escapeHtml(studentName || 'Student'))
    .replace(/{{SUBJECT}}/g, escapeHtml(subject || 'Assignment Feedback'))
    .replace(/{{SCORE}}/g, safeScore)
    .replace(/{{MAX_SCORE}}/g, maxScore)
    .replace(/{{PERCENT}}/g, percent)
    .replace(/{{SCORE_COLOR}}/g, style.color)
    .replace(/{{SCORE_BG}}/g, style.bg)
    .replace(/{{PROGRESS_WIDTH}}/g, percent)
    .replace(/{{FEEDBACK_BLOCK}}/g, feedbackHtml
      ? `<ul style="text-align:left; font-size:13px; color:#555555; padding-left:20px;">${feedbackHtml}</ul>`
      : '<p style="font-size:13px; color:#999999; text-align:center; margin:20px 0;">No specific feedback points for this submission.</p>')
    .replace(/{{MENTOR_NAME}}/g, escapeHtml(mentorName || 'Mentor'))
    .replace(/{{WHATSAPP_NUMBER}}/g, escapeHtml((whatsappNumber || '').toString().replace(/\D/g, '')));

  return html;
}

// ---- مثال استخدام ----
const html = generateEmail({
  studentName: 'AHMED ATEF',
  subject: 'Misr Travel',
  score: 10,
  feedback: ['Strong effort and steady progress.', 'Keep practicing with more consistency.'],
  mentorName: 'AHMED ATEF',
  whatsappNumber: '01116902048'
});

const outputPath = path.join(__dirname, 'feedback_email.html');
fs.writeFileSync(outputPath, html);
console.log('Email generated:', path.basename(outputPath));
