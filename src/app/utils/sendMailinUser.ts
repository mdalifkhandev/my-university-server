import nodemailer from 'nodemailer'
import config from '../config'


export const sendEmail=async (email:string,htmlData:any)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_NEW==='production', // Use `true` for port 465, `false` for all other ports
        auth: {
          user: "mdalifk2002@gmail.com",
          pass: "hqug jfff iikr awnc",
        },
      })


       await transporter.sendMail({
          from: 'mdalifk2002@gmail.com', // sender address
          to: email, // list of receivers
          subject: "Password Change", // Subject line
          text: "Your Password Change link is this", // plain text body
          html: htmlData, // html body
        })
      
       
      
      
      
      
}