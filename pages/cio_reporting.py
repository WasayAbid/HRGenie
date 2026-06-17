import streamlit as st
import sqlite3
import pandas as pd

from utils.gemini_client import generate_text
from utils.pdf_generator import create_pdf

st.set_page_config(
    page_title="CIO Reporting Agent",
    layout="wide"
)

st.title("🧠 CIO Reporting Agent")

# ==========================
# LOAD DATA
# ==========================

conn = sqlite3.connect("hr_genie.db")

df = pd.read_sql_query(
    "SELECT * FROM candidates",
    conn
)

conn.close()

if len(df) == 0:

    st.warning(
        "No recruitment data available."
    )

    st.stop()

# ==========================
# SUMMARY STATS
# ==========================

total_candidates = len(df)

avg_match = round(
    df["match_score"].mean(),
    2
)

top_candidates = len(
    df[
        df["match_score"] >= 70
    ]
)

st.metric(
    "Candidates",
    total_candidates
)

st.metric(
    "Average Match",
    avg_match
)

st.metric(
    "High Match",
    top_candidates
)

st.divider()

# ==========================
# GENERATE REPORT
# ==========================

if st.button(
    "🚀 Generate CIO Report"
):

    summary = f"""

Recruitment Summary

Total Candidates:
{total_candidates}

Average Match Score:
{avg_match}

High Match Candidates:
{top_candidates}

Provide:

1 Executive Summary

2 Key Findings

3 Risks

4 Recommendations

5 Strategic Actions

"""

    with st.spinner(
        "Generating..."
    ):

        report = generate_text(
            summary
        )

    # ======================
    # FALLBACK
    # ======================

    if report.startswith(
        "AI_ERROR"
    ):

        report = f"""

EXECUTIVE REPORT

Total Candidates:
{total_candidates}

Average Match Score:
{avg_match}

High Match Candidates:
{top_candidates}

RECOMMENDATION:

Increase sourcing quality.

Improve candidate screening.

Monitor recruitment KPIs.

"""

    st.subheader(
        "Generated CIO Report"
    )

    st.text_area(
        "",
        report,
        height=500
    )

    # ======================
    # PDF
    # ======================

    try:

        pdf_file = create_pdf(
            report,
            "cio_report.pdf"
        )

        with open(
            pdf_file,
            "rb"
        ) as f:

            st.download_button(
                "⬇ Download CIO Report",
                f,
                file_name="CIO_Report.pdf",
                mime="application/pdf"
            )

    except:

        st.warning(
            "PDF generation failed."
        )