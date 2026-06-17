import streamlit as st

from utils.gemini_client import generate_text
from utils.pdf_generator import create_pdf

# ==================================
# PAGE CONFIG
# ==================================

st.set_page_config(
    page_title="AI Job Description Generator",
    page_icon="📄",
    layout="centered"
)

st.title("📄 AI Job Description Generator")

# ==================================
# SESSION STATE
# Prevent output loss on reruns
# ==================================

if "generated_jd" not in st.session_state:
    st.session_state.generated_jd = ""

# ==================================
# INPUTS
# ==================================

role = st.text_input(
    "Job Role"
)

department = st.text_input(
    "Department"
)

experience = st.selectbox(
    "Experience Required",
    [
        "Fresh",
        "1-3 Years",
        "3-5 Years",
        "5+ Years"
    ]
)

skills = st.text_area(
    "Required Skills"
)

# ==================================
# SAFE AI WRAPPER
# ==================================

def safe_generate_jd(prompt):

    try:

        response = generate_text(prompt)

        if (
            not response
            or response.startswith("AI_ERROR")
            or len(response.strip()) < 50
        ):
            return None

        return response

    except Exception:
        return None

# ==================================
# GENERATE BUTTON
# ==================================

if st.button("✨ Generate JD"):

    if (
        not role
        or not department
        or not skills
    ):

        st.warning(
            "Please fill all fields."
        )

    else:

        prompt = f"""
You are a senior HR manager.

Generate a professional Job Description.

Role:
{role}

Department:
{department}

Experience:
{experience}

Required Skills:
{skills}

Format:

1. Job Title

2. Department

3. Job Summary

4. Key Responsibilities

5. Required Skills

6. Qualifications

7. Benefits

Use professional HR language.
Return only the job description.
"""

        with st.spinner(
            "Generating JD..."
        ):

            jd = safe_generate_jd(prompt)

        # ==================================
        # GEMINI FAILURE FALLBACK
        # ==================================

        if jd is None:

            st.warning(
                "⚠ Gemini unavailable. Using fallback JD template."
            )

            jd = f"""
JOB TITLE:
{role}

DEPARTMENT:
{department}

EXPERIENCE REQUIRED:
{experience}

JOB SUMMARY:
We are seeking a qualified professional for the position of {role}.

KEY RESPONSIBILITIES:

• Execute assigned tasks efficiently.

• Collaborate with cross-functional teams.

• Deliver high-quality work.

• Maintain organizational standards.

REQUIRED SKILLS:

{skills}

QUALIFICATIONS:

Bachelor's degree in a relevant field.

BENEFITS:

• Competitive Salary

• Paid Leaves

• Performance Bonuses

• Career Growth Opportunities

• Hybrid Work Environment
"""

        st.session_state.generated_jd = jd

# ==================================
# OUTPUT SECTION
# ==================================

if st.session_state.generated_jd:

    st.subheader(
        "📄 Generated Job Description"
    )

    st.text_area(
        "",
        st.session_state.generated_jd,
        height=500
    )

# ==================================
# SAFE PDF DOWNLOAD
# ==================================

    try:

        pdf_file = create_pdf(
            st.session_state.generated_jd,
            "job_description.pdf"
        )

        with open(
            pdf_file,
            "rb"
        ) as f:

            st.download_button(
                "⬇ Download JD PDF",
                data=f,
                file_name="Job_Description.pdf",
                mime="application/pdf"
            )

    except Exception as e:

        st.warning(
            f"PDF generation failed: {e}"
        )