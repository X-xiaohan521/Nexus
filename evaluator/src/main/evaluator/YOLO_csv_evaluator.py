import csv
import json
import math
from collections import defaultdict
from pathlib import Path

import numpy as np
from loguru import logger

from config import NEXUS_DATA

class EvaluateError(Exception):
    pass

REQUIRED_REQUEST_FIELDS = {"submissionId", "fileUri", "groundTruthUri", "callbackId", "timestamp"}
REQUIRED_CSV_COLUMNS = {
    "image_id",
    "class_id",
    "x_center",
    "y_center",
    "width",
    "height",
    "confidence",
}

IOUV = np.linspace(0.5, 0.95, 10)

class UserInputError(Exception):
    pass


class ServiceError(Exception):
    pass


def yolo_to_xyxy(xc, yc, w, h):
    return xc - w / 2, yc - h / 2, xc + w / 2, yc + h / 2


def ensure_runtime():
    try:
        import numpy  # noqa: F401
    except Exception as e:
        logger.error(f"依赖加载失败: {e}")
        raise ServiceError()
    return np


def parse_json_text(text):
    if text is None or not str(text).strip():
        logger.error("请求体为空")
        raise ServiceError()
    try:
        data = json.loads(text)
    except Exception as e:
        logger.error(f"JSON解析失败: {e}")
        raise ServiceError()
    if not isinstance(data, dict):
        logger.error("请求体不是JSON对象")
        raise ServiceError()
    return data


def validate_request(request):
    missing = [k for k in REQUIRED_REQUEST_FIELDS if k not in request]
    if missing:
        logger.error(f"请求缺少必要字段: {missing}")
        raise ServiceError()

    file_uri = request.get("fileUri")
    if file_uri is None or not str(file_uri).strip():
        logger.error("请求中的fileUri为空")
        raise ServiceError()


def parse_int(value, field_name, row_number):
    try:
        result = int(value)
    except Exception:
        raise UserInputError(f"第 {row_number} 行的 {field_name} 不是合法整数")
    if result < 0:
        raise UserInputError(f"第 {row_number} 行的 {field_name} 不能为负数")
    return result


def parse_float(value, field_name, row_number):
    try:
        result = float(value)
    except Exception:
        raise UserInputError(f"第 {row_number} 行的 {field_name} 不是合法数字")
    if not math.isfinite(result):
        raise UserInputError(f"第 {row_number} 行的 {field_name} 不是有效数字")
    return result


def load_gt(gt_dir):
    gt_path = Path(gt_dir)
    if not gt_path.exists() or not gt_path.is_dir():
        logger.error(f"GT目录异常: {gt_dir}")
        raise ServiceError()

    txt_files = sorted(gt_path.glob("*.txt"))
    if not txt_files:
        logger.error(f"GT目录中没有txt文件: {gt_dir}")
        raise ServiceError()

    gts = defaultdict(list)
    total = 0

    for file_path in txt_files:
        image_id = file_path.stem
        try:
            with file_path.open("r", encoding="utf-8") as fp:
                for line_no, raw_line in enumerate(fp, start=1):
                    line = raw_line.strip()
                    if not line:
                        continue
                    parts = line.split()
                    if len(parts) < 5:
                        logger.error(f"GT格式错误: {file_path.name}:{line_no}")
                        raise ServiceError()

                    try:
                        class_id = int(parts[0])
                        xc, yc, w, h = map(float, parts[1:5])
                    except Exception as e:
                        logger.error(f"GT解析失败: {file_path.name}:{line_no}, error={e}")
                        raise ServiceError()

                    if w <= 0 or h <= 0:
                        logger.error(f"GT框宽高非法: {file_path.name}:{line_no}")
                        raise ServiceError()

                    gts[image_id].append((class_id, xc, yc, w, h))
                    total += 1
        except ServiceError:
            raise
        except Exception as e:
            logger.error(f"GT读取失败: {file_path}, error={e}")
            raise ServiceError()

    if total == 0:
        logger.error("GT总标注数为0")
        raise ServiceError()

    return gts, total


