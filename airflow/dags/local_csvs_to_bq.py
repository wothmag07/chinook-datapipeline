from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
from google.cloud import bigquery
import os
from airflow.datasets import Dataset

# Environment variable checks
PROJECT_ID = os.getenv("PROJECT_ID")
DB_NAME = os.getenv("DB_NAME")

if not PROJECT_ID or not DB_NAME:
    raise ValueError(
        "Required environment variables PROJECT_ID or DB_NAME are not set. "
        "Please configure them in your Airflow environment."
    )

# Define the dataset that represents the raw chinook data in BigQuery
chinook_raw_data_bq = Dataset(f"bq://{PROJECT_ID}/{DB_NAME}")

def create_bq_dataset(project_id, dataset_name, location="US"):
    client = bigquery.Client(project=project_id)
    dataset_id = f"{project_id}.{dataset_name}"
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = location
    client.create_dataset(dataset, exists_ok=True)

def load_csv_to_bq(dataset_name, table_name, csv_path, project_id):
    client = bigquery.Client(project=project_id)
    table_id = f"{project_id}.{dataset_name}.{table_name}"

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        autodetect=True,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE,
    )

    with open(csv_path, "rb") as source_file:
        job = client.load_table_from_file(
            source_file,
            table_id,
            job_config=job_config,
        )
    job.result()  # Wait for the job to complete

default_args = {
    'start_date': datetime(2024, 1, 1),
}

with DAG(
    dag_id="local_csvs_to_bigquery",
    default_args=default_args,
    schedule=None
) as dag:
    
    create_dataset = PythonOperator(
        task_id="create_bq_dataset",
        python_callable=create_bq_dataset,
        op_kwargs={
            "project_id": PROJECT_ID,
            "dataset_name": DB_NAME,
            "location": "US",
        },
    )

    csv_table_map = {
        "Album.csv": "album",
        "Artist.csv": "artist",
        "Customer.csv": "customer",
        "Employee.csv": "employee",
        "Genre.csv": "genre",
        "Invoice.csv": "invoice",
        "InvoiceLine.csv": "invoiceline",
        "MediaType.csv": "mediatype",
        "Playlist.csv": "playlist",
        "PlaylistTrack.csv": "playlisttrack",
        "Track.csv": "track",
    }

    load_tasks = []
    for csv_file, table_name in csv_table_map.items():
        task = PythonOperator(
            task_id=f"load_{table_name}_csv",
            python_callable=load_csv_to_bq,
            op_kwargs={
                "dataset_name": DB_NAME,
                "table_name": table_name,
                "csv_path": f"/opt/airflow/data/{csv_file}",
                "project_id": PROJECT_ID,
            },
        )
        create_dataset >> task
        load_tasks.append(task)

