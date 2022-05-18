
import pandas as pd
from tqdm import tqdm
from sklearn.cluster import KMeans
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
# load data
data = pd.read_csv("Dataset.csv")

print("data.head(4)" + data.head(4))

# add R column - the number of days that have passed since the purchase until today
today = date.today()
# dd/mm/YY
d1 = today.strftime("%d/%m/%Y")
x = d1.split("/")
day= x[0]
month=x[1]
year=x[2]

R=[]
for i in tqdm(range(len(data))):
# for i in range(100):
  c = data.date[i].split("/")
  f_date = date(int(year), int(month), int(day))
  l_date = date(int(c[2]), int(c[1]), int(c[0]))
  delta = f_date - l_date
  R.append(delta.days)


data["R"] = R

print(data.head(5))

# liron - check if need to change
def score(r,f,m):
    return(10*r+f+m)

# add column "RFM score" in the data - liron add F כשיהיה מעמית
RFM_score=[]
for i in tqdm(range(len(data))):
    RFM_score.append(score(data.R[i],data.price[i],data.price[i]))
    # RFM_score.append(score(data.R[i],data.F[i],data.M[i]))

data["RFM_score"] = RFM_score

data.isnull().values.any()

temp_main = data
temp = data[["RFM_score"]]
t = temp.fillna(0)
temp.head(2)

# divide the data into 5 set according to kmeans alg
kmeans = KMeans(n_clusters=5,random_state=0)
kmeans.fit(t)

labels = kmeans.labels_

temp_main["label"] = labels

sns.lmplot('Age','RFM_score',data=temp_main,fit_reg=False,hue="label",scatter_kws={"marker":"D","s":10})
plt.xlabel('AGE')
plt.ylabel('RFM_score')

plt.show()

#segmenting 5 different dataframes wrt the labels
class0 = temp_main[temp_main["label"]==0]
class1 = temp_main[temp_main["label"]==1]
class2 = temp_main[temp_main["label"]==2]
class3 = temp_main[temp_main["label"]==3]
class4 = temp_main[temp_main["label"]==4]

temp_0 = class0[["gender","age"]]
temp_1 = class1[["gender","age"]]
temp_2 = class2[["gender","age"]]
temp_3 = class3[["gender","age"]]
temp_4 = class4[["gender","age"]]

def convert(df):
    gender = {"male":0,"female":1}
    temp = df["Gender"].map(gender)
    df['Gender'] = temp
    return df

chk_0 = convert(temp_0).values
chk_1 = convert(temp_1).values
chk_2 = convert(temp_2).values
chk_3 = convert(temp_3).values
chk_4 = convert(temp_4).values

# divide each set into 3 sub-set by kmeans
kmeans0 = KMeans(n_clusters=3,random_state=0).fit(chk_0)
kmeans1 = KMeans(n_clusters=2,random_state=0).fit(chk_1)
kmeans2 = KMeans(n_clusters=3,random_state=0).fit(chk_2) 
kmeans3 = KMeans(n_clusters=3,random_state=0).fit(chk_3)
kmeans4 = KMeans(n_clusters=1,random_state=0).fit(chk_4)

class0["label"] = kmeans0.labels_
class1["label"] = kmeans1.labels_
class2["label"] = kmeans2.labels_
class3["label"] = kmeans3.labels_
class4["label"] = kmeans4.labels_

#segmentaion under class0 clusters into furthur segment
sub_0a = class0[class0["label"]==0]
sub_0b = class0[class0["label"]==1]
sub_0c = class0[class0["label"]==2]
#segmentaion under class1 clusters into furthur segment
sub_1a = class1[class1["label"]==0]
sub_1b = class1[class1["label"]==1]
sub_1c = class1[class1["label"]==2]
#segmentaion under class2 clusters into furthur segment
sub_2a = class2[class2["label"]==0]
sub_2b = class2[class2["label"]==1]
sub_2c = class2[class2["label"]==2]
#segmentaion under class3 clusters into furthur segment
sub_3a = class3[class3["label"]==0]
sub_3b = class3[class3["label"]==1]
sub_3c = class3[class3["label"]==2]
#segmentaion under class4 clusters into furthur segment
sub_4a = class4[class4["label"]==0]
sub_4b = class4[class4["label"]==1]
sub_4c = class4[class4["label"]==2]

sub_0a.columns.values

def topitem(df):
    PId = list(sub_0a.ProductId.unique())
    store = {}
    for i in tqdm(range(len(PId))):
        # store[PId[i]] = df[df['ProductId']==PId[i]].Quantity.sum()
        store[PId[i]] = df[df['productId']==PId[i]].F.sum()

   
    max_value = max(store.values())
    top_item = [key for key in store.keys() if store[key]==max_value]
    return (top_item,max_value)

