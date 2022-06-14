import os

from singleton_decorator import singleton
from twilio.rest import Client


# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
#password Laos147258369147
from SystemFiles.logger.loggerService import loggerService

sid = 'AC61671c64fea797d29e4abb199b5611b5'
token = '75d70369ec1ce7036f60c6cb0c33c3fa'

@singleton
class smsService:
    def __init__(self):
        self.client = Client(sid, token)
        self.logger = loggerService()

    def send_message(self, phone, message_body):
        phone_num_area = '+972'+phone
        message = self.client.messages.create(
            body=message_body,
            from_='+19706140426',
            to=phone_num_area
        )
        log_message = 'send message to: ' + phone + ' message sid: ' + str(message.sid)
        self.logger.print_info_message(log_message)

    def send_temp_password_login(self, phone, password):
        message_body = 'Use verification code ' + password + ' for login to Digital recipe app'
        self.send_message(phone, message_body)


# message = client.messages.create(
#                               body='Hello there!',
#                               from_='+19706140426',
#                               media_url=['https://demo.twilio.com/owl.png'],
#                               to='+9720528332154'
#                           )
#
# print(message.sid)




# import email, smtplib, ssl
# from providers import PROVIDERS
#
#
#
# def send_sms_via_email(
#     number: str,
#     message: str,
#     provider: str,
#     sender_credentials: tuple,
#     subject: str = "sent using etext",
#     smtp_server: str = "smtp.gmail.com",
#     smtp_port: int = 465,
# ):
#     sender_email, email_password = sender_credentials
#     receiver_email = f'{number}@{PROVIDERS.get(provider).get("sms")}'
#
#     email_message = f"Subject:{subject}\nTo:{receiver_email}\n{message}"
#
#     with smtplib.SMTP_SSL(
#         smtp_server, smtp_port, context=ssl.create_default_context()
#     ) as email:
#         email.login(sender_email, email_password)
#         email.sendmail(sender_email, receiver_email, email_message)
#
# number = "0528332154"
# message = "hello world!"
# provider = "Spikko"
#
# sender_credentials = ("digitalrece@gmail.com", "Laos147258")
#
# send_sms_via_email(number, message, provider, sender_credentials)