FROM ${AIRFLOW_IMAGE_NAME:-apache/airflow:3.0.0}

USER root
# Install any system-level dependencies if needed by your Python packages
# For example: RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*
USER airflow

# Install Python packages
# Ensure dbt-bigquery is compatible with your Airflow version and other Google providers
# You might need to pin versions for stability
RUN pip install --no-cache-dir \
    "apache-airflow-providers-google" \
    "google-cloud-bigquery" \
    "psycopg2-binary" \
    "apache-airflow-providers-postgres" \
    "dbt-bigquery" \
    "google-auth" 