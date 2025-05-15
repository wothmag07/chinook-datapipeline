from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime
from airflow.datasets import Dataset
import os


PROJECT_ID = os.getenv("PROJECT_ID", "your-gcp-project")
DB_NAME = os.getenv("DB_NAME", "chinook_db")

chinook_raw_data_bq = Dataset(f"bq://{PROJECT_ID}/{DB_NAME}")

DEFAULT_ARGS = {
    "owner": "data_engineer",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 0,
}

# Path inside the Airflow container where the dbt project lives
DBT_PROJECT_DIR = "/opt/airflow/dbt/chinook_data_platform"

with DAG(
    dag_id="chinook_dbt_build",
    description="Runs dbt deps and dbt build for the Chinook project",
    schedule=None,  # trigger manually or set a cron schedule
    default_args=DEFAULT_ARGS,
    catchup=False,
) as dag:

    dbt_deps = BashOperator(
        task_id="dbt_deps",
        bash_command=f"cd {DBT_PROJECT_DIR} && dbt deps",
    )

    dbt_build = BashOperator(
        task_id="dbt_build",
        bash_command=f"cd {DBT_PROJECT_DIR} && dbt build",
    )

    dbt_deps >> dbt_build 