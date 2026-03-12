
# Python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# Ojitos369
from ojitos369.utils import printwln as pln

from core.conf.settings import MYE, ce, prod_mode, email_settings

class BaseMail:
    def __init__(self, **kwargs):
        DEFAULT_RECEIVER_EMAIL = email_settings.get('receiver', 'ojitos369@gmail.com')
        self.to_email = [DEFAULT_RECEIVER_EMAIL]
        self.bcc_email = []

        for k, v in kwargs.items():
            setattr(self, k, v)

        if type(self.to_email) == str:
            self.to_email = [self.to_email]
        if type(self.bcc_email) == str:
            self.bcc_email = [self.bcc_email]

        self.smtp_server = email_settings.get('smtp_server')
        self.port = email_settings.get('port')
        self.sender_email = email_settings.get('sender')
        self.sender_password = email_settings.get('password')


class EmailSend(BaseMail):
    def send(self):
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = self.email_subject
            msg["From"] = self.sender_email
            msg["To"] = ", ".join(self.to_email) if not prod_mode else "ojitos369@gmail.com"
            if self.bcc_email and prod_mode:
                msg["Bcc"] = ", ".join(self.bcc_email)

            part1 = MIMEText(self.email_html, "html")
            msg.attach(part1)

            if hasattr(self, 'file_names'):
                for file_name, mime_type in self.file_names:
                    with open(f'{self.rute_file}/{file_name}', 'rb') as f:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-Disposition', f'attachment; filename="{file_name}"')
                        msg.attach(part)

            with smtplib.SMTP_SSL(self.smtp_server, self.port) as server:
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, self.to_email + self.bcc_email, msg.as_string())
            return True
        except Exception as e:
            ce.show_error(e, extra="Error sending HTML email")
            return False


class EmailTextSend(BaseMail):
    def send(self):
        try:
            msg = MIMEMultipart()
            msg["Subject"] = self.email_subject
            msg["From"] = self.sender_email
            msg["To"] = ", ".join(self.to_email)
            if self.bcc_email:
                msg["Bcc"] = ", ".join(self.bcc_email)

            msg.attach(MIMEText(self.email_text, "plain"))

            if hasattr(self, 'file_names'):
                for file_name, mime_type in self.file_names:
                    with open(f'{self.rute_file}/{file_name}', 'rb') as f:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(f.read())
                        encoders.encode_base64(part)
                        part.add_header('Content-Disposition', f'attachment; filename="{file_name}"')
                        msg.attach(part)

            with smtplib.SMTP_SSL(self.smtp_server, self.port) as server:
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, self.to_email + self.bcc_email, msg.as_string())
            return True
        except Exception as e:
            ce.show_error(e, extra="Error sending plain text email")
            return False

