import inspect
from datetime import datetime
# from singleton_decorator import singleton

stack = inspect.stack()


# @singleton
class loggerService:

    def get_time(self):
        return str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))


    def print(self, message_to_print):
        print(message_to_print)


    def print_event(self, event):
        str_to_print = self.get_time() + " |EVENT: " + event
        self.print(str_to_print)


    def print_api_message(self, event):
        str_to_print = self.get_time() + " |API MESSAGE: " + event
        self.print(str_to_print)


    def print_info_message(self, info_message):
        str_to_print = self.get_time() + " |INFO MESSAGE: " + info_message
        self.print(str_to_print)

    def print_severe_message(self, severe_message):
        str_to_print = self.get_time() + " |SEVERE MESSAGE: " + severe_message
        self.print(str_to_print)


    def print_except_message(self, except_message):
        str_to_print = self.get_time() + " |EXCEPT MESSAGE: " + except_message
        self.print(str_to_print)
