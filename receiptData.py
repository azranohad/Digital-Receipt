from collections import namedtuple
from difflib import get_close_matches
from enum import Enum

import dateutil.parser
from scipy.spatial.distance import hamming
import re
import datefinder
import fnmatch


class ReceiptData():
    def __init__(self, config, raw):
        self.buyerID = None
        self.company = None
        self.date = None
        self.address = None
        self.itemsList = []
        self.total_price = None
        self.methodOfPayment = methodsOfPayment
        self.CreditCardID = None
        self.receiptID = None
        self.lines = raw
        self.config = config

    def create_receipt_data_from_text(text):
        lines = text.splitlines()
        a = 'ohadddddddd'
        b = 'ohadddd'
        result = hamming(a, b) * len(a)
        x = 3

    def normalize(self):
        """
        :return: void
            1) strip empty lines
            2) convert to lowercase
            3) encoding?
        """
        self.lines = [
            line.lower() for line in self.lines if line.strip()
        ]

    def parse_date(self):
        """
        :return: date
            Parses data
        """

        for line in self.lines:
            match = list(datefinder.find_dates(line))
            date_str = ''
            if len(match) > 0:  # We"re happy with the first match for now
                # validate date using the dateutil library (see: https://dateutil.readthedocs.io/)
                for date in match:
                    date_str = date.date()
                    # date_str = match.group(1)
                # date_str = date_str.replace(" ", "")
                # try:
                #     dateutil.parser.parse(date_str)
                # except ValueError:
                #     return None

        return date_str
    def fuzzy_find(self, keyword, accuracy=0.6):
        """
        :param keyword: str
            The keyword string to look for
        :param accuracy: float
            Required accuracy for a match of a string with the keyword
        :return: str
            Returns the first line in lines that contains a keyword.
            It runs a fuzzy match if 0 < accuracy < 1.0
        """

        for line in self.lines:
            words = line.split()
            # Get the single best match in line
            matches = get_close_matches(keyword, words, 1, accuracy)
            if matches:
                return line

    def parse_market(self):
        """
        :return: str
            Parses market data
        """

        for int_accuracy in range(10, 6, -1):
            accuracy = int_accuracy / 10.0

            min_accuracy, market_match = -1, None
            for market, spellings in self.config.markets.items():
                for spelling in spellings:
                    line = self.fuzzy_find(spelling, accuracy)
                    if line and (accuracy < min_accuracy or min_accuracy == -1):
                        min_accuracy = accuracy
                        market_match = market
                        return market_match

        return market_match


    def parse_items(self):
        items = []
        item = namedtuple("item", ("article", "sum"))

        ignored_words = self.config.ignore_keys
        stop_words = self.config.sum_keys

        if self.company == "Metro":
            item_format = self.config.item_format_metro
        else:
            item_format = self.config.item_format

        for line in self.lines:
            parse_stop = None
            for ignore_word in ignored_words:
                parse_stop = fnmatch.fnmatch(line, f"*{ignore_word}*")
                if parse_stop:
                    break

            if parse_stop:
                continue

            if self.company != "Metro":
                for stop_word in stop_words:
                    if fnmatch.fnmatch(line, f"*{stop_word}*"):
                        return items

            match = re.search(item_format, line)
            if hasattr(match, 'group'):
                article_name = match.group(1)

                if match.group(2) == "-":
                    article_sum = "-" + match.group(3).replace(",", ".")
                else:
                    article_sum = match.group(3).replace(",", ".")
            else:
                continue

            items.append(item(article_name, article_sum))

        return items
class itemObject():
    def __init__(self, itemID, itemDescription, amount, price):
        self.itemID = itemID
        self.itemDescription = itemDescription
        self.amount = amount
        self.price = price

class methodsOfPayment(Enum):
    CASH = 1
    CREDIT_CARD = 2
