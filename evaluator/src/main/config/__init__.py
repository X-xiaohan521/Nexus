import os

NEXUS_DATA = os.getenv("NEXUS_DATA", "./data")
NEXUS_MQ_HOST = os.getenv('NEXUS_MQ_HOST', 'localhost')
NEXUS_MQ_PORT = os.getenv('NEXUS_MQ_PORT', '5672')