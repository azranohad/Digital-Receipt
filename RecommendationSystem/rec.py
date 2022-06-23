import pandas as pd
from tqdm import tqdm
from sklearn.cluster import KMeans
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import date
from datetime import datetime
import numpy as np
import time
import os
import csv



class LearningRecommendations:

    def __init__(self):
        self.sub_topitem = {}
        self.user_to_sub_list = {}
        self.sub_ids_list = []

    def learn(self, data):
        today = date.today()
        # dd/mm/YY
        d1 = today.strftime("%d/%m/%Y")
        x = d1.split("/")
        day = x[0]
        month = x[1]
        year = x[2]

        R = []
        for i in tqdm(range(len(data))):
            x = data.date[i].split(" ")[0]
            try:
                x = datetime.strptime(x, '%Y-%m-%d')
            except:
                x = datetime.strptime(x, '%d/%m/%Y')
            x = x.strftime("%d/%m/%Y")
            c = x.split("/")
            f_date = date(int(year), int(month), int(day))
            l_date = date(int(c[2]), int(c[1]), int(c[0]))
            delta = f_date - l_date
            R.append(delta.days)
        data["R"] = R

        RFM_score = []
        for i in tqdm(range(len(data))):
            RFM_score.append(self.score(data.R[i], data.amount[i], data.price[i]))
        data["RFM_score"] = RFM_score

        temp_main = data
        temp = data[["RFM_score"]]

        t = temp.fillna(0)
        kmeans = KMeans(n_clusters=3, random_state=0)
        kmeans.fit(t)

        labels = kmeans.labels_
        temp_main["label"] = labels

        # sns.lmplot('age','RFM_score',data=temp_main,fit_reg=False,hue="label",scatter_kws={"marker":"D","s":10})
        # plt.xlabel('age')
        # plt.ylabel('RFM_score')
        # plt.show()

        # segmenting 3 different dataframes wrt the labels
        class0 = temp_main[temp_main["label"] == 0]
        class1 = temp_main[temp_main["label"] == 1]
        class2 = temp_main[temp_main["label"] == 2]

        temp_0 = class0[["gender", "age"]]
        temp_1 = class1[["gender", "age"]]
        temp_2 = class2[["gender", "age"]]

        chk_0 = self.convert(temp_0).values
        chk_1 = self.convert(temp_1).values
        chk_2 = self.convert(temp_2).values

        kmeans0 = KMeans(n_clusters=2, random_state=0).fit(chk_0)
        kmeans1 = KMeans(n_clusters=2, random_state=0).fit(chk_1)
        kmeans2 = KMeans(n_clusters=2, random_state=0).fit(chk_2)

        class0["label"] = kmeans0.labels_
        class1["label"] = kmeans1.labels_
        class2["label"] = kmeans2.labels_

        # segmentaion under class0 clusters into furthur segment
        sub_0a = class0[class0["label"] == 0]
        sub_0b = class0[class0["label"] == 1]
        # segmentaion under class1 clusters into furthur segment
        sub_1a = class1[class1["label"] == 0]
        sub_1b = class1[class1["label"] == 1]
        # segmentaion under class2 clusters into furthur segment
        sub_2a = class2[class2["label"] == 0]
        sub_2b = class2[class2["label"] == 1]

        sub_cluster = ['sub_0a', 'sub_0b',
                       'sub_1a', 'sub_1b',
                       'sub_2a', 'sub_2b']

        sub_cluster_variable = [sub_0a, sub_0b,
                                sub_1a, sub_1b,
                                sub_2a, sub_2b]

        hold = []
        self.sub_topitem = {}
        for i in tqdm(range(len(sub_cluster))):
            item, count = self.topitem(sub_cluster_variable[i])
            self.sub_topitem[sub_cluster[i]] = item
            hold.append(count)


        x = data.user_key.unique()
        ids_0a = sub_0a.user_key.unique()
        ids_0b = sub_0b.user_key.unique()
        ids_1a = sub_1a.user_key.unique()
        ids_1b = sub_1b.user_key.unique()
        ids_2a = sub_2a.user_key.unique()
        ids_2b = sub_2b.user_key.unique()
        self.sub_ids_list = [ids_0a, ids_0b, ids_1a, ids_1b, ids_2a, ids_2b]

        self.user_to_sub_list = {i: [] for i in x}
        print(self.user_to_sub_list)

        for i in x:
            if (i in ids_0a):
                self.user_to_sub_list[i].append('sub_0a')
            if (i in ids_0b):
                self.user_to_sub_list[i].append('sub_0b')
            if (i in ids_1a):
                self.user_to_sub_list[i].append('sub_1a')
            if (i in ids_1b):
                self.user_to_sub_list[i].append('sub_1b')
            if (i in ids_2a):
                self.user_to_sub_list[i].append('sub_2a')
            if (i in ids_2b):
                self.user_to_sub_list[i].append('sub_2b')
        print(self.user_to_sub_list)

        # return sub_topitem, sub_ids_list, user_to_sub_list

    def score(self, r, f, m):
        # return (-r + 100 * f - m)
        return (r - 60 * f + 3 * m)

    def convert(self, df):
        gender = {"male": 0, "female": 1}
        temp = df["gender"].map(gender)
        df['gender'] = temp
        return df

    def topitem(self, df):
        # PId = list(sub_0a.productId.unique())
        PId = list(df.itemID.unique())
        print("PIdddd")
        print(PId)
        store = {}
        for i in tqdm(range(len(PId))):
            store[PId[i]] = df[df['itemID'] == PId[i]].amount.sum()

        max_value = max(store.values()) * 0.9
        # top_item = [key for key in store.keys() if store[key]==max_value]
        top_item = [key for key in store.keys() if store[key] >= max_value]
        # name = []
        # for p in top_item:
        #     name.append(df[df['itemID'] == p].itemDescription.values[0])
        return (top_item, max_value)
        # return (name, max_value)


