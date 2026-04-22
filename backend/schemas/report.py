from pydantic import BaseModel, Field
from typing import List, Literal

class MedicalReport(BaseModel):
    patientName: str = Field(..., description="The name of the patient.")
    location: str = Field(..., description="The location of the visit, e.g., '4th Street Residence'.")
    clinicalObservation: str = Field(..., description="The clinical observation or assessment.")
    treatmentProvided: List[str] = Field(default_factory=list, description="List of treatments provided during the visit.")
    medicalSuppliesUsed: List[str] = Field(default_factory=list, description="List of medical supplies or medications used.")
    patientSentiment: str = Field(..., description="The sentiment or emotional state of the patient.")
    nextActionRequired: str = Field(..., description="The next action or follow-up required.")
    technicianStatus: str = Field(..., description="The status of the technician or nurse after the visit.")
    urgency: Literal["Routine", "Urgent", "Emergency"] = Field(..., description="The clinical urgency of the case.")

    # Keeping old fields for compatibility but mapping them to new ones if needed in extraction
    symptoms: List[str] = Field(default_factory=list, description="Deprecated: Use clinicalObservation instead.")
    diagnosis: str = Field(default="", description="Deprecated: Use clinicalObservation instead.")
    treatmentPlan: str = Field(default="", description="Deprecated: Use treatmentProvided instead.")
