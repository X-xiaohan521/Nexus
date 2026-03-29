import json
import time

def evaluate(request: str) -> str:
    req_dict = json.loads(request)
    time.sleep(1)
    resp = {
        "submissionId": req_dict["submissionId"],
        "callbackId": req_dict["callbackId"],
        "status": 1,
        "score": 0.91,
        "errorMsg": None
    }
    return json.dumps(resp)