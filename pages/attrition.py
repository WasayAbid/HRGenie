import streamlit as st
import pandas as pd
import numpy as np
import joblib
import json
import os

st.title("📊 Employee Attrition Risk Dashboard (AI HR Genie)")

# =====================================================
# SAFE MODEL LOADING
# =====================================================

MODEL_PATH = "ml/attrition_model.joblib"
FEATURE_PATH = "ml/feature_columns.json"
DATA_PATH = "data/IBM_EmployeeAttrition_dataset.csv"

if not os.path.exists(MODEL_PATH):
    st.error("Model file not found. Train model first.")
    st.stop()

if not os.path.exists(FEATURE_PATH):
    st.error("Feature columns file missing. Run training script first.")
    st.stop()

if not os.path.exists(DATA_PATH):
    st.error("Dataset not found.")
    st.stop()

model = joblib.load(MODEL_PATH)

# =====================================================
# LOAD FEATURE COLUMNS (FIXED - NO JOBLIB)
# =====================================================

with open(FEATURE_PATH, "r") as f:
    feature_columns = json.load(f)

# =====================================================
# LOAD DATA
# =====================================================

df_raw = pd.read_csv(DATA_PATH)

# Save IDs BEFORE preprocessing
employee_ids = df_raw["EmployeeNumber"].copy()

# =====================================================
# PREPROCESSING (SAME AS TRAINING)
# =====================================================

df = df_raw.drop(
    columns=[
        "EmployeeCount",
        "Over18",
        "StandardHours",
        "EmployeeNumber"
    ]
)

df["Attrition"] = df["Attrition"].map({"No": 0, "Yes": 1})
df = df.drop("Attrition", axis=1)

# One-hot encoding
df_encoded = pd.get_dummies(df)

# =====================================================
# ALIGN FEATURES (CRITICAL FIX)
# =====================================================

df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

# FIX INDEX ALIGNMENT
df_encoded = df_encoded.reset_index(drop=True)
employee_ids = employee_ids.reset_index(drop=True)

# =====================================================
# PREDICTION
# =====================================================

risk_prob = model.predict_proba(df_encoded)[:, 1]

# =====================================================
# RESULT DATAFRAME
# =====================================================

result = pd.DataFrame({
    "EmployeeID": employee_ids,
    "Risk (%)": np.round(risk_prob * 100, 2)
})

result = result.reset_index(drop=True)
result = result.sort_values(by="Risk (%)", ascending=False).reset_index(drop=True)

# =====================================================
# KPI SECTION
# =====================================================

total_employees = len(result)
avg_risk = round(result["Risk (%)"].mean(), 2)
high_risk = result[result["Risk (%)"] > 70]
max_risk = result.iloc[0]

col1, col2, col3, col4 = st.columns(4)

col1.metric("👥 Total Employees", total_employees)
col2.metric("⚠️ High Risk", len(high_risk))
col3.metric("📊 Avg Risk %", avg_risk)
col4.metric("🚨 Max Risk", f"{max_risk['Risk (%)']}%")

st.markdown("---")

# =====================================================
# RISK DISTRIBUTION
# =====================================================

def risk_bucket(x):
    if x < 30:
        return "Low"
    elif x < 70:
        return "Medium"
    else:
        return "High"

result["Risk Level"] = result["Risk (%)"].apply(risk_bucket)

st.subheader("📊 Risk Distribution")

st.bar_chart(result["Risk Level"].value_counts())

st.markdown("---")

# =====================================================
# TOP RISK EMPLOYEES
# =====================================================

st.subheader("🚨 Top 10 High Risk Employees")

st.dataframe(result.head(10))

# =====================================================
# FULL DATA
# =====================================================

with st.expander("📋 View Full Employee Risk Table"):
    st.dataframe(result)

# =====================================================
# INSIGHTS
# =====================================================

st.subheader("🧠 HR Insight Summary")

if len(high_risk) > 0:
    st.error(
        f"⚠️ {len(high_risk)} employees have high probability of leaving. Immediate HR action recommended."
    )
else:
    st.success("✅ Workforce stability looks healthy.")