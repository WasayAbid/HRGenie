import pandas as pd

df = pd.read_csv("data/IBM_EmployeeAttrition_dataset"
".csv")

print(df.shape)
print(df.head())