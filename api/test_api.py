from fastapi.testclient import TestClient

from Crime_api import app


client = TestClient(app)


def test_health():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["model"] == "loaded"
    assert data["preprocessor"] == "loaded"


def test_prediction():
    payload = {
        "CNTYFIPS": "06001",
        "Ori": "CA0010000",
        "State": "California",
        "Agency": "Example Agency",
        "Agentype": "Municipal police",
        "Source": "FBI",
        "Year": 2024,
        "Month": "January",
        "Incident": 1,
        "ActionType": "Normal update",
        "Homicide": "Murder and non-negligent manslaughter",
        "VicAge": 30,
        "VicSex": "Male",
        "VicRace": "White",
        "VicEthnic": "Not Hispanic or Latino",
        "Weapon": "Handgun - pistol, revolver, etc",
        "Circumstance": "Other arguments",
        "VicCount": 1,
        "MSA": "Example MSA"
    }

    response = client.post("/predict", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "Success"

    result = data["data"]

    assert result["prediction"] in [0, 1]
    assert result["status"] in ["Solved", "Not Solved"]
    assert 0 <= result["probability"] <= 1