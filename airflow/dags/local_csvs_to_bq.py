from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime
from google.cloud import bigquery
import os
import logging
from airflow.datasets import Dataset

log = logging.getLogger(__name__)

PROJECT_ID = os.getenv("PROJECT_ID", "")
DB_NAME = os.getenv("DB_NAME", "")

chinook_raw_data_bq = Dataset(f"bq://{PROJECT_ID}/{DB_NAME}")


def _validate_env_vars():
    """Validate required environment variables at task runtime, not parse time."""
    project_id = os.getenv("PROJECT_ID")
    db_name = os.getenv("DB_NAME")
    if not project_id or not db_name:
        raise ValueError(
            "Required environment variables PROJECT_ID and DB_NAME are not set. "
            "Please configure them in your Airflow environment."
        )
    return project_id, db_name


def create_bq_dataset(**kwargs):
    project_id, db_name = _validate_env_vars()
    client = bigquery.Client(project=project_id)
    dataset_id = f"{project_id}.{db_name}"
    dataset = bigquery.Dataset(dataset_id)
    dataset.location = "US"
    client.create_dataset(dataset, exists_ok=True)
    log.info("Dataset %s created/verified.", dataset_id)


def load_csv_to_bq(table_name, csv_path, **kwargs):
    project_id, db_name = _validate_env_vars()
    client = bigquery.Client(project=project_id)
    table_id = f"{project_id}.{db_name}.{table_name}"

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
    job.result()

    table = client.get_table(table_id)
    log.info("Loaded %d rows into %s.", table.num_rows, table_id)


def on_failure_callback(context):
    """Log failure details. Extend with Slack/email notification as needed."""
    task_instance = context.get("task_instance")
    log.error(
        "Task %s in DAG %s failed. Execution date: %s",
        task_instance.task_id,
        task_instance.dag_id,
        context.get("execution_date"),
    )


default_args = {
    "owner": "data_engineer",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 2,
    "retry_delay": 60,
    "on_failure_callback": on_failure_callback,
}

with DAG(
    dag_id="local_csvs_to_bigquery",
    description="Loads local CSV files into BigQuery raw dataset",
    default_args=default_args,
    schedule=None,
    catchup=False,
    tags=["ingestion", "chinook"],
) as dag:

    create_dataset_task = PythonOperator(
        task_id="create_bq_dataset",
        python_callable=create_bq_dataset,
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
                "table_name": table_name,
                "csv_path": f"/opt/airflow/data/{csv_file}",
            },
            outlets=[chinook_raw_data_bq],
        )
        create_dataset_task >> task
        load_tasks.append(task)
