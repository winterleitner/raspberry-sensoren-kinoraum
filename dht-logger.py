#!/usr/bin/env python3

import time
import board
import adafruit_dht
import mariadb
import sys
import constant


def log_db(temp, hum):
    try:
        cur.execute(
            "INSERT INTO messungen (zeit,temperatur, luftfeuchtigkeit) VALUES (CURRENT_TIMESTAMP , ?, ?)",
            (temp, hum))
        conn.commit()
    except e:
        print(f"Mariadb Error: {e}")


# you can pass DHT22 use_pulseio=False if you wouldn't like to use pulseio.
# This may be necessary on a Linux single board computer like the Raspberry Pi,
# but it will not work in CircuitPython.
dhtDevice = adafruit_dht.DHT22(board.D2, use_pulseio=False)

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
            database="keller_sensor"

        )
        connected = True
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        tries += 1
        time.sleep(2.0)

# Get Cursor
cur = conn.cursor()

#avoid asking dht device to early
time.sleep(2.0)

while True:
    i = 0
    temp = 0.0
    hum = 0.0

    temperature = 0.0
    humidity = 0.0

    # take mean over 30 measurements
    while i < 30:
        try:
            i += 1
            temp = dhtDevice.temperature
            hum = dhtDevice.humidity

        except RuntimeError as error:
            i -= 1
            time.sleep(2.0)
            continue
        except Exception as error:
            dhtDevice.exit()
            raise error

        temperature += temp
        humidity += hum
        time.sleep(10.0)

    temperature /= i
    humidity /= i

    # round to one decimal place
    temperature = round(temperature, 1)
    humidity = round(humidity, 1)

    log_db(temperature, humidity)
