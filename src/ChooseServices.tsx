import React, { useState } from "react";
import { Link } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import "./assets/css/ChooseServices.css";

interface ServiceOptions {
  gingerauth: boolean;
  gingerConnector: boolean;
  gingerScaffolder: boolean;
  gingerReleaser: boolean;
  gingerDB: boolean;
}

const initialOptions = {
    gingerauth: false,
    gingerConnector: false,
    gingerScaffolder: false,
    gingerReleaser: false,
    gingerDB: false,
};

const ChooseServices: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<ServiceOptions>(initialOptions);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to reset all selections?")) {
      setSelectedOptions(initialOptions);
    }
  };

  const hasSelectedServices = Object.values(selectedOptions).some((value) => value === true);

  const handleNext = async () => {
    const selectedTools = Object.entries(selectedOptions)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    try {
      await invoke("install_selected_tools", {
        selected_tools: selectedTools,
        install_path: "C:\\Program Files\\GingerTools",
      });
      alert("Installation process started!");
    } catch (error) {
      alert("Error starting installation: " + error);
    }
  };

  return (
    <div className="chooseoption">
      <h2>Setup - Ginger Tools</h2>
      <h3>Select Additional Tasks</h3>
      <p>
        Select the additional tasks you would like Setup to perform while installing Ginger Tools, then click Next.
      </p>

      <div className="checkbox-group">
        <h4>Ginger Components:</h4>
        {Object.keys(initialOptions).map((key) => (
          <label key={key} title={`Install the ${key} component`}>
            <input
              type="checkbox"
              name={key}
              checked={selectedOptions[key as keyof ServiceOptions]}
              onChange={handleCheckboxChange}
            />
            Install {key === "gingerauth" ? "Ginger Auth" : key.replace("ginger", "Ginger ")}
          </label>
        ))}
      </div>

      <div className="button-group2">
        <Link to="/">
          <button className="btn">Back</button>
        </Link>
        <button
          className="btn"
          disabled={!hasSelectedServices}
          title={!hasSelectedServices ? "Please select at least one service" : ""}
          onClick={handleNext}
        >
          Next
        </button>
        <button className="btn" onClick={handleCancel}>Reset</button>
        <Link to="/">
          <button className="Secondary-button">Exit</button>
        </Link>
      </div>
    </div>
  );
};

export default ChooseServices;
