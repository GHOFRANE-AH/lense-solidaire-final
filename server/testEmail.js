const nodemailer = require('nodemailer');

(async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const info = await transporter.sendMail({
    from: '"Lense Solidaire" <no-reply@lense.com>',
    to: 'ghofranehed820@gmail.com',
    subject: 'Test OTP',
    text: 'Voici un code de test : 123456'
  });

  console.log('✅ Email envoyé');
  console.log('📬 URL de visualisation :', nodemailer.getTestMessageUrl(info));
})();
