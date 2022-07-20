import datetime
from datetime import datetime as datatime1

import dateutil
from fuzzywuzzy import fuzz
import re
from dateutil.parser import parse
from singleton_decorator import singleton

from Server.DataObjects.receiptDataObject import itemObject
from Server.serverConsts import serverConsts

STOPWORDS = ['summe', 'visa', 'mwst', 'brutto', 'netto', 'zahlen']

server_consts = serverConsts()

@singleton
class parseReceiptDataService:
    def __init__(self):
        self.market_dict = self.create_list_of_markets()
    def is_date(self, string, fuzzy=False):
        """
        Return whether the string can be interpreted as a date.

        :param string: str, string to check for date
        :param fuzzy: bool, ignore unknown tokens in string if True
        """
        if string is None or len(string) > 12:
            return False
        try:
            parse(string, fuzzy=fuzzy)
            return True

        except ValueError:
            return False
    def date_three_words(self, date_string):
        for fmt in ['%d %b %Y', '%d %b %y', '%b %d %Y', '%b %d %y', '%Y %b %d', '%y %b %d', '%Y %d %b', '%y %d %b']:
            try:
                new_purch_date = datetime.datetime.strptime(date_string, fmt).strftime('%d/%m/%Y')
                return new_purch_date
            except Exception as e:
                pass
    def date_two_words(self, date_string):
        for fmt in ['%b %Y', '%b %y', '%y %b', '%Y %b']:
            try:
                new_purch_date = datetime.datetime.strptime(date_string, fmt).strftime('%m/%Y')
                return new_purch_date
            except Exception as e:
                pass

        for fmt in ['%d %b', '%b %d']:
            try:
                new_purch_date = datetime.datetime.strptime(date_string, fmt).strftime('%d/%m')
                return new_purch_date
            except Exception as e:
                pass

    #unit test to check the
    def is_month(self, month):
        if 1 <= int(month) <= 12:
            return True
        return False
    def is_year(self, year):
        if 2000 <= int(year) <= datetime.date.today().year:
            return True
        return False
    def is_day(self, day):
        if 1 <= int(day) <= 31:
            return True
        return False

    def parse_date(self, raw_string_receipt):
        raw_string = raw_string_receipt.replace('\n', " ")
        new_purch_date = ''
        count_continuity = 0
        for iteration, fmt in enumerate(['%d/%m/%Y', '%d/%m/%y', '%d.%m.%y', '%d-%m-%y', '%d-%m-%Y', '%d.%m.%Y', '%Y/%m/%d','%d%m%Y']):
            for substr in raw_string.split(' '):
                try:
                    new_purch_date = datetime.datetime.strptime(substr, fmt).strftime('%d/%m/%Y')
                    date_split = new_purch_date.split('/')
                    if self.is_day(date_split[0]) and self.is_month(date_split[1]) and self.is_year(date_split[2]):
                        return new_purch_date
                    else:
                        continue
                except Exception as e:
                    pass


                if iteration == 0:
                    if self.is_date(substr):
                        if count_continuity == 0:
                            new_purch_date = substr
                        else:
                            new_purch_date = new_purch_date + ' ' + substr

                        count_continuity += 1
                        if count_continuity == 3:
                            date_parse = self.date_three_words(new_purch_date)
                            if self.is_date(date_parse):
                                date_split = date_parse.split('/')
                                if self.is_day(date_split[0]) and self.is_month(date_split[1]) and self.is_year(date_split[2]):
                                    return date_parse
                    else:
                        if count_continuity == 2:
                            date_parse = self.date_three_words(new_purch_date)
                            if self.is_date(date_parse):
                                return date_parse

                        count_continuity = 0
                        new_purch_date = ''
        return None

    def create_list_of_markets(self):
        import os
        current_path = os.getcwd()
        path = current_path[:current_path.find("Digital-Receipt") + 16] + "DB\shop_list.csv"
        market_dict = {}
        market_file = open(path, 'r')
        for line in market_file:
            name_of_market = []
            name_of_market.append(line)
            name_of_market.append(line.lower())
            market_dict[line] = name_of_market
        return market_dict


    def search_market_in_line(self, accuracy, line):
        for market in self.market_dict:
            for nickname in  self.market_dict[market]:
                if fuzz.token_sort_ratio(line, nickname) >= accuracy:
                    return market
        return None

    def parse_market(self, lines):
        """
        :return: str
            Parses market data
        """
        for int_accuracy in range(10, 4, -1):
            accuracy = int_accuracy * 10.0
            for line in lines:
                market = self.search_market_in_line(accuracy, line)
                if market is not None:
                    market = market.replace('\n', "")
                    return market
        return None

    def parse_receipt_id(self, lines):
        word_pre_id = ['Document No', 'Doc No', 'Cash Bill', 'INOVICE NO', 'Receipt#', 'INV#', 'Inv:', 'BILL NO', 'C/N No', 'Inovice number',
                       'Receipt No', 'Order No', 'INV NO', 'Tax Inovice']
        for pre_word in word_pre_id:
            for line in lines:
                if fuzz.partial_ratio(pre_word.lower(), line) >= 75:
                    words = re.split(', |:|-|; ', line)

                    for i in range(len(words)):
                        if fuzz.partial_ratio(pre_word.lower(), words[i]) >= 75:
                            if (i+1) < len(words):
                                return words[i+1]
        return None

    def parse_items(self, test_str, market_name):
        if market_name == 'PAPPARICH BMC':
            return self.parse_items_papparich(test_str)
        elif market_name == 'YIN MA (M) SDN.BHD':
            return self.parse_items_YinMa(test_str)
        else:
            return self.parse_items_papparich(test_str)

    def parse_items_papparich(self, test_str):
        # item_list = []
        amout_num = None
        debug = False
        max_height = 5
        # test_str = pts.image_to_data(page, config=r'-l eng --oem 3 --psm 6')
        lines = test_str.split('\n')
        items = []
        total_price = 0
        price_position = 0
        line_value = ''
        line_number = 0
        block_top = 0
        block_left = 0
        valid_top = 999999
        valid_bot = 0
        valid_r = 0
        valid_l = 999999
        is_done = False
        for line in lines[1:]:
            is_valid = False
            tokens = line.split('\t')
            if not tokens[-1]:
                continue
            line_num = int(tokens[4])
            word_num = tokens[5]
            left = int(tokens[6])
            top = int(tokens[7])
            width = int(tokens[8])
            height = int(tokens[9])
            word = self.clean_word(tokens[-1])
            if debug:
                print(word)
            if self.is_number(word.replace(',', '.')):
                new_num = float(word.replace(',', '.'))
                if self.is_decimal(new_num):
                    if self.is_decimal(line_number):
                        if left > price_position:
                            price_position = left
                            if debug:
                                print(str(line_number) + ' gets replaced by ' + str(new_num))
                            line_number = new_num
                            is_valid = True
                    else:
                        line_number = new_num
                        is_valid = True
                # else:
                #    amout_num = new_num

            else:
                # if word.isalpha() and len(word) > self.min_length:
                #     suggestions = self.dict_ger.suggest(word)
                #     if len(suggestions) > 0:
                #         suggestion = suggestions[0]
                #     else:
                #         suggestion = word
                # else:
                suggestion = word
                if suggestion.lower() in STOPWORDS:
                    # print('Stop word ' + suggestion)
                    suggestion = 'grand_total'
                    is_done = True
                    # break
                if line_value == '':
                    line_value = suggestion
                    block_top = top
                else:
                    if line_number > 0:
                        if self.blacklist(line_value):
                            if 'total' in line_value.lower():
                                if 'subtotal' not in line_value.lower() and 'sub-total' not in line_value.lower():
                                    total_price = line_number
                                    break
                                # items.append(
                                #     # {
                                #     # 'label': line_value,
                                #     # 'price': line_number}
                                #     itemObject(line_value, line_number, amout_num, 'total')
                                # )
                            elif 'cash' in line_value.lower():
                                total_price = line_number
                                # continue
                            elif 'srv chg' in line_value.lower():
                                line_value = suggestion
                                line_number = 0
                                block_top = top
                                is_valid = True
                                continue
                            else:
                                items.append(
                                    # {
                                    # 'label': line_value,
                                    # 'price': line_number}
                                    itemObject(line_value, line_number)
                                )
                        line_value = suggestion
                        line_number = 0
                        block_top = top
                        is_valid = True
                    else:
                        if block_top + max_height * height > top:
                            if debug:
                                print('Appending ' + str(suggestion))
                            line_value += ' ' + suggestion
                        else:
                            if debug:
                                print(line_value + ' gets replaced by ' + suggestion)
                            line_value = suggestion
                            block_top = top
            if is_valid:
                valid_top = min(valid_top, round(block_top - height))
                valid_bot = max(valid_bot, round(top + 2 * height))
                valid_r = max(valid_r, round(left + 1.5 * width))
                valid_l = min(valid_l, left - width)
            if is_done:
                if line_number > 0:
                    items.append(
                        # {
                        # 'label': line_value,
                        # 'price': line_number}
                        itemObject(line_value, line_number, amout_num)
                    )
                break
        # the first article is usually rubbish, hence we drop it
        return items, total_price  # , (0, 0, page.size[0], valid_bot)

    def parse_items_YinMa(self, test_str):
        # item_list = []
        amout_num = None
        debug = False
        max_height = 5
        # test_str = pts.image_to_data(page, config=r'-l eng --oem 3 --psm 6')
        lines = test_str.split('\n')
        items = []
        total_price = 0
        price_position = 0
        line_value = ''
        line_number = 0
        block_top = 0
        block_left = 0
        valid_top = 999999
        valid_bot = 0
        valid_r = 0
        valid_l = 999999
        is_done = False
        for line in lines[1:]:
            is_valid = False
            tokens = line.split('\t')
            if not tokens[-1]:
                continue
            line_num = int(tokens[4])
            word_num = tokens[5]
            left = int(tokens[6])
            top = int(tokens[7])
            width = int(tokens[8])
            height = int(tokens[9])
            word = self.clean_word(tokens[-1])
            if debug:
                print(word)
            if self.is_number(word.replace(',', '.')):
                new_num = float(word.replace(',', '.'))
                if self.is_decimal(new_num):
                    if self.is_decimal(line_number):
                        if left > price_position:
                            price_position = left
                            if debug:
                                print(str(line_number) + ' gets replaced by ' + str(new_num))
                            line_number = new_num
                            is_valid = True
                    else:
                        line_number = new_num
                        is_valid = True
                # else:
                #    amout_num = new_num

            else:
                # if word.isalpha() and len(word) > self.min_length:
                #     suggestions = self.dict_ger.suggest(word)
                #     if len(suggestions) > 0:
                #         suggestion = suggestions[0]
                #     else:
                #         suggestion = word
                # else:
                suggestion = word
                if suggestion.lower() in STOPWORDS:
                    # print('Stop word ' + suggestion)
                    suggestion = 'grand_total'
                    is_done = True
                    # break
                if line_value == '':
                    line_value = suggestion
                    block_top = top
                else:
                    if line_number > 0:
                        if self.blacklist(line_value):
                            if 'total' in line_value.lower():
                                total_price = line_number
                                break
                                # items.append(
                                #     # {
                                #     # 'label': line_value,
                                #     # 'price': line_number}
                                #     itemObject(line_value, line_number, amout_num, 'total')
                                # )
                            elif 'cash' in line_value.lower():
                                total_price = line_number
                                # continue
                            else:
                                items.append(
                                    # {
                                    # 'label': line_value,
                                    # 'price': line_number}
                                    itemObject(line_value, line_number)
                                )
                        line_value = suggestion
                        line_number = 0
                        block_top = top
                        is_valid = True
                    else:
                        if block_top + max_height * height > top:
                            if debug:
                                print('Appending ' + str(suggestion))
                            line_value += ' ' + suggestion
                        else:
                            if debug:
                                print(line_value + ' gets replaced by ' + suggestion)
                            line_value = suggestion
                            block_top = top
            if is_valid:
                valid_top = min(valid_top, round(block_top - height))
                valid_bot = max(valid_bot, round(top + 2 * height))
                valid_r = max(valid_r, round(left + 1.5 * width))
                valid_l = min(valid_l, left - width)
            if is_done:
                if line_number > 0:
                    items.append(
                        # {
                        # 'label': line_value,
                        # 'price': line_number}
                        itemObject(line_value, line_number, amout_num)
                    )
                break
        # the first article is usually rubbish, hence we drop it
        return items, total_price  # , (0, 0, page.size[0], valid_bot)


    def is_number(self, in_str):
        try:
            _ = float(in_str)
            return True
        except Exception as e:
            return False

    def is_decimal(self, i_num):
        if round(i_num) != i_num:
            return True
        else:
            return False

    def clean_word(self, word):
        return word.replace('\'', '').replace('*', '').replace('%', '').replace('1LYDE', 'LIDL').replace('(',
                                                                                                         '').replace(
            ')', '').replace('L+DI', 'LIDL')

    def blacklist(self, label):
        if 'steuer-nr' in label.lower():
            return False
        if 'eur*' in label.lower():
            return False
        return True

    def items_to_map(self,  receipt_data_object):
        items = {}
        i = 1
        for item in receipt_data_object.items:
            items[str(i) + ". " + item.itemDescription] = item.price
            i += 1
        return items

    def receipt_data_to_db(self, user_key, image_id, receipt_data_object):
        items = {}
        if len(receipt_data_object.items) != 0:
            items = self.items_to_map(receipt_data_object)
        receipt_dict = {
            server_consts.ID: str(image_id),
            server_consts.USER_KEY: user_key,
            server_consts.SCAN_DATE: dateutil.parser.parse(datatime1.now().strftime('%d/%m/%Y %H:%M:%S')),
            "receiptID": str(receipt_data_object.receiptID),
            server_consts.DATE_OF_RECEIPT: dateutil.parser.parse(receipt_data_object.date_of_receipt),
            server_consts.MARKET: str(receipt_data_object.market),
            "items": items,
            "total_price": float(receipt_data_object.total_price),
            "url_scan_image": receipt_data_object.url_scan_image,
            "is_digital_receipt": False
        }
        return receipt_dict

    def receipt_data_to_app(self, receipt_id, receipt_data_object):
        receipt_dict = {
            server_consts.ID: str(receipt_id),
            "date": str(receipt_data_object.date_of_receipt),
            server_consts.MARKET: str(receipt_data_object.market),
        }
        return receipt_dict
