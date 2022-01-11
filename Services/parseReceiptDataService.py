import datetime
from collections import namedtuple
import pytesseract as pts
from fuzzywuzzy import fuzz
import re
import fnmatch

from DataObjects.receiptData import itemObject

STOPWORDS = ['summe', 'visa', 'mwst', 'brutto', 'netto', 'zahlen']


class parseReceiptDataService():

    def parse_date(self, raw_string, lines):

        for fmt in ['%d/%m/%Y', '%b %d %Y', '%d %b %Y', '%d/%m/%y', '%d.%m.%y', '%Y-%m-%d', '%d.%m.%y %H:%M', '%d.%m.%Y', '%Y/%m/%d']:
            for substr in raw_string.split(' '):
                try:
                    new_purch_date = datetime.datetime.strptime(substr, fmt).strftime('%d/%m/%Y')
                    return new_purch_date
                except Exception as e:
                    pass

        lines = raw_string.splitlines()



        return None

    def create_list_of_markets(self):
        market_dict = {}
        market_file = open(r"C:\Users\azran\PycharmProjects\Digital-Receipt\DB\shop_list.csv", 'r')
        for line in market_file:
            name_of_market = []
            name_of_market.append(line)
            name_of_market.append(line.lower())
            market_dict[line] = name_of_market
        return market_dict


    def search_market_in_line(self, accuracy, line):
        market_dict = self.create_list_of_markets()
        for market in market_dict:
            for nickname in market_dict[market]:
                if fuzz.token_sort_ratio(line, nickname) >= accuracy:
                    return market

        return None

    def parse_market(self, lines):
        """
        :return: str
            Parses market data
        """
        for int_accuracy in range(10, 6, -1):
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
                if fuzz.partial_ratio(pre_word.lower(), line) >= 90:
                    words = re.split(', | : | - | ;', line)

                    for i in range(len(words)):
                        if fuzz.partial_ratio(pre_word.lower(), words[i]) >= 90:
                            if (i+1) < len(words):
                                return words[i+1]
        return None


    def parse_items(self, test_str):
        #item_list = []
        amout_num = None
        debug = False
        max_height = 5
        #test_str = pts.image_to_data(page, config=r'-l eng --oem 3 --psm 6')
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
                            if 'total' in line_value.lower() :
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
                                #continue
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
                        if block_top + max_height*height > top:
                            if debug:
                                print('Appending ' + str(suggestion))
                            line_value += ' ' + suggestion
                        else:
                            if debug:
                                print(line_value + ' gets replaced by ' + suggestion)
                            line_value = suggestion
                            block_top = top
            if is_valid:
                valid_top = min(valid_top, round(block_top-height))
                valid_bot = max(valid_bot, round(top+2*height))
                valid_r = max(valid_r, round(left+1.5*width))
                valid_l = min(valid_l, left-width)
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
        return items, total_price#, (0, 0, page.size[0], valid_bot)


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


