using System;
using System.Collections.Generic;
using System.Net.Mail;
using System.Net;

namespace errontXServer.Services;

public class EmailServic
{
    public void SendEmail(string toEmail, string body)
    {
        MailAddress fromAddress = new MailAddress("rspo.message@yandex.ru", "ErrantX");
        MailAddress toAddress = new MailAddress(toEmail);
        MailMessage message = new MailMessage(fromAddress, toAddress);
        message.Body = body;
        message.Subject = "Сообщение от ErrantX";

        SmtpClient smtpClient = new SmtpClient();
        smtpClient.Host = "smtp.yandex.ru";
        smtpClient.Port = 587;
        smtpClient.EnableSsl = true;
        smtpClient.DeliveryMethod = SmtpDeliveryMethod.Network;
        smtpClient.UseDefaultCredentials = false;
        smtpClient.Credentials = new NetworkCredential(fromAddress.Address, "uecphcmzhfldkuqm");

        //uecphcmzhfldkuqm пароль приложения
        try
        {
            smtpClient.Send(message);
            Console.WriteLine("Email sent successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending email: {ex.Message}");
        }
    }
}