const nodemailer = require("nodemailer");


const sendEmail=(email,subject,text)=>{
    
    try{
 
        nodemailer.createTransport({
            service: 'gmail',
			auth: {
                user:process.env.USERMAIL,
				pass:process.env.PASS,
			},
            port: 465,
            host:'smtp.gmail.com',
        })
        .sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text,
        });
        console.log("Email sent successfully");

    }
    catch(err){
        console.log(err);
        return err;
    }
}

module.exports=sendEmail;