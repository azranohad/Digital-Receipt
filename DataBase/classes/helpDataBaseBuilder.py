import csv
import glob, os


def clean_name(line_with_name):
    ret = line_with_name.replace('"', '')
    ret = ret.replace(',', '')
    return ret


def searchObjectInTxt(file, str_object):
    lines = file.read().splitlines()
    for line in lines:
        index = line.find(str_object)
        if index != -1:
            s = line[index + len(str_object):]
            return s

def create_csv_from_list(file_name, output_path, list):
   file_name = file_name + '.csv'
   file_name = output_path + '\\' + file_name
   f = open(file_name, 'w', newline='', encoding='utf-8')
   writer = csv.writer(f)
   for item in list:
       row = [str(item)]
       writer.writerow(row)
   f.close()

def out_to_csv_by_object_from_txt_file_in_directory(directory_path, name_of_object, output_file_name, output_path):
    path = directory_path
    os.chdir(path)
    shop_list = []
    for file in glob.glob("*.txt"):
        path_file = path + '\\' + file
        file = open(path_file, 'r')
        name_of_company = searchObjectInTxt(file, name_of_object)
        name_of_company = clean_name(name_of_company)
        if name_of_company not in shop_list:
            shop_list.append(name_of_company)
    create_csv_from_list(output_file_name, output_path, shop_list, )

if __name__ == '__main__':

    path = r"C:\Users\azran\PycharmProjects\DataBaseDigitalReceipt\DataBaseReceiptImages\0325updated.task2train(626p)"
    output_path = r"/DataBase"
    out_to_csv_by_object_from_txt_file_in_directory(path, ": ", "shop_list", output_path)