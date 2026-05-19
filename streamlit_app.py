import io
import os
from typing import Any

import requests
import streamlit as st

BACKEND_URL = os.getenv(
    "BACKEND_URL", "https://marigold-disease-backend-2mb2.onrender.com"
).rstrip("/")
API_BASE_URL = f"{BACKEND_URL}/api"

st.set_page_config(page_title="Marigold Disease Detector", page_icon="🌼")

st.title("Marigold Disease Detector")
st.write(
    "Upload a marigold leaf image and analyze it with the deployed backend service."
)

st.markdown(
    "---"
)

with st.expander("Backend configuration", expanded=False):
    st.write("Backend URL:", BACKEND_URL)
    st.write("API base:", API_BASE_URL)

health_placeholder = st.empty()

try:
    health_resp = requests.get(f"{API_BASE_URL}/health", timeout=10)
    health_resp.raise_for_status()
    health_data = health_resp.json()
    backend_status = health_data.get("backend", "unknown")
    ml_status = health_data.get("ml", {})
    status_text = f"Backend: {backend_status}, ML status: {ml_status}"
    health_placeholder.success(status_text)
except Exception as exc:
    health_placeholder.error(
        "Unable to reach backend health endpoint. Check the backend URL and deployment."
    )
    st.stop()

uploaded_file = st.file_uploader(
    "Upload a marigold image", type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded image", use_column_width=True)
    if st.button("Analyze"):
        with st.spinner("Sending image to backend..."):
            try:
                files = {
                    "image": (
                        uploaded_file.name,
                        uploaded_file.getvalue(),
                        uploaded_file.type,
                    )
                }
                response = requests.post(
                    f"{API_BASE_URL}/predict", files=files, timeout=60
                )
                response.raise_for_status()
                prediction = response.json()

                st.success("Prediction complete")
                st.markdown("### Result")
                st.write("**Disease:**", prediction.get("disease_name"))
                confidence = prediction.get("confidence")
                if confidence is not None:
                    st.write("**Confidence:**", confidence)
                st.write("**Healthy:**", prediction.get("is_healthy"))
                details = prediction.get("details")
                if details:
                    st.write("**Details:**", details)

            except requests.RequestException as exc:
                st.error(f"Prediction request failed: {exc}")
            except ValueError:
                st.error("Invalid JSON response from backend.")
            except Exception as exc:
                st.error(f"Unexpected error: {exc}")
else:
    st.info("Please upload an image to enable analysis.")
