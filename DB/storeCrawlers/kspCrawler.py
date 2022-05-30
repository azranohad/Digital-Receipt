import urllib

from bs4 import BeautifulSoup
import requests
from selenium.webdriver.firefox import webdriver
from spyder_kernels.utils.lazymodules import bs4


def get_all_links_from_url(url):
    reqs = requests.get(url)
    soup = BeautifulSoup(reqs.text, 'html.parser')
    mydivs = soup.findAll("div", {"class": "stylelistrow"})
    urls = []
    for link in soup.find_all('a'):
        urls.append(link.get('href'))
    return urls

import requests
from bs4 import BeautifulSoup as bs
from urllib.parse import urljoin

# URL of the web page you want to extract
url = "https://ksp.co.il/web/cat/7560..7564"

# initialize a session & set User-Agent as a regular browser
session = requests.Session()
session.headers["User-Agent"] = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"

# get the HTML content
html = session.get(url).content

# parse HTML using beautiful soup
soup = bs(html, "html.parser")
print(soup)

get_all_links_from_url("https://ksp.co.il/web/cat/7560..7564")