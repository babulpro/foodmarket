import nodemailer from "nodemailer";
export async function sendEmail(emailTo,Text,Subject) {
    let transport = nodemailer.createTransport({
        host:"mail.teamrabbil.com",
        port:25,
        secure:false,
        auth:{
            user:"info@teamrabbil.com",
            pass:"~sR4[bhC[Qs"
        },
        tls:{
            rejectUnauthorized:false
        }
    })
    let mailOption={
        from:"nextjs <info@teamrabbil.com>",
        to:emailTo,
        subject:Subject,
        text:Text
    }
    return await transport.sendMail(mailOption)
    
}