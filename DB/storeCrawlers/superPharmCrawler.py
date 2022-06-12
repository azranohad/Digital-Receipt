from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import re
import requests
from sympy import false

items_all = {}
urls_frontier = set()
urls_cl = set()


def get_all_links_from_url(url):
    reqs = requests.get(url)
    soup = BeautifulSoup(reqs.text, 'html.parser')

    urls = []
    for link in soup.find_all('a'):
        urls.append(link.get('href'))
    return urls


def parse_item_details(item):
    item = item.replace('\n', '')
    item = item.replace('"', '')
    item = item.replace('\'', '')
    details = item.split(',')
    details = details[:-1]
    item_dict = {}
    for detail in details:
        split = detail.split(':')
        key = split[0].replace(' ', '')
        item_dict[key] = split[1]

    return item_dict


def split_item_area(str_items):
    items_string_array = str_items.split('{')
    items_string_array = items_string_array[1:]
    count_items = 0
    for item in items_string_array:
        try:
            split_right = item.split('}')
            item_details = parse_item_details(split_right[0])
            if not items_all.__contains__(item_details['id']):
                items_all[item_details['id']] = item_details
                count_items += 1
        except Exception as e:
            print(e)
    return count_items


def get_all_items_from_url_super_pharm(url):
    source_page = ''
    try:
        source_page = requests.get(url).text
    except Exception as e:
        print(e)
        print(url)

    split_start_items_area = source_page.split("additionalImpressions = [")
    if len(split_start_items_area) == 0:
        return false

    split_start_items_area = split_start_items_area[1:]

    for area in split_start_items_area:
        item_area = area.split(']')
        try:
            return split_item_area(item_area[0])
        except Exception as e:
            print(e)


def get_data_from_link(url):

    try:
        urls_son = get_all_links_from_url(url)
    except Exception as e:
        print(e)
    for url_son in urls_son:
        try:
            if "https://shop.super-pharm.co.il" not in url_son:
                url_son = url+url_son
        except Exception as e:
            print(e)
            print("url+url_son failed. url son = " + str(url_son))
        if url_son not in urls_cl:
            urls_frontier.add(url_son)
            get_all_items_from_url_super_pharm(url_son)

def crawler(url):

    get_data_from_link(url)
    i = 0
    while len(urls_frontier) != 0:
        export_items_to_csv("items" + str(i) + ".csv")
        url_next = urls_frontier.pop()
        urls_cl.add(url_next)
        get_data_from_link(url_next)
        i += 1

def export_items_to_csv(file_name):
    f = open(file_name, 'w', encoding="utf16", newline='')
    import csv
    writer = csv.writer(f)
    header = ['name', 'id', 'price', 'brand', 'category', 'list', 'position']
    writer.writerow(header)
    for item in items_all.values():
        try:
            row = [str(item['name']), item['id'], item['price'], item['brand'], item['category'], item['list'],  item['position']]
            writer.writerow(row)
        except Exception as e:
            print(e)
    f.close()


crawler("https://shop.super-pharm.co.il")

