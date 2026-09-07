import { useState } from "react";
import "./App.css";
import backgroundImage from "./images.jpg";


// ============================================================
// INITIAL FORM DATA
// ============================================================

const initialFormData = {
  CNTYFIPS: "",
  Ori: "",
  State: "",
  Agency: "",
  Agentype: "",
  Source: "",
  Year: "",
  Month: "",
  Incident: "",
  ActionType: "",
  Homicide: "",
  VicAge: "",
  VicSex: "",
  VicRace: "",
  VicEthnic: "",
  Weapon: "",
  Circumstance: "",
  VicCount: "",
  MSA: ""
};


// ============================================================
// DROPDOWN DATA
// ============================================================

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];


const agencyTypes = [
  "Sheriff",
  "Municipal police",
  "Special police",
  "Primary state LE",
  "County police",
  "Tribal",
  "Primary federal LE",
  "Regional police"
];


const sources = [
  "FBI",
  "MAP"
];


const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];


const actionTypes = [
  "Normal update",
  "Adjustment"
];


const homicideTypes = [
  "Murder and non-negligent manslaughter",
  "Manslaughter by negligence"
];


const victimSex = [
  "Male",
  "Female",
  "Unknown"
];


const victimRace = [
  "Black",
  "White",
  "Asian",
  "Unknown",
  "American Indian or Alaskan Native",
  "Native Hawaiian or Pacific Islander"
];


const victimEthnic = [
  "Unknown or not reported",
  "Hispanic or Latino",
  "Not Hispanic or Latino"
];


const weapons = [
  "Other or type unknown",
  "Handgun - pistol, revolver, etc",
  "Shotgun",
  "Knife or cutting instrument",
  "Blunt object - hammer, club, etc",
  "Rifle",
  "Personal weapons, includes beating",
  "Firearm, type not stated",
  "Fire",
  "Drowning",
  "Narcotics or drugs, sleeping pills",
  "Weapon Not Reported",
  "Strangulation - hanging",
  "Other gun",
  "Asphyxiation - includes death by gas",
  "Explosives",
  "Poison - does not include gas",
  "Pushed or thrown out window"
];


const circumstances = [
  "Other",
  "Brawl due to influence of alcohol",
  "Other arguments",
  "Circumstances undetermined",
  "Robbery",
  "Other negligent handling of gun",
  "Felon killed by police",
  "Other - not specified",
  "Felon killed by private citizen",
  "Lovers triangle",
  "Argument over money or property",
  "Arson",
  "Other sex offense",
  "Gambling",
  "Child killed by babysitter",
  "Gun-cleaning death - other than self",
  "All suspected felony type",
  "Burglary",
  "Narcotic drug laws",
  "All other manslaughter by negligence",
  "Gangland killings",
  "Motor vehicle theft",
  "Rape",
  "Institutional killings",
  "Brawl due to influence of narcotics",
  "Children playing with gun",
  "Larceny",
  "Sniper attack",
  "Victim shot in hunting accident",
  "Prostitution and commercialized vice",
  "Juvenile gang killings",
  "Abortion"
];


