import os
import json
import pandas as pd

# Create 'data' directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Load JSON with UTF-8 encoding
with open("ChinookData.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Write each table to CSV under the 'data/' directory
for table_name, records in data.items():
    df = pd.DataFrame(records)
    output_path = os.path.join("data", f"{table_name}.csv")
    df.to_csv(output_path, index=False)
    print(f"Saved {output_path}")
