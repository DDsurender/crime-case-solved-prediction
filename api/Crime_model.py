import os
import joblib
import pandas as pd


class CrimePredictAPP:

    FEATURES = [
        "CNTYFIPS",
        "Ori",
        "State",
        "Agency",
        "Agentype",
        "Source",
        "Year",
        "Month",
        "Incident",
        "ActionType",
        "Homicide",
        "VicAge",
        "VicSex",
        "VicRace",
        "VicEthnic",
        "Weapon",
        "Circumstance",
        "VicCount",
        "MSA"
    ]

    NUMERIC_COLUMNS = [
        "Year",
        "Incident",
        "VicAge",
        "VicCount"
    ]

    def __init__(self):

        # Get Crime project folder
        BASE_DIR = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        # Models folder
        MODEL_DIR = os.path.join(
            BASE_DIR,
            "models"
        )

        # Model paths
        model_file = os.path.join(
            MODEL_DIR,
            "xgb_model.pkl"
        )

        preprocessor_file = os.path.join(
            MODEL_DIR,
            "preprocessor.pkl"
        )

        # Load saved model
        self.model = joblib.load(model_file)

        # Load saved preprocessor
        self.preprocessor = joblib.load(
            preprocessor_file
        )

    def Crime_Predict(self, application_data):

        # Convert input dictionary to DataFrame
        application_df = pd.DataFrame(
            [application_data]
        )

        # Make sure columns are in the exact
        # same order used during training
        application_df = application_df[
            self.FEATURES
        ].copy()

        # Convert numerical columns
        for column in self.NUMERIC_COLUMNS:

            application_df[column] = pd.to_numeric(
                application_df[column],
                errors="raise"
            )

        # Apply the SAME preprocessing used during training
        #
        # Incident log1p transformation happens
        # inside preprocessor.pkl
        processed_data = self.preprocessor.transform(
            application_df
        )

        # Get prediction
        prediction = int(
            self.model.predict(
                processed_data
            )[0]
        )

        # Get probability of Solved = 1
        probability = float(
            self.model.predict_proba(
                processed_data
            )[0][1]
        )

        # Return result
        return {
            "prediction": prediction,

            "status": (
                "Solved"
                if prediction == 1
                else "Not Solved"
            ),

            "probability": probability
        }