// ============================================================
// REUSABLE DROPDOWN COMPONENT
// ============================================================

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder
}) {
  return (
    <div className="form-group">

      <label htmlFor={name}>
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
      >

        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


// ============================================================
// MAIN APP
// ============================================================

function App() {

  const [formData, setFormData] =
    useState(initialFormData);

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ==========================================================
  // HANDLE INPUT CHANGE
  // ==========================================================

  const handleChange = (event) => {

    const {
      name,
      value
    } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setLoading(true);

    setError("");

    setResult(null);


    try {

      const requestData = {
        ...formData,

        Year: Number(formData.Year),

        Incident: Number(formData.Incident),

        VicAge: Number(formData.VicAge),

        VicCount: Number(formData.VicCount)
      };


      console.log(
        "Sending data to API:",
        requestData
      );


      const response = await fetch(
        "/api/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(requestData)
        }
      );


      const data = await response.json();


      console.log(
        "API Response:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.detail ||
          `Request failed with status ${response.status}`
        );
      }


      setResult(data.data);

    }

    catch (err) {

      console.error(
        "Prediction error:",
        err
      );

      setError(
        err.message
      );

    }

    finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {

    setFormData(
      initialFormData
    );

    setResult(null);

    setError("");

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className="app"
      style={{
        backgroundImage:
          `url(${backgroundImage})`
      }}
    >

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="page-header">

        <h1>
          Crime Investigation Prediction
        </h1>

        <p>
          Enter the crime incident details to predict
          whether the case is likely to be solved.
        </p>

      </div>


      {/* ====================================================
          FORM
      ==================================================== */}

      <form onSubmit={handleSubmit}>


        {/* COUNTY FIPS */}

        <div className="form-group">

          <label htmlFor="CNTYFIPS">
            County FIPS
          </label>

          <input
            id="CNTYFIPS"
            type="text"
            name="CNTYFIPS"
            value={formData.CNTYFIPS}
            onChange={handleChange}
            placeholder="Example: Autauga, AL"
            required
          />

        </div>


        {/* ORI */}

        <div className="form-group">

          <label htmlFor="Ori">
            ORI
          </label>

          <input
            id="Ori"
            type="text"
            name="Ori"
            value={formData.Ori}
            onChange={handleChange}
            placeholder="Example: AL00400"
            required
          />

        </div>


        {/* STATE */}

        <SelectField
          label="State"
          name="State"
          value={formData.State}
          onChange={handleChange}
          options={states}
          placeholder="Select State"
        />


        {/* AGENCY */}

        <div className="form-group">

          <label htmlFor="Agency">
            Agency
          </label>

          <input
            id="Agency"
            type="text"
            name="Agency"
            value={formData.Agency}
            onChange={handleChange}
            placeholder="Example: Autauga County"
            required
          />

        </div>


        {/* AGENCY TYPE */}

        <SelectField
          label="Agency Type"
          name="Agentype"
          value={formData.Agentype}
          onChange={handleChange}
          options={agencyTypes}
          placeholder="Select Agency Type"
        />


        {/* SOURCE */}

        <SelectField
          label="Source"
          name="Source"
          value={formData.Source}
          onChange={handleChange}
          options={sources}
          placeholder="Select Source"
        />


        {/* YEAR */}

        <div className="form-group">

          <label htmlFor="Year">
            Year
          </label>

          <input
            id="Year"
            type="number"
            name="Year"
            value={formData.Year}
            onChange={handleChange}
            min="1976"
            max="2025"
            placeholder="Example: 1979"
            required
          />

        </div>


        {/* MONTH */}

        <SelectField
          label="Month"
          name="Month"
          value={formData.Month}
          onChange={handleChange}
          options={months}
          placeholder="Select Month"
        />


        {/* INCIDENT */}

        <div className="form-group">

          <label htmlFor="Incident">
            Incident
          </label>

          <input
            id="Incident"
            type="number"
            name="Incident"
            value={formData.Incident}
            onChange={handleChange}
            min="0"
            placeholder="Example: 1"
            required
          />

        </div>


        {/* ACTION TYPE */}

        <SelectField
          label="Action Type"
          name="ActionType"
          value={formData.ActionType}
          onChange={handleChange}
          options={actionTypes}
          placeholder="Select Action Type"
        />


        {/* HOMICIDE */}

        <SelectField
          label="Homicide"
          name="Homicide"
          value={formData.Homicide}
          onChange={handleChange}
          options={homicideTypes}
          placeholder="Select Homicide Type"
        />


        {/* VICTIM AGE */}

        <div className="form-group">

          <label htmlFor="VicAge">
            Victim Age
          </label>

          <input
            id="VicAge"
            type="number"
            name="VicAge"
            value={formData.VicAge}
            onChange={handleChange}
            min="0"
            max="999"
            placeholder="Example: 35"
            required
          />

          <small>
            Enter 999 if age is unknown.
          </small>

        </div>


        {/* VICTIM SEX */}

        <SelectField
          label="Victim Sex"
          name="VicSex"
          value={formData.VicSex}
          onChange={handleChange}
          options={victimSex}
          placeholder="Select Sex"
        />


        {/* VICTIM RACE */}

        <SelectField
          label="Victim Race"
          name="VicRace"
          value={formData.VicRace}
          onChange={handleChange}
          options={victimRace}
          placeholder="Select Race"
        />


        {/* VICTIM ETHNIC */}

        <SelectField
          label="Victim Ethnic"
          name="VicEthnic"
          value={formData.VicEthnic}
          onChange={handleChange}
          options={victimEthnic}
          placeholder="Select Ethnicity"
        />


        {/* WEAPON */}

        <SelectField
          label="Weapon"
          name="Weapon"
          value={formData.Weapon}
          onChange={handleChange}
          options={weapons}
          placeholder="Select Weapon"
        />


        {/* CIRCUMSTANCE */}

        <SelectField
          label="Circumstance"
          name="Circumstance"
          value={formData.Circumstance}
          onChange={handleChange}
          options={circumstances}
          placeholder="Select Circumstance"
        />


        {/* VICTIM COUNT */}

        <div className="form-group">

          <label htmlFor="VicCount">
            Victim Count
          </label>

          <input
            id="VicCount"
            type="number"
            name="VicCount"
            value={formData.VicCount}
            onChange={handleChange}
            min="0"
            placeholder="Example: 0"
            required
          />

        </div>


        {/* MSA */}

        <div className="form-group">

          <label htmlFor="MSA">
            MSA
          </label>

          <input
            id="MSA"
            type="text"
            name="MSA"
            value={formData.MSA}
            onChange={handleChange}
            placeholder="Example: Montgomery, AL"
            required
          />

        </div>


        {/* ==================================================
            BUTTONS
        ================================================== */}

        <div className="button-container">

          <button
            type="submit"
            className="predict-button"
            disabled={loading}
          >

            {loading
              ? "Predicting..."
              : "Predict Crime"}

          </button>


          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >

            Reset

          </button>

        </div>

      </form>


      {/* ====================================================
          ERROR
      ==================================================== */}

      {error && (

        <div className="error">

          <h2>
            Prediction Error
          </h2>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* ====================================================
          RESULT
      ==================================================== */}

      {result && (

        <div className="result">

          <h2>
            Prediction Result
          </h2>


          <div
            className={
              result.prediction === 1
                ? "result-icon solved"
                : "result-icon not-solved"
            }
          >

            {result.prediction === 1
              ? "✓"
              : "✕"}

          </div>


          <div className="result-status-text">

            {result.status}

          </div>


          <div className="probability">

            {
              (
                result.probability * 100
              ).toFixed(2)
            }%

          </div>


          <div className="probability-label">

            Probability of Case Being Solved

          </div>


          <div className="progress-container">

            <div
              className="progress-bar"
              style={{
                width:
                  `${result.probability * 100}%`
              }}
            />

          </div>


          <div className="prediction-value">

            Model Prediction:

            <strong>
              {result.prediction}
            </strong>

          </div>

        </div>

      )}

    </div>
  );
}


export default App;