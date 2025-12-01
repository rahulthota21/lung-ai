# API Contract v1.0
> Last Updated: 2024-XX-XX

## Base URL
- Dev: http://localhost:8000

---

## Endpoints

### Health
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | / | `{status, message}` |
| GET | /health | `{status: "healthy"}` |

### Auth (existing)
| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /auth/send-code | `{email, purpose}` | `{status, code, message}` |
| POST | /auth/verify-code | `{email, code, purpose}` | `{status}` |

### Scan Upload
| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /scan/upload | `multipart file` | `{scan_id, filename, size_bytes, status}` |
| GET | /scan/{scan_id}/status | - | `{scan_id, status}` |
| GET | /scan/{scan_id}/findings | - | `Findings JSON` |

### Reports
| Method | Endpoint | Response |
|--------|----------|----------|
| GET | /report/clinician/{study_id} | PDF file |
| GET | /report/patient/{study_id}?lang=en | PDF file |

**Languages supported:** `en`, `hi`, `te`

---

## Findings JSON Schema

```json
{
  "study_id": "SCAN_ABC123",
  "patient_name": "Demo Patient",
  "patient_age": 55,
  "patient_gender": "Male",
  "scan_date": "2024-01-15",
  "lung_health": "Moderate abnormalities detected",
  "emphysema_score": 0.12,
  "fibrosis_score": 0.08,
  "num_nodules": 3,
  "nodules": [
    {
      "id": 0,
      "type": "solid",
      "location": "right upper lobe",
      "prob_malignant": 0.85,
      "long_axis_mm": 18.5,
      "volume_mm3": 3320.0,
      "uncertainty": {
        "confidence": 0.92,
        "entropy": 0.08,
        "needs_review": true
      }
    }
  ],
  "impression": "Clinical impression text",
  "summary_text": "Patient-friendly summary"
}


---

## Step 4: Run Commands

```bash
# Navigate to backend
cd D:\Draft 2\lung-atm\backend

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000