#!/usr/bin/env python3

import time
import board
import Adafruit_DHT
import mariadb
import sys


def log_db(temp, hum):
    try:
        cur.execute(
            "INSERT INTO data (timestamp,temperature, humidity) VALUES (CURRENT_TIMESTAMP , ?, ?)",
            (temp, hum))
        conn.commit()
    except e:
        print(f"Mariadb Error: {e}")


sensor = Adafruit_DHT.DHT22
pin = 2

# Connect to MariaDB Platform
connected = False
tries = 0
while connected is False:
    try:
        conn = mariadb.connect(
            user="root",
            password=constant.PWD,
            host="192.168.5.5",
            port=3306,
            database="dht_test"

        )
        connected = True
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        tries += 1
        time.sleep(2.0)

# Get Cursor
cur = conn.cursor()

#avoid asking dht device to early
time.sleep(5.0)

while True:
    i = 0
    temp = 0.0
    hum = 0.0

    temperature = 0.0
    humidity = 0.0

    # take mean over 30 measurements
    while i < 2:
        try:
            i += 1
            hum, temp = Adafruit_DHT.read_retry(sensor, pin)

        except RuntimeError as error:
            print("RuntimeError")
            i -= 1
            time.sleep(5.0)
            continue
        except Exception as error:
            raise error

        temperature += temp
        humidity += hum
        time.sleep(5.0)

    temperature /= i
    humidity /= i

    # round to one decimal place
    temperature = round(temperature, 1)
    humidity = round(humidity, 1)

    log_db(temperature, humidity)
