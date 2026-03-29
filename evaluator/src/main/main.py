import sys

from consumer import *
from evaluator import *
from provider import *

def callback(ch, method, properties, body):
    request = body.decode()
    print(f" [x] Received evaluate request {request}")
    result = evaluate(request)
    print(f" [x] Finished evaluating, sending back results {result}")
    send_eval_result(result)
    print(" [x] Results sent, waiting for new requests")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def main():
    print("Starting the submission evaluator...")
    start_req_consumer(callback)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)