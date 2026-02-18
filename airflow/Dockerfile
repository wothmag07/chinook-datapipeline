FROM ${AIRFLOW_IMAGE_NAME:-apache/airflow:3.0.0}

USER root
RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*
USER airflow

RUN pip install --no-cache-dir \
    "apache-airflow-providers-google==10.25.0" \
    "google-cloud-bigquery==3.27.0" \
    "psycopg2-binary==2.9.10" \
    "apache-airflow-providers-postgres==5.13.1" \
    "dbt-bigquery==1.7.7" \
    "google-auth==2.38.0"
