import nodemailer from 'nodemailer';

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'muhtasim.fahim.98@gmail.com',
    pass: 'gabtkcycuexppgqv'
  }
});

var mailOptions = {
  from: 'unknown',
  to: 'mdmuhtasim.fahim@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});