import inspect
from datetime import datetime
from singleton_decorator import singleton

stack = inspect.stack()


@singleton
class loggerService:

    def print(self, message_to_print):
        print(message_to_print)

    def print_event(self, event):
        try:
            the_class = stack[1][0].f_locals["self"].__class__.__name__
            time = str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
            str_to_print = time + "| class: " + the_class + " |EVENT: " + event
            self.print(str_to_print)
        except:
            self.print("failed print EVENT: " + event)


    def print_api_message(self, event):
        try:
            the_method = stack[1][0].f_code.co_name
            time = str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
            str_to_print = time + "| method: " + the_method + " |API MESSAGE: " + event
            self.print(str_to_print)
        except:
            self.print("failed print API MESSAGE: " + event)


    def print_info_message(self, info_message):
        try:
            the_method = stack[1][0].f_code.co_name
            time = str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
            str_to_print = time + "| method: " + the_method + " |INFO MESSAGE: " + info_message
            self.print(str_to_print)
        except:
            self.print("failed print INFO MESSAGE: " + info_message)

    def print_except_message(self, except_message):
        try:
            time = str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
            str_to_print = time + " |EXCEPT MESSAGE: " + except_message
            self.print(str_to_print)
        except:
            self.print("failed print EXCEPT MESSAGE: " + except_message)