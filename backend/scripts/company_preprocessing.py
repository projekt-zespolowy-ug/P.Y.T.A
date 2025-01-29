from pathlib import Path

import pandas as pd


def main() -> None:
	file_path = Path(__file__).parent.parent / "datasets" / "company.json"

	data = pd.read_json(file_path)

	if "ticker" in data.columns:
		data["ticker"] = data["ticker"].str.upper()

	else:
		print("ticker column not found in the file.")

	if "image_url" in data.columns and "ticker" in data.columns:
		data["image_url"] = (
			"https://raw.githubusercontent.com/davidepalazzo/ticker-logos/refs/heads/main/ticker_icons/"
			+ data["ticker"]
			+ ".png"
		)
	else:
		print("image_url column not found in the file.")

	data = data.replace("", pd.NA).dropna()

	data = data.drop_duplicates(subset="ticker", keep="first")

	output_file_path = Path(__file__).parent.parent / "datasets" / "company.json"

	data.to_json(output_file_path, orient="records", indent=2)
