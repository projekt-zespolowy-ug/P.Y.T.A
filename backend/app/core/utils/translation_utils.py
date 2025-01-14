from pathlib import Path


def get_possible_translation_languages() -> list[str]:
	lang_dir = Path("app").joinpath("lang")
	return [folder.name for folder in lang_dir.iterdir() if folder.is_dir()]
