import random
import uuid
from datetime import datetime
from app.models.schemas import Findings, Nodule, Uncertainty, NoduleType


LOCATIONS = [
    "right upper lobe",
    "right middle lobe", 
    "right lower lobe",
    "left upper lobe",
    "left lower lobe"
]

LUNG_HEALTH_OPTIONS = [
    "Generally healthy with minor findings",
    "Moderate abnormalities detected",
    "Significant findings requiring attention",
    "Multiple nodules detected - review recommended"
]


def generate_mock_nodule(nodule_id: int) -> Nodule:
    """Generate a single mock nodule with realistic values."""
    
    prob = round(random.uniform(0.1, 0.98), 2)
    size = round(random.uniform(4.0, 30.0), 1)
    
    return Nodule(
        id=nodule_id,
        type=random.choice(list(NoduleType)),
        location=random.choice(LOCATIONS),
        prob_malignant=prob,
        long_axis_mm=size,
        volume_mm3=round((4/3) * 3.14159 * (size/2)**3, 1),  # sphere approx
        uncertainty=Uncertainty(
            confidence=round(random.uniform(0.7, 0.99), 2),
            entropy=round(random.uniform(0.01, 0.3), 3),
            needs_review=prob > 0.7 or size > 20
        )
    )


def generate_mock_findings(
    study_id: str = None,
    patient_name: str = "Demo Patient",
    num_nodules: int = None
) -> Findings:
    """Generate complete mock findings for testing."""
    
    if study_id is None:
        study_id = f"SCAN_{uuid.uuid4().hex[:8].upper()}"
    
    if num_nodules is None:
        num_nodules = random.randint(1, 8)
    
    nodules = [generate_mock_nodule(i) for i in range(num_nodules)]
    
    # Calculate risk level based on nodules
    high_risk_count = sum(1 for n in nodules if n.prob_malignant > 0.7)
    
    if high_risk_count == 0:
        impression = "No high-risk nodules detected. Routine follow-up recommended."
        lung_health = "Generally healthy with minor findings"
    elif high_risk_count <= 2:
        impression = f"{high_risk_count} nodule(s) with elevated risk. Clinical correlation advised."
        lung_health = "Moderate abnormalities detected"
    else:
        impression = f"Multiple high-risk nodules ({high_risk_count}). Urgent review recommended."
        lung_health = "Significant findings requiring attention"
    
    summary_text = f"Your scan found {num_nodules} nodule(s). "
    if high_risk_count == 0:
        summary_text += "None appear concerning. Follow up with your doctor as scheduled."
    else:
        summary_text += f"{high_risk_count} need further review. Please consult your doctor soon."
    
    return Findings(
        study_id=study_id,
        patient_name=patient_name,
        patient_age=random.randint(35, 75),
        patient_gender=random.choice(["Male", "Female"]),
        scan_date=datetime.now().strftime("%Y-%m-%d"),
        lung_health=lung_health,
        airway_wall_thickness=random.choice(["normal", "mildly thickened"]),
        emphysema_score=round(random.uniform(0, 0.3), 2),
        fibrosis_score=round(random.uniform(0, 0.2), 2),
        consolidation_score=round(random.uniform(0, 0.15), 2),
        num_nodules=num_nodules,
        nodules=nodules,
        impression=impression,
        summary_text=summary_text
    )