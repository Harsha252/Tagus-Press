import React from "react";

export default function   Spinner() {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border loader text-info">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
