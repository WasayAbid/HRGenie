import streamlit as st
import sqlite3
import pandas as pd

st.set_page_config(
    page_title="Executive Dashboard",
    layout="wide"
)

# ==========================
# THEME
# ==========================

st.markdown("""
<style>

[data-testid="stMetric"]{
background-color:#e8fff3;
padding:15px;
border-radius:15px;
}

</style>
""", unsafe_allow_html=True)

st.title("📊 Executive Dashboard")

# ==========================
# RECRUITMENT DATA
# ==========================

conn = sqlite3.connect("hr_genie.db")

df_candidates = pd.read_sql_query(
    "SELECT * FROM candidates",
    conn
)

conn.close()

# ==========================
# KPIs
# ==========================

total_candidates = len(df_candidates)

avg_match = 0

if total_candidates > 0:
    avg_match = round(
        df_candidates["match_score"].mean(),
        2
    )

high_match = len(
    df_candidates[
        df_candidates["match_score"] >= 70
    ]
)

col1,col2,col3 = st.columns(3)

col1.metric(
    "👥 Candidates",
    total_candidates
)

col2.metric(
    "📈 Avg Match Score",
    avg_match
)

col3.metric(
    "⭐ High Match",
    high_match
)

st.divider()

# ==========================
# CHART
# ==========================

if total_candidates > 0:

    st.subheader(
        "Candidate Match Distribution"
    )

    st.bar_chart(
        df_candidates["match_score"]
    )

    st.subheader(
        "Top Candidates"
    )

    st.dataframe(
        df_candidates.sort_values(
            by="match_score",
            ascending=False
        ).head(10)
    )

else:

    st.info(
        "No candidate data available."
    )