def load_pred_csv(path):
    pred_path = Path(path)

    if not pred_path.exists():
        raise UserInputError("找不到提交文件，请确认提交文件是否上传成功")
    if not pred_path.is_file():
        raise UserInputError("提交文件不是有效文件")
    if pred_path.suffix.lower() != ".csv":
        raise UserInputError("提交文件格式错误，请提交 CSV 文件")
    if pred_path.stat().st_size == 0:
        raise UserInputError("提交文件为空，无法完成判分")

    rows = []

    try:
        with pred_path.open("r", encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)

            if not reader.fieldnames:
                raise UserInputError("提交文件缺少表头，无法识别字段")

            columns = {name.strip() for name in reader.fieldnames if name is not None}
            missing = sorted(REQUIRED_CSV_COLUMNS - columns)
            if missing:
                raise UserInputError(f"提交文件缺少必要列：{', '.join(missing)}")

            for idx, row in enumerate(reader, start=2):
                image_id = (row.get("image_id") or "").strip()
                if not image_id:
                    raise UserInputError(f"提交文件第 {idx} 行的 image_id 不能为空")

                class_id = parse_int(row.get("class_id"), "class_id", idx)
                x_center = parse_float(row.get("x_center"), "x_center", idx)
                y_center = parse_float(row.get("y_center"), "y_center", idx)
                width = parse_float(row.get("width"), "width", idx)
                height = parse_float(row.get("height"), "height", idx)
                confidence = parse_float(row.get("confidence"), "confidence", idx)

                if width <= 0 or height <= 0:
                    raise UserInputError(f"提交文件第 {idx} 行的框宽高必须大于 0")
                if not 0.0 <= confidence <= 1.0:
                    raise UserInputError(f"提交文件第 {idx} 行的 confidence 必须在 0 到 1 之间")

                rows.append(
                    {
                        "image_id": image_id,
                        "class_id": class_id,
                        "x_center": x_center,
                        "y_center": y_center,
                        "width": width,
                        "height": height,
                        "confidence": confidence,
                    }
                )
    except UserInputError:
        raise
    except UnicodeDecodeError:
        raise UserInputError("提交文件编码无法识别，请使用 UTF-8 编码的 CSV 文件")
    except csv.Error:
        raise UserInputError("提交文件不是合法的 CSV 格式")
    except OSError:
        raise UserInputError("提交文件无法读取，请检查文件后重新提交")
    except Exception as e:
        logger.error(f"CSV读取失败: {path}, error={e}")
        raise UserInputError("提交文件格式错误，请检查后重新提交")

    if not rows:
        raise UserInputError("提交文件中没有任何有效预测结果，无法完成判分")

    return rows


def box_iou(box1, box2):
    if box1.size == 0 or box2.size == 0:
        return np.zeros((len(box1), len(box2)), dtype=np.float32)

    box1 = box1.astype(np.float32)
    box2 = box2.astype(np.float32)

    inter_x1 = np.maximum(box1[:, None, 0], box2[None, :, 0])
    inter_y1 = np.maximum(box1[:, None, 1], box2[None, :, 1])
    inter_x2 = np.minimum(box1[:, None, 2], box2[None, :, 2])
    inter_y2 = np.minimum(box1[:, None, 3], box2[None, :, 3])

    inter_w = np.clip(inter_x2 - inter_x1, 0.0, None)
    inter_h = np.clip(inter_y2 - inter_y1, 0.0, None)
    inter = inter_w * inter_h

    area1 = np.clip(box1[:, 2] - box1[:, 0], 0.0, None) * np.clip(box1[:, 3] - box1[:, 1], 0.0, None)
    area2 = np.clip(box2[:, 2] - box2[:, 0], 0.0, None) * np.clip(box2[:, 3] - box2[:, 1], 0.0, None)

    union = area1[:, None] + area2[None, :] - inter
    union = np.clip(union, 1e-12, None)
    return inter / union


def match_predictions(pred_classes, true_classes, iou):
    correct = np.zeros((pred_classes.shape[0], IOUV.shape[0]), dtype=bool)
    correct_class = true_classes[:, None] == pred_classes[None, :]
    iou = iou * correct_class

    for i, threshold in enumerate(IOUV.tolist()):
        matches = np.argwhere(iou >= threshold)
        if matches.shape[0]:
            if matches.shape[0] > 1:
                match_ious = iou[matches[:, 0], matches[:, 1]]
                order = match_ious.argsort()[::-1]
                matches = matches[order]
                _, unique_pred_idx = np.unique(matches[:, 1], return_index=True)
                matches = matches[np.sort(unique_pred_idx)]
                _, unique_gt_idx = np.unique(matches[:, 0], return_index=True)
                matches = matches[np.sort(unique_gt_idx)]
            correct[matches[:, 1].astype(int), i] = True

    return correct


def compute_ap(recall, precision):
    mrec = np.concatenate(([0.0], recall, [1.0]))
    mpre = np.concatenate(([1.0], precision, [0.0]))
    mpre = np.flip(np.maximum.accumulate(np.flip(mpre)))
    x = np.linspace(0, 1, 101)
    return np.trapz(np.interp(x, mrec, mpre), x)


def ap_per_class(tp, conf, pred_cls, target_cls):
    eps = 1e-16

    if tp.shape[0] == 0:
        return np.zeros((0, tp.shape[1]), dtype=np.float32)

    order = np.argsort(-conf)
    tp = tp[order]
    conf = conf[order]
    pred_cls = pred_cls[order]

    unique_classes = np.unique(target_cls.astype(np.int64))
    ap = np.zeros((unique_classes.shape[0], tp.shape[1]), dtype=np.float32)

    for ci, c in enumerate(unique_classes):
        i = pred_cls == c
        n_l = (target_cls == c).sum()
        n_p = i.sum()

        if n_l == 0 or n_p == 0:
            continue

        fpc = (1 - tp[i].astype(np.float32)).cumsum(0)
        tpc = tp[i].astype(np.float32).cumsum(0)

        recall = tpc / (n_l + eps)
        precision = tpc / (tpc + fpc + eps)

        for j in range(tp.shape[1]):
            ap[ci, j] = compute_ap(recall[:, j], precision[:, j])

    return ap