class Recommender:

    def __init__(self):
        self.users = {}
        self.sub_topitem = {}
        self.sub_ids_list = {}
        self.user_to_sub_list = {}
        self.stores_name = []

    def get_store_name(self, store):
        return store.split("$")[1]

    def rec(self, iddd, sub_topitem, user_to_sub_list, sub_ids_list2, users_first_store):
        print("**********************")
        recommendation_list = []
        try:
            sub = user_to_sub_list[iddd]
            for valOfClass in sub:
                print(valOfClass)
                print(sub_topitem[valOfClass])
                recommendation_list += sub_topitem[valOfClass]
        except:
            recommendation_list = self.similar_user_or_cold_rec(iddd, sub_topitem, user_to_sub_list, sub_ids_list2,
                                                               users_first_store)
        recommendation_list = list(dict.fromkeys(recommendation_list))
        return recommendation_list

    def similar_user_or_cold_rec(self, iddd, sub_topitem, user_to_sub_list, sub_ids_list2,
                                 users_first_store):
        recommendation_list = []
        try:
            # get the similar user (same sub-class with this user) from other store
            similar_users = []
            for sub_id in sub_ids_list2:
                if iddd in sub_id:
                    f = sub_id.tolist()
                    similar_users += f
            similar_users = list(dict.fromkeys(similar_users))

            # only those in the first store
            for user in similar_users:
                if user not in users_first_store:
                    similar_users.remove(user)

            # add the sub-classes that the similar users are in
            sub_list_similsr_users = []
            for user in similar_users:
                sub_list_similsr_users += user_to_sub_list[user]

            # search for the sub-class that has the most similar users
            res = {}
            for i in sub_list_similsr_users:
                res[i] = sub_list_similsr_users.count(i)
            print(res)

            max_sub = max(res, key=res.get)
            print("Maximum value:", max_sub)

            # recommend the recommendations of that sub-class
            print(sub_topitem[max_sub])
            recommendation_list += sub_topitem[max_sub]
        except:
            reccomenderItems = []
            for sub in sub_topitem:
                reccomenderItems.append(sub_topitem[sub][0])
                recommendation_list.append(sub_topitem[sub][0])
            print(reccomenderItems)

        return recommendation_list

    def learn(self, file_of_stores, users):
        dir_path = os.path.abspath(os.getcwd())
        name_of_stores = [self.get_store_name(i) for i in file_of_stores]
        for store in name_of_stores:
            file_name = store + '.csv'  ##########################
            data = pd.read_csv(file_name, encoding="ISO-8859-8")
            # data = pd.read_csv(store, encoding="ISO-8859-8")
            self.users[store] = data['user_key']
            recommender = LearningRecommendations()
            recommender.learn(data)
            self.sub_topitem[store], self.sub_ids_list[store], self.user_to_sub_list[
                store] = recommender.sub_topitem, recommender.sub_ids_list, recommender.user_to_sub_list

        for store in name_of_stores:
            dir_path = os.path.dirname(os.path.abspath(__file__))

            file_name = store + '_recommendation.csv'
            rec_path = os.path.join(dir_path, file_name)
            f = open(rec_path, 'w',newline="\n")
            writer = csv.writer(f)
            second_store = []
            second_store += name_of_stores
            second_store.remove(store)
            for user in users:
                # writer.writerow([user, ['a', 'c']])
                rec = self.rec_to_id(user, store, second_store)
                writer.writerow([user, rec])

            f.close()

    def rec_to_id(self, id, store, stores_list):
        # user_id_to_rec = "fd18ed355cd74ae38799f76dc7d20609"  # == id 1
        # user_id_to_rec = "db81c708bb6d44ae91f870e7e8fc60ef"  # == id 2
        # user_id_to_rec = 0 # 3

        for s in stores_list:
            try:
                r = self.rec(id, self.sub_topitem[store], self.user_to_sub_list[store], self.sub_ids_list[s],
                             self.users[store])
                return r
            except:
                pass

    def store_recommendation(self, user, store_name):
        dir_path = os.path.dirname(os.path.abspath(__file__))
        file_name = store_name + '_recommendation.csv'
        path = os.path.join(dir_path, file_name)
        print(path)
        f = open(path)
        reader = csv.reader(f)
        for row in reader:
            if (row[0] == user):
                print(row[1])
                return self.clear_items(row[1])

    def general_recommendation(self, user, stores_list):
        rec = []
        for store in stores_list:
            rec += self.store_recommendation(user, store)
        return rec

    def clear_items(self, row):
        tmp = list(row.split(","))
        tmp2 = [i.replace("\'", "") for i in tmp]
        tmp3 = [i.replace("[", "") for i in tmp2]
        tmp4 = [i.replace("]", "") for i in tmp3]
        tmp_list = [i.replace(" ", "") for i in tmp4]
        return tmp_list



if __name__ == "__main__":
    # repository_mongo = recommendationSystemRepository()
    # repository_mongo.get_all_receipt_by_market() # [('a.csv', 'b.csv'] 12_06_2020$super_pharm$jgcjghg.csv
    x = Recommender()
    # x.learn() #['a.csv', ]
    # x.rec_to_id(0, 'wolmart')
    x.store_recommendation('fd18ed355cd74ae38799f76dc7d20609', 'super-pharm')

    # data = pd.read_csv('super-pharm.csv', encoding="ISO-8859-8")
    # users = list(data.user_key.unique())
    # x.learn(['1$walmart$1.csv', 'f$super-pharm$f.csv'], users)

