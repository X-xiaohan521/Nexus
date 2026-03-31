import pika

from config import NEXUS_MQ_HOST, NEXUS_MQ_PORT

def send_eval_result(result: str):
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=NEXUS_MQ_HOST, port=NEXUS_MQ_PORT))
    channel = connection.channel()
    channel.basic_publish(exchange='', routing_key='mq.evaluate.result', body=result)
    connection.close()