def build_stats(gts, preds_rows):
    by_img = defaultdict(list)
    for pred in preds_rows:
        by_img[pred["image_id"]].append(pred)

    tps, confs, pred_clss, target_clss = [], [], [], []

    for image_id in sorted(set(gts.keys()) | set(by_img.keys())):
        gt_list = gts.get(image_id, [])
        pred_list = by_img.get(image_id, [])

        if gt_list:
            gt_boxes = np.array([yolo_to_xyxy(*x[1:5]) for x in gt_list], dtype=np.float32)
            gt_classes = np.array([x[0] for x in gt_list], dtype=np.int64)
        else:
            gt_boxes = np.zeros((0, 4), dtype=np.float32)
            gt_classes = np.zeros((0,), dtype=np.int64)

        if pred_list:
            pred_boxes = np.array(
                [yolo_to_xyxy(p["x_center"], p["y_center"], p["width"], p["height"]) for p in pred_list],
                dtype=np.float32,
            )
            pred_conf = np.array([p["confidence"] for p in pred_list], dtype=np.float32)
            pred_classes = np.array([p["class_id"] for p in pred_list], dtype=np.int64)
        else:
            pred_boxes = np.zeros((0, 4), dtype=np.float32)
            pred_conf = np.zeros((0,), dtype=np.float32)
            pred_classes = np.zeros((0,), dtype=np.int64)

        if gt_classes.shape[0] == 0 and pred_classes.shape[0] == 0:
            continue

        if gt_classes.shape[0] == 0 or pred_classes.shape[0] == 0:
            tp = np.zeros((pred_classes.shape[0], IOUV.shape[0]), dtype=bool)
        else:
            iou = box_iou(gt_boxes, pred_boxes)
            tp = match_predictions(pred_classes, gt_classes, iou)

        if pred_classes.shape[0]:
            tps.append(tp)
            confs.append(pred_conf)
            pred_clss.append(pred_classes)
        if gt_classes.shape[0]:
            target_clss.append(gt_classes)

    if not tps:
        return None

    return {
        "tp": np.concatenate(tps, axis=0),
        "conf": np.concatenate(confs, axis=0),
        "pred_cls": np.concatenate(pred_clss, axis=0),
        "target_cls": np.concatenate(target_clss, axis=0) if target_clss else np.array([], dtype=np.int64),
    }


def evaluate_score(gt_dir, pred_path):
    ensure_runtime()
    gts, gt_count = load_gt(gt_dir)
    preds = load_pred_csv(pred_path)

    if gt_count <= 0:
        logger.error("GT数量异常")
        raise ServiceError()

    try:
        stats = build_stats(gts, preds)
    except UserInputError:
        raise
    except Exception as e:
        logger.error(f"构建评测统计失败: {e}")
        raise ServiceError()

    if stats is None or stats["tp"].shape[0] == 0:
        raise UserInputError("提交文件中没有任何可用于评测的预测结果")

    if stats["target_cls"].size == 0:
        logger.error("target_cls为空")
        raise ServiceError()

    try:
        ap_arr = ap_per_class(
            stats["tp"],
            stats["conf"],
            stats["pred_cls"],
            stats["target_cls"],
        )
    except Exception as e:
        logger.error(f"AP计算失败: {e}")
        raise ServiceError()

    score = float(ap_arr.mean()) if ap_arr.size else 0.0
    if not math.isfinite(score):
        logger.error(f"评测结果非法: score={score}")
        raise ServiceError()

    return score

def make_response(submission_id, callback_id, status, score, error_msg):
    return {
        "submissionId": submission_id,
        "callbackId": callback_id,
        "status": status,
        "score": score,
        "errorMsg": error_msg,
    }

def evaluate(request: str) -> str:
    submission_id = None
    callback_id = None
    try:
        request_obj = parse_json_text(request)
        validate_request(request_obj)
        submission_id = request_obj.get("submissionId")
        callback_id = request_obj.get("callbackId")

        base = Path(NEXUS_DATA)
        gt_dir = base / request_obj.get("groundTruthUri")
        file_uri = base / request_obj.get("fileUri")

        score = evaluate_score(gt_dir=gt_dir, pred_path=file_uri)
        response = make_response(submission_id, callback_id, 1, score, None)

    except UserInputError as e:
        response = make_response(submission_id, callback_id, 0, None, str(e))

    except Exception as e:
        logger.error(f"系统异常: {e}")
        response = make_response(
            submission_id,
            callback_id,
            0,
            None,
            "服务器异常，请联系管理员或稍后再试",
        )

    return json.dumps(response, ensure_ascii=False)
