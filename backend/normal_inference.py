from ultralytics import YOLO
import os

# ==========================================
# LOAD MODEL
# ==========================================
NORMAL_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'Models/solar_yolov9_normal_finetuned.pt')

try:
    normal_model = YOLO(NORMAL_MODEL_PATH)
    print("Normal model loaded successfully")
except Exception as e:
    print(f"Error loading normal model: {e}")
    normal_model = None


# ==========================================
# PREDICTION FUNCTION
# ==========================================

def predict_normal_image(image_path):
    """
    Takes a normal solar panel image path and returns prediction results.
    Iterates through ALL detected boxes and reports the most relevant defect.
    """
    if normal_model is None:
        return {"error": "Model not loaded"}

    results = normal_model.predict(source=image_path, conf=0.25, verbose=False)

    predictions = []
    for result in results:
        if result.boxes and len(result.boxes) > 0:
            # Gather every detection on this image
            detections = []
            for i in range(len(result.boxes)):
                cls_id = int(result.boxes.cls[i])
                label = normal_model.names[cls_id]
                conf = float(result.boxes.conf[i])
                detections.append({
                    'label': label,
                    'confidence': conf,
                    'index': i
                })

            # Prefer specific defects > generic 'Defective' > 'Non-Defective'
            SPECIFIC_DEFECTS = {'Dusty', 'Bird-drop', 'Electrical-Damage', 'Physical-Damage'}
            specific = [d for d in detections if d['label'] in SPECIFIC_DEFECTS]
            generic = [d for d in detections if d['label'] == 'Defective']
            non_defect = [d for d in detections if d['label'] == 'Non-Defective']

            if specific:
                best = max(specific, key=lambda x: x['confidence'])
                defect_class = best['label']
                confidence = best['confidence']
            elif generic:
                best = max(generic, key=lambda x: x['confidence'])
                defect_class = best['label']
                confidence = best['confidence']
            elif non_defect:
                best = max(non_defect, key=lambda x: x['confidence'])
                defect_class = best['label']
                confidence = best['confidence']
            else:
                # Fallback to highest-confidence box of any class
                best = max(detections, key=lambda x: x['confidence'])
                defect_class = best['label']
                confidence = best['confidence']

            coverage = calculate_coverage(result)
        else:
            defect_class = "No Defect Detected"
            confidence = 0.0
            coverage = 0.0

        predictions.append({
            "defect_class": defect_class,
            "confidence": round(confidence * 100, 2),
            "coverage": coverage
        })

    return predictions


# ==========================================
# COVERAGE CALCULATION
# ==========================================

def calculate_coverage(result):
    """Calculates defect coverage ratio over total panel area. Capped at 100%."""
    panel_area = 0
    defect_area = 0

    if result.masks is not None:
        for i, mask in enumerate(result.masks.data):
            cls = int(result.boxes.cls[i])
            label = normal_model.names[cls]
            # Threshold mask to binary so we count actual pixels, not float probabilities
            mask_pixels = (mask > 0.5).sum().item()

            if label in ['Defective', 'Non-Defective']:
                panel_area += mask_pixels
            elif label in ['Dusty', 'Bird-drop', 'Electrical-Damage', 'Physical-Damage']:
                defect_area += mask_pixels

    if panel_area > 0:
        coverage = (defect_area / panel_area) * 100
        return round(min(coverage, 100.0), 2)

    # Fallback: if no panel masks were found, estimate from bounding-box areas
    panel_box_area = 0
    defect_box_area = 0
    for i in range(len(result.boxes)):
        cls = int(result.boxes.cls[i])
        label = normal_model.names[cls]
        # xywh format: [x_center, y_center, width, height]
        box = result.boxes.xywh[i]
        area = float(box[2] * box[3])

        if label in ['Defective', 'Non-Defective']:
            panel_box_area += area
        elif label in ['Dusty', 'Bird-drop', 'Electrical-Damage', 'Physical-Damage']:
            defect_box_area += area

    if panel_box_area > 0:
        coverage = (defect_box_area / panel_box_area) * 100
        return round(min(coverage, 100.0), 2)

    return 0.0
