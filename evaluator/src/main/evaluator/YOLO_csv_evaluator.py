import csv
import json
import math
from collections import defaultdict
from pathlib import Path
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

class UserInputError(Exception):
    pass


class ServiceError(Exception):
    pass


def yolo_to_xyxy(xc, yc, w, h):
    return xc - w / 2, yc - h / 2, xc + w / 2, yc + h / 2


def get_iouv(torch):
    return torch.linspace(0.5, 0.95, 10)


def ensure_runtime():
    try:
        import numpy  # noqa: F401
        import torch
        from ultralytics.utils.metrics import ap_per_class, box_iou
    except Exception as e:
        logger.error(f"依赖加载失败: {e}")
        raise ServiceError()
    return torch, ap_per_class, box_iou


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


def match_predictions(pred_classes, true_classes, iou, torch):
    import numpy as np

    iouv = get_iouv(torch)
    correct = np.zeros((pred_classes.shape[0], iouv.shape[0]), dtype=bool)
    correct_class = true_classes[:, None] == pred_classes
    iou = (iou * correct_class).cpu().numpy()

    for i, thr in enumerate(iouv.tolist()):
        matches = np.nonzero(iou >= thr)
        matches = np.array(matches).T
        if matches.shape[0]:
            if matches.shape[0] > 1:
                matches = matches[iou[matches[:, 0], matches[:, 1]].argsort()[::-1]]
                matches = matches[np.unique(matches[:, 1], return_index=True)[1]]
                matches = matches[np.unique(matches[:, 0], return_index=True)[1]]
            correct[matches[:, 1].astype(int), i] = True

    return torch.tensor(correct, dtype=torch.bool)


def build_stats(gts, preds_rows, torch, box_iou):
    import numpy as np

    by_img = defaultdict(list)
    for pred in preds_rows:
        by_img[pred["image_id"]].append(pred)

    tps, confs, pred_clss, target_clss = [], [], [], []

    for image_id in sorted(set(gts.keys()) | set(by_img.keys())):
        gt_list = gts.get(image_id, [])
        pred_list = by_img.get(image_id, [])

        if gt_list:
            gt_boxes = torch.tensor(
                [yolo_to_xyxy(*x[1:5]) for x in gt_list],
                dtype=torch.float32,
            )
            gt_classes = torch.tensor([x[0] for x in gt_list], dtype=torch.float64)
        else:
            gt_boxes = torch.zeros((0, 4), dtype=torch.float32)
            gt_classes = torch.zeros((0,), dtype=torch.float64)

        if pred_list:
            pred_boxes = torch.tensor(
                [yolo_to_xyxy(p["x_center"], p["y_center"], p["width"], p["height"]) for p in pred_list],
                dtype=torch.float32,
            )
            pred_conf = torch.tensor([p["confidence"] for p in pred_list], dtype=torch.float32)
            pred_classes = torch.tensor([p["class_id"] for p in pred_list], dtype=torch.float64)
        else:
            pred_boxes = torch.zeros((0, 4), dtype=torch.float32)
            pred_conf = torch.zeros((0,), dtype=torch.float32)
            pred_classes = torch.zeros((0,), dtype=torch.float64)

        if gt_classes.shape[0] == 0 and pred_classes.shape[0] == 0:
            continue

        if gt_classes.shape[0] == 0 or pred_classes.shape[0] == 0:
            tp = np.zeros((pred_classes.shape[0], 10), dtype=bool)
        else:
            iou = box_iou(gt_boxes, pred_boxes)
            tp = match_predictions(pred_classes, gt_classes, iou, torch).numpy()

        if pred_classes.shape[0]:
            tps.append(tp)
            confs.append(pred_conf.numpy())
            pred_clss.append(pred_classes.numpy())
        if gt_classes.shape[0]:
            target_clss.append(gt_classes.numpy())

    if not tps:
        return None

    return {
        "tp": np.concatenate(tps, axis=0),
        "conf": np.concatenate(confs, axis=0),
        "pred_cls": np.concatenate(pred_clss, axis=0),
        "target_cls": np.concatenate(target_clss, axis=0) if target_clss else np.array([]),
    }


def evaluate_score(gt_dir, pred_path):
    torch, ap_per_class, box_iou = ensure_runtime()
    gts, gt_count = load_gt(gt_dir)
    preds = load_pred_csv(pred_path)

    if gt_count <= 0:
        logger.error("GT数量异常")
        raise ServiceError()

    try:
        stats = build_stats(gts, preds, torch, box_iou)
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
        _, _, _, _, _, ap_arr, _, *_ = ap_per_class(
            stats["tp"],
            stats["conf"],
            stats["pred_cls"],
            stats["target_cls"],
            plot=False,
        )
    except Exception as e:
        logger.error(f"AP计算失败: {e}")
        raise ServiceError()

    score = float(ap_arr.mean()) if getattr(ap_arr, "size", 0) else 0.0
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
