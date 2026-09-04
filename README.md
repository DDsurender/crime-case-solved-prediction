# Crime Case Solved Prediction

**End-to-end ML system predicting homicide case resolution from SHR 1976–2025 data (929K records).**
XGBoost → FastAPI → React, with a documented target-leakage investigation that dropped a suspicious 99.94% accuracy model down to a defensible 83%.

```
Accuracy 83.04%   Precision 87.35%   Recall 89.03%   F1 88.18%
```

`Python · Pandas · Scikit-learn · XGBoost · FastAPI · Pydantic · React · Vite`

---

## Why this project is here

Most "ML project" repos stop at `model.fit()` and a leaderboard screenshot. This one is here to show the parts that actually separate a working ML engineer from a notebook:

- **Caught my own data leakage** instead of shipping a 99.94%-accuracy model that looked great and meant nothing.
- **Shipped the model**, not just trained it — same preprocessing pipeline, serialized once, used identically in training and in a live API.
- **Built the full path** a prediction actually takes: React form → Pydantic validation → sklearn pipeline → XGBoost → JSON response.

---

## The leakage catch (the part worth reading)

First pass at this model hit **99.94% accuracy**. That's not a win, that's a red flag.

Digging into feature correlations, `OffAge` (offender age) had a **-0.90 correlation** with the target. Investigation showed that unknown offender values such as `999` could act as a strong proxy for the case outcome — a sign of target leakage rather than genuine predictive signal.

Fix: stripped every offender-derived field (`OffAge`, `OffSex`, `OffRace`, `OffEthnic`, `OffCount`, `Relationship`, `Situation`, `Subcircum`) — anything that's only known *after* a case is closed — and retrained on the 19 features that would realistically be available at prediction time (victim, weapon, agency, geography, circumstance). Accuracy dropped to 83%, which is the real number.

---

## Architecture

```
React (Vite)  →  FastAPI  →  Pydantic validation  →  sklearn Pipeline  →  XGBoost  →  prediction + probability
```

- **Model**: `XGBClassifier` (n_estimators=300, max_depth=8, lr=0.1, subsample=0.9, colsample_bytree=0.9), tuned via `GridSearchCV`, selected over Logistic Regression and Random Forest baselines on F1.
- **Preprocessing**: `StandardScaler` on numeric features (with `log1p` on the right-skewed `Incident` field), `OneHotEncoder(handle_unknown="ignore")` on categoricals — saved as one `preprocessor.pkl` so training-time and inference-time transforms are guaranteed identical.
- **Serving**: FastAPI validates the 19 required fields via Pydantic before anything touches the model.

```
POST /predict
{ "prediction": 1, "status": "Solved", "probability": 0.93 }
```

**Confusion matrix** (test set, 30% holdout, stratified):

|              | Pred: No | Pred: Yes |
|--------------|---------:|----------:|
| **Actual No**  | 55,133 | 25,552 |
| **Actual Yes** | 21,727 | 176,418 |

---

## Run it

```powershell
# Backend
cd api
uvicorn Crime_api:app --reload        # → http://127.0.0.1:8000/docs

# Frontend
cd frontend
npm install && npm run dev            # → http://localhost:5173
```

```
Crime/
├── api/            FastAPI app + Pydantic schemas
├── models/         xgb_model.pkl, preprocessor.pkl
├── frontend/        React + Vite UI
└── Feature_Engineering.ipynb
```

---

## Limitations

Trained on historical data with real-world reporting gaps; probabilities are model estimates, not guarantees; not intended for use in actual case decisions. Full discussion of leakage risk, feature choices, and evaluation methodology is in the notebook.

---

## What I'd add next

SHAP explainability, probability calibration, Docker + CI/CD, prediction-history dashboard on the frontend.
