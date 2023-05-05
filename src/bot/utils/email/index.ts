import nodemailer from "nodemailer";
interface sendEmail {
    to: string[];
    subject: string;
    body: string;
  }
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
  });

  async function handleWebhook(data: sendEmail) {
    const mailOptions = {
      from: '',
      to: data.to.join(','),
      subject: data.subject,
      html: data.body,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email enviado com sucesso:', info.response);
    } catch (error) {
      console.error('Ocorreu um erro ao enviar o email:', error);
    }
  }
