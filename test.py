import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib


# ============================================================
# 1. LOAD DATASET
# ============================================================

# Load the CSV file
df = pd.read_csv("dataset/fake_job_postings.csv")

# Keep the original data safe and work on a copy
data = df.copy()


# ============================================================
# 2. UNDERSTAND THE DATA
# ============================================================

# Check the number of rows and columns
print("Shape:", data.shape)

# Check all column names
print("\nColumns:")
print(data.columns.tolist())


# ============================================================
# 3. CHECK TARGET
# ============================================================

# 0 = Real job
# 1 = Fake job
print("\nTarget distribution:")
print(data["fraudulent"].value_counts())

# Check the percentage of Real and Fake jobs
print("\nTarget percentage:")
print(data["fraudulent"].value_counts(normalize=True) * 100)


# ============================================================
# 4. HANDLE MISSING VALUES
# ============================================================

# These columns contain text or category information
text_columns = [
    "location",
    "department",
    "salary_range",
    "company_profile",
    "description",
    "requirements",
    "benefits",
    "employment_type",
    "required_experience",
    "required_education",
    "industry",
    "function"
]

# Replace missing values with "Unknown"
for column in text_columns:
    data[column] = data[column].fillna("Unknown")

# Check if any missing values are left
print("\nMissing values after cleaning:")
print(data.isnull().sum())


# ============================================================
# 5. COMBINE TEXT COLUMNS
# ============================================================

# These columns contain useful information about the job
text_features = [
    "title",
    "company_profile",
    "description",
    "requirements",
    "benefits"
]

# Combine all selected columns into one text column
# axis=1 means we combine values row by row
data["combined_text"] = data[text_features].agg(" ".join, axis=1)

# See how the combined text looks
print("\nCombined text:")
print(data["combined_text"].head())


# ============================================================
# 6. TRAIN / TEST SPLIT
# ============================================================

# X contains the input text
X = data["combined_text"]

# y contains the correct answers
# 0 = Real, 1 = Fake
y = data["fraudulent"]

# Split the data into 80% training and 20% testing
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# Check the number of training and testing jobs
print("\nTraining data:", len(X_train))
print("Testing data:", len(X_test))

# Check the class distribution in training data
print("\nTraining target distribution:")
print(y_train.value_counts())

# Check the class distribution in testing data
print("\nTesting target distribution:")
print(y_test.value_counts())


# ============================================================
# 7. TF-IDF VECTORIZATION
# ============================================================

# Create the TF-IDF vectorizer
# It converts text into numerical features
vectorizer = TfidfVectorizer(
    max_features=5000,
    stop_words="english"
)

# Learn the vocabulary from training data
# and convert the training text into numbers
X_train_tfidf = vectorizer.fit_transform(X_train)

# Use the same vocabulary for test data
# We do not fit again on test data
X_test_tfidf = vectorizer.transform(X_test)

# Check the size of the TF-IDF data
print("\nTraining TF-IDF shape:", X_train_tfidf.shape)
print("Testing TF-IDF shape:", X_test_tfidf.shape)


# ============================================================
# 8. TRAIN THE MODEL
# ============================================================

# Create the Logistic Regression model
model = LogisticRegression(
    max_iter=1000,
    class_weight="balanced"
)

# Train the model using the training data
model.fit(X_train_tfidf, y_train)

print("\nModel training completed!")


# ============================================================
# 9. MAKE PREDICTIONS
# ============================================================

# Predict Real or Fake for the unseen test jobs
# 0 = Real, 1 = Fake
predictions = model.predict(X_test_tfidf)

# Check the first 20 predictions
print("\nFirst 20 predictions:")
print(predictions[:20])


# ============================================================
# 10. EVALUATE THE MODEL
# ============================================================

# Check the overall accuracy
accuracy = accuracy_score(y_test, predictions)
print("\nAccuracy:", accuracy)


# Show precision, recall and F1-score
print("\nClassification Report:")
print(classification_report(y_test, predictions))


# Show how many predictions were correct and incorrect
print("\nConfusion Matrix:")
cm = confusion_matrix(y_test, predictions)
print(cm)


# ============================================================
# 11. SAVE MODEL AND VECTORIZER
# ============================================================

# Save the trained model for later use
joblib.dump(model, "model.pkl")

# Save the TF-IDF vectorizer as well
# We need the same vectorizer when new job text is received
joblib.dump(vectorizer, "vectorizer.pkl")



print("\nModel and vectorizer saved successfully!")