sub_cluster = ['sub_0a','sub_0b','sub_0c',
               'sub_1a','sub_1b','sub_1c',
               'sub_2a','sub_2b','sub_2c',
               'sub_3a','sub_3b','sub_3c',
               'sub_4a','sub_4b','sub_4c']

sub_cluster_variable = [sub_0a,sub_0b,sub_0c,
                        sub_1a,sub_1b,sub_1c,
                        sub_2a,sub_2b,sub_2c,
                        sub_3a,sub_3b,sub_3c,
                        sub_4a,sub_4b,sub_4c]
hold = []
sub_topitem ={}
for i in tqdm(range(len(sub_cluster))):
    item,count = topitem(sub_cluster_variable[i])
    sub_topitem[sub_cluster[i]]=item
    hold.append(count)

# the top most sold item within each cluster 
sub_topitem

ids_1a = sub_1a.MemberId.unique()
ids_1b = sub_1b.MemberId.unique()
ids_1c = sub_1c.MemberId.unique()
ids_2a = sub_2a.MemberId.unique()
ids_2b = sub_2b.MemberId.unique()
ids_2c = sub_2c.MemberId.unique()
ids_3a = sub_3a.MemberId.unique()
ids_3b = sub_3b.MemberId.unique()
ids_3c = sub_3c.MemberId.unique()
ids_4a = sub_4a.MemberId.unique()
ids_4b = sub_4b.MemberId.unique()
ids_4c = sub_4c.MemberId.unique()

# print(data.head(3))

# create a list of our conditions
conditions = [
    (data['userId'].isin(ids_1a)),
    (data['userId'].isin(ids_1b)),
    (data['userId'].isin(ids_1c)),
    (data['userId'].isin(ids_2a)),
    (data['userId'].isin(ids_2b)),
    (data['userId'].isin(ids_2c)),
    (data['userId'].isin(ids_3a)),
    (data['userId'].isin(ids_3b)),
    (data['userId'].isin(ids_3c)),
    (data['userId'].isin(ids_4a)),
    (data['userId'].isin(ids_4b)),
    (data['userId'].isin(ids_4c)),
    ]

# create a list of the values we want to assign for each condition
values = ['sub_1a', 'sub_1b', 'sub_1c', 'sub_2a', 'sub_2b', 'sub_2c','sub_3a',
          'sub_3b', 'sub_3c','sub_4a', 'sub_4b', 'sub_4c',]

# create a new column and use np.select to assign values to it using our lists as arguments
data['class'] = np.select(conditions, values)

# display updated DataFrame
print(data.head(100))

# h= data[data['MemberId'] == 3417]
# # print(h)
# print("-------------------")
# v = (h['class'].values)[0]
# # l = v[0]
# print(sub_topitem[v])

def getReccomendById(idd):
  member = data[data['userId'] == idd]
  print("fun")
  valOfClass = (member['class'].values)[0]
  print(sub_topitem[valOfClass])


getReccomendById(3889)

def final(col,idd):
    recom = []
    for k in tqdm(range(len(col))):
        if(col[k]==idd):
            recom.append("already bought")
        else:
            recom.append(idd)
    return recom

# To reccomend the top sold item in the cluster for those who have not bought 
for i in tqdm(range(len(sub_cluster))):
    test = sub_topitem[sub_cluster[i]][0]
    for j in tqdm(range(len(sub_cluster_variable))):
        pdt_list = list(sub_cluster_variable[j].ProductId)
        recommendation = final(pdt_list,test)
        sub_cluster_variable[j]["Recommended"]=recommendation



##############################################

# ids_1a = sub_1a.MemberId.unique()
# ids_1b = sub_1b.MemberId.unique()
# ids_1c = sub_1c.MemberId.unique()
# ids_2a = sub_2a.MemberId.unique()
# ids_2b = sub_2b.MemberId.unique()
# ids_2c = sub_2c.MemberId.unique()
# ids_3a = sub_3a.MemberId.unique()
# ids_3b = sub_3b.MemberId.unique()
# ids_3c = sub_3c.MemberId.unique()
# ids_4a = sub_4a.MemberId.unique()
# ids_4b = sub_4b.MemberId.unique()
# ids_4c = sub_4c.MemberId.unique()
# # print(data.head(1))
# # data["class"] = 'null'
# # df.loc[df.A==0, 'B']
# print(data.head(1))
# x1a = data.loc[data['MemberId'].isin(ids_1a)]
# x1a['class'] = '1a'
# # print(x1a)
# # data = data.drop(columns=['class'])
# # print(data.head(1))
# print(data.head(1))
# data = data.loc[data['MemberId'].isin(ids_1a)]['class'] = 'aaa'
# print(data.head(1))

