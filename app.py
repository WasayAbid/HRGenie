import streamlit as st

st.set_page_config(page_title="HRGenie", layout="wide")

st.title("🤖 HRGenie — AI HR Insight Engine")

st.write("Welcome to HRGenie. System is initializing... 🚀")

st.Page(
    "pages/offer_letter.py",
    title="Offer Letter"
)