import inspect
from datetime import datetime

from singleton_decorator import singleton


@singleton
class loggerService:
    def print_event(self, event):
        stack = inspect.stack()
        the_class = stack[1][0].f_locals["self"].__class__.__name__
        # the_method = stack[1][0].f_code.co_name
        time = str(datetime.now().strftime('%d/%m/%Y %H:%M:%S'))
        print(time + "| class: " + the_class + " |EVENT: " + event)
