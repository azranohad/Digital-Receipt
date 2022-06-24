from Server.Repositories.creditRepository import creditRepository
from SystemFiles.logger.loggerService import loggerService
from datetime import timedelta
from datetime import datetime

class creditService:
    def __init__(self):
        self.credit_repository = creditRepository()
        self.logger = loggerService()


    def exist_expired_credit(self, user_key):
        today = datetime.today().strftime('%d/%m/%Y')
        end_date = (datetime.today() + timedelta(days=30)).strftime('%d/%m/%Y')

        credits_future_expiration_date = self.credit_repository.get_by_date(user_key, today, end_date)
        exist_credit_future_expiration_date = (len(credits_future_expiration_date) > 0)
        return str(exist_credit_future_expiration_date)

user_key = '33310727751848c19a8877140d3ce3ac'

repo = creditService()
repo.exist_expired_credit(user_key)