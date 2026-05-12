import sys
import time
from pathlib import Path

from config import NEXUS_DATA

from consumer import *
from evaluator import *
from provider import *

from loguru import logger

from filelock import FileLock, Timeout


def callback(ch, method, properties, body):
    request = body.decode()
    logger.info(f"Received evaluate request {request}")
    # get lock file
    lock = FileLock(Path(NEXUS_DATA) / "heavy-task.lock")
    while True:
        try:
            # wait until the lock is successfully acquired
            with lock.acquire(timeout=0):
                # once got lock, proceed on evaluating
                result = evaluate(request)
                logger.info(f"Finished evaluating, sending back results {result}")
                send_eval_result(result)
                logger.info("Results sent, waiting for new requests")
                ch.basic_ack(delivery_tag=method.delivery_tag)
                break
            # lock will auto-release once out of the 'with' scope
        except Timeout:
            logger.info("Lock is occupied, wait 5 seconds before retrying...")
            time.sleep(5)

def main():
    base = Path(NEXUS_DATA)
    logger.add(base / "log" / "evaluator" / "evaluator.log", rotation="500 MB", retention="10 days", compression="zip", level="INFO")
    logger.info("Starting the submission evaluator...")
    start_req_consumer(callback)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)