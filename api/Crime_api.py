from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from Crime_model import CrimePredictAPP


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Crime Prediction API",
    description="Predict whether a crime case will be solved"
)


# ============================================================
# CORS
# ============================================================


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ============================================================
# LOAD MODEL
# ============================================================

model = CrimePredictAPP()


# ============================================================
# INPUT MODEL
# ============================================================

class ApplicationData(BaseModel):

    CNTYFIPS: str
    Ori: str
    State: str
    Agency: str
    Agentype: str
    Source: str

    Year: int = Field(
        ...,
        ge=1976,
        le=2025
    )

    Month: str

    Incident: int = Field(
        ...,
        ge=0
    )

    ActionType: str

    Homicide: str

    VicAge: int = Field(
        ...,
        ge=0,
        le=999
    )

    VicSex: str

    VicRace: str

    VicEthnic: str

    Weapon: str

    Circumstance: str

    VicCount: int = Field(
        ...,
        ge=0
    )

    MSA: str


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "model": "loaded",
        "preprocessor": "loaded"
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
def Predict_Crime(data: ApplicationData):

    try:

        # Convert Pydantic object to dictionary
        application_data = data.model_dump()


        # Send data to model
        result = model.Crime_Predict(
            application_data
        )


        # Return prediction
        return {
            "status": "Success",
            "data": result
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )