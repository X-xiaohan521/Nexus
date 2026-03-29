import typing

import pika
from pika import spec
from pika.adapters.blocking_connection import BlockingChannel

from config import NEXUS_MQ_HOST, NEXUS_MQ_PORT

def start_req_consumer(callback: typing.Callable[[BlockingChannel, spec.Basic.Deliver, spec.BasicProperties, bytes], None]):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=NEXUS_MQ_HOST, port=NEXUS_MQ_PORT))
    channel = connection.channel()
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='mq.evaluate.request', on_message_callback=callback)
    channel.start_consuming()