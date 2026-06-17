import pandas as pd
import json
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, classification_report

# -------------------------
# Load Dataset
# -------------------------
df = pd.read_csv("data/IBM_EmployeeAttrition_dataset.csv")

# -------------------------
# Drop useless columns
# -------------------------
df = df.drop(
    columns=[
        "EmployeeCount",
        "Over18",
        "StandardHours",
        "EmployeeNumber"
    ]
)

# -------------------------
# Encode target
# -------------------------
df["Attrition"] = df["Attrition"].map({
    "No": 0,
    "Yes": 1
})

# -------------------------
# Features & Target
# -------------------------
X = df.drop("Attrition", axis=1)
y = df["Attrition"]

# -------------------------
# One-Hot Encoding
# -------------------------
X = pd.get_dummies(X)

# -------------------------
# Save feature columns (CRITICAL)
# -------------------------
feature_columns = X.columns.tolist()

with open("ml/feature_columns.json", "w") as f:
    json.dump(feature_columns, f)

# -------------------------
# Stratified Split (IMPORTANT for imbalance)
# -------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------
# Improved Model (imbalance aware)
# -------------------------
model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced",
    max_depth=None,
    min_samples_split=5
)

model.fit(X_train, y_train)

# -------------------------
# Predictions
# -------------------------
y_pred = model.predict(X_test)

# Probability of leaving (VERY IMPORTANT for HR use-case)
y_prob = model.predict_proba(X_test)[:, 1]

# -------------------------
# Metrics
# -------------------------
accuracy = accuracy_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print("\n================ RESULTS ================")
print("Accuracy:", round(accuracy, 4))
print("F1 Score:", round(f1, 4))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# -------------------------
# Top Risk Employees (Probabilities)
# -------------------------
print("\n================ TOP RISK EMPLOYEES ================")

top_indices = y_prob.argsort()[-10:][::-1]
print("Top 10 highest attrition risk probabilities:\n")

for i in top_indices:
    print(f"Employee {i} → Risk: {round(y_prob[i], 3)}")

# -------------------------
# Save Model
# -------------------------
joblib.dump(model, "ml/attrition_model.joblib")

print("\nModel saved successfully as attrition_model.joblib")