# print(data.head(100))
# print(x1a)
# data['MemberId'].isin(ids_1a) = x1a
# a1 = data.loc[data['MemberId'].isin(ids_1a)]
# print(a1.index)
# print("******")
# print(len(a1.index))
# for n in a1.index:
#   data.at[n,'class']='Yosef'


# b1 = data.loc[data['MemberId'].isin(ids_1b)]
# for n in b1.index:
#   data.at[n,'class']='1b'

# c1 = data.loc[data['MemberId'].isin(ids_1c)]
# for n in c1.index:
#   data.at[n,'class']='1c'

# a2 = data.loc[data['MemberId'].isin(ids_2a)]
# for n in a2.index:
#   data.at[n,'class']='2a'

# b2 = data.loc[data['MemberId'].isin(ids_2b)]
# for n in b2.index:
#   data.at[n,'class']='2b'

# c2 = data.loc[data['MemberId'].isin(ids_2c)]
# for n in c2.index:
#   data.at[n,'class']='2c'

# a3 = data.loc[data['MemberId'].isin(ids_3a)]
# for n in a3.index:
#   data.at[n,'class']='3a'

# b3 = data.loc[data['MemberId'].isin(ids_3b)]
# for n in b3.index:
#   data.at[n,'class']='3b'

# c3 = data.loc[data['MemberId'].isin(ids_3c)]
# for n in c3.index:
#   data.at[n,'class']='3c'

# a4 = data.loc[data['MemberId'].isin(ids_4a)]
# for n in a4.index:
#   data.at[n,'class']='4a'

# b4 = data.loc[data['MemberId'].isin(ids_4b)]
# for n in b4.index:
#   data.at[n,'class']='4b'

# # c4 = data.loc[data['MemberId'].isin(ids_4c)]
# # for n in c4.index:
# #   data.at[n,'class']='4c'

# print("data.head(100)")
# print(data.head(500))
# data.loc[data['MemberId'].isin(ids_1a)]['test'] = '1a'
# x1b = data.loc[data['MemberId'].isin(ids_1b)]
# x1b['class']='1b'
# data.loc[data['MemberId'].isin(ids_1b)] = x1b

# x1c = data.loc[data['MemberId'].isin(ids_1c)]
# x1c['class']='1c'
# data.loc[data['MemberId'].isin(ids_1c)] = x1c

# x2a = data.loc[data['MemberId'].isin(ids_2a)]
# x2a['class']='2a'
# data.loc[data['MemberId'].isin(ids_1a)] = x2a

# x2b = data.loc[data['MemberId'].isin(ids_2b)]
# x2b['class']='2b'
# data.loc[data['MemberId'].isin(ids_2b)] = x2b

# x2c = data.loc[data['MemberId'].isin(ids_2c)]
# x2c['class']='2c'
# data.loc[data['MemberId'].isin(ids_2c)] = x2c

# x3a = data.loc[data['MemberId'].isin(ids_3a)]
# x3a['class']='3a'
# data.loc[data['MemberId'].isin(ids_3a)] = x3a

# x3b = data.loc[data['MemberId'].isin(ids_3b)]
# x3b['class']='3b'
# data.loc[data['MemberId'].isin(ids_1b)] = x3b

# x3c = data.loc[data['MemberId'].isin(ids_3c)]
# x3c['class']='3c'
# data.loc[data['MemberId'].isin(ids_1c)] = x3c
# for i in range(1000):
#   # data.iloc[i]['class'] = 'mami'
#   x = data.iloc[i]
#   if(x['MemberId'] in ids_1a):
#     # print("hi")
#     x['class']='1a'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_1b):
#     x['class']='1b'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_1c):
#     x['class']='1c'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_2a):
#     x['class']='2a'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_2b):
#     x['class']='2b'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_2c):
#     x['class']='2c'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_3a):
#     x['class']='3a'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_3b):
#     x['class']='3b'
#     data.iloc[i] = x
#   elif(x['MemberId'] in ids_3c):
#     x['class']='3c'
#     data.iloc[i] = x

# data.iloc[i] = x
# print(x)
# print(member)
#    if i in ids:
#      data[i]['liron'] = 'liron'
# data.loc[data.MemberId==[i for i in ids],'class'] = 'liron'
# print("liromnnnnnnnnnnn")
# print(data.head(100))
