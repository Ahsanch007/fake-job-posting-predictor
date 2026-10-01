from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib


# Load the trained model and TF-IDF vectorizer
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")


# Create FastAPI app
app = FastAPI()


# Allow the Next.js frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data we expect from the frontend
class JobRequest(BaseModel):
    job_text: str


# Check if the API is working
@app.get("/")
def home():
    return {
        "message": "Fake Job Predictor API is running"
    }


# Predict whether the job is real or fake
@app.post("/predict")
def predict_job(request: JobRequest):

    # Get the job posting text
    text = request.job_text

    # Convert the text into TF-IDF features
    text_tfidf = vectorizer.transform([text])

    # Get the prediction
    # 0 = Real
    # 1 = Fake
    prediction = model.predict(text_tfidf)[0]

    # Get probabilities for both classes
    probabilities = model.predict_proba(text_tfidf)[0]

    real_probability = probabilities[0]
    fake_probability = probabilities[1]

    # Convert the prediction into a readable result
    if prediction == 1:
        result = "Fake"
    else:
        result = "Real"

    return {
        "prediction": result,
        "real_probability": round(float(real_probability), 2),
        "fake_probability": round(float(fake_probability), 2),
    }