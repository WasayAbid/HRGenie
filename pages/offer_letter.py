import streamlit as st

from utils.pdf_generator import create_pdf
from utils.gemini_client import generate_text

# ==================================
# PAGE CONFIG
# ==================================

st.set_page_config(
    page_title="AI Offer Letter Generator",
    page_icon="📄",
    layout="centered"
)

st.title("📄 AI Offer Letter Generator")

# ==================================
# SESSION STATE
# Prevents losing output on reruns
# ==================================

if "offer_letter" not in st.session_state:
    st.session_state.offer_letter = ""

# ==================================
# INPUTS
# ==================================

candidate_name = st.text_input(
    "Candidate Name"
)

position = st.text_input(
    "Position"
)

department = st.text_input(
    "Department"
)

salary = st.text_input(
    "Monthly Salary (PKR)"
)

joining_date = st.date_input(
    "Joining Date"
)

# ==================================
# GENERATE BUTTON
# ==================================

if st.button("✨ Generate Offer Letter"):

    # ------------------------------
    # Validation
    # ------------------------------

    if (
        not candidate_name
        or not position
        or not department
        or not salary
    ):

        st.warning(
            "Please fill all fields."
        )

    else:

        prompt = f"""
Generate a professional HR Offer Letter.

Candidate Name:
{candidate_name}

Position:
{position}

Department:
{department}

Salary:
PKR {salary}

Joining Date:
{joining_date}

Requirements:

- Formal HR tone
- Professional formatting
- Welcome message
- Salary details
- Joining details
- Benefits section
- Closing remarks
- HR signature

Return complete offer letter only.
"""

        with st.spinner(
            "Generating Offer Letter..."
        ):

            result = generate_text(prompt)

        # ==================================
        # FALLBACK IF GEMINI FAILS
        # ==================================

        if (
            result.startswith("AI_ERROR")
            or len(result.strip()) < 50
        ):

            st.warning(
                "⚠ Gemini unavailable. Using fallback template."
            )

            result = f"""
OFFER LETTER

Date: {joining_date}

Dear {candidate_name},

We are pleased to offer you the position of {position}
in the {department} department at AI HR Insight Engine.

Your monthly salary will be PKR {salary}.

Your employment will commence on {joining_date}.

Benefits:

• Paid Leaves
• Growth Opportunities
• Performance Bonuses
• Learning & Development

We look forward to having you as part of our organization.

Sincerely,

HR Department
AI HR Insight Engine
"""

        st.session_state.offer_letter = result

# ==================================
# SHOW OUTPUT
# ==================================

if st.session_state.offer_letter:

    st.subheader(
        "Generated Offer Letter"
    )

    st.text_area(
        "",
        st.session_state.offer_letter,
        height=500
    )

# ==================================
# SAFE PDF GENERATION
# ==================================

    try:

        pdf_file = create_pdf(
            st.session_state.offer_letter,
            "offer_letter.pdf"
        )

        with open(
            pdf_file,
            "rb"
        ) as f:

            st.download_button(
                "⬇ Download PDF",
                data=f,
                file_name="Offer_Letter.pdf",
                mime="application/pdf"
            )

    except Exception as e:

        st.warning(
            f"PDF generation failed: {e}"
        )

# ==================================
# REACT READY NOTE
# ==================================
#
# Later:
#
# React Frontend
#        ↓
# FastAPI Backend
#        ↓
# generate_text()
#
# No code changes needed.
#
# ==================================