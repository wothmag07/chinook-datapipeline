from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta
from airflow.datasets import Dataset
import os
import logging

log = logging.getLogger(__name__)

PROJECT_ID = os.getenv("PROJECT_ID", "")
DB_NAME = os.getenv("DB_NAME", "chinook_db")

chinook_raw_data_bq = Dataset(f"bq://{PROJECT_ID}/{DB_NAME}")

DBT_PROJECT_DIR = "/opt/airflow/dbt/chinook_data_platform"


def on_failure_callback(context):
    """Log failure details. Extend with Slack/email notification as needed."""
    task_instance = context.get("task_instance")
    log.error(
        "Task %s in DAG %s failed. Execution date: %s",
        task_instance.task_id,
        task_instance.dag_id,
        context.get("execution_date"),
    )


DEFAULT_ARGS = {
    "owner": "data_engineer",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 2,
    "retry_delay": timedelta(minutes=3),
    "on_failure_callback": on_failure_callback,
}

with DAG(
    dag_id="chinook_dbt_build",
    description="Runs dbt deps, build, and test for the Chinook project",
    schedule=[chinook_raw_data_bq],
    default_args=DEFAULT_ARGS,
    catchup=False,
    tags=["dbt", "transformation", "chinook"],
) as dag:

    dbt_deps = BashOperator(
        task_id="dbt_deps",
        bash_command=f"cd {DBT_PROJECT_DIR} && dbt deps",
    )

    dbt_build = BashOperator(
        task_id="dbt_build",
        bash_command=f"cd {DBT_PROJECT_DIR} && dbt build --fail-fast",
    )

    dbt_test = BashOperator(
        task_id="dbt_test",
        bash_command=f"cd {DBT_PROJECT_DIR} && dbt test",
    )

    # Disabled: Chinook data is static (2009-2013), invoice freshness always fails
    # dbt_freshness = BashOperator(
    #     task_id="dbt_source_freshness",
    #     bash_command=f"cd {DBT_PROJECT_DIR} && dbt source freshness",
    # )

    dbt_deps >> dbt_build >> dbt_test
    # dbt_deps >> dbt_freshness
