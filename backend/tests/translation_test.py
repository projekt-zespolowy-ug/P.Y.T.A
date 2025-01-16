from pathlib import Path


def test_missing_translation_files():
	lang_dir = Path("app").joinpath("lang")
	all_paths = lang_dir.glob("[!__]*/[!__]*")
	assert all(
		path.is_file() for path in all_paths
	), f"Missing translation file(s): {[str(p) for p in all_paths if not p.is_file()]}"


def test_missing_translation_keys():  # sourcery skip: no-loop-in-tests
	lang_dir = Path("app").joinpath("lang")
	translation_files = list(lang_dir.glob("[!__]*/*.py"))

	langs = [file.parent.name for file in translation_files]
	files = {file.stem for file in translation_files}

	for file in files:
		keys = set()

		for lang in langs:
			translation = __import__(f"app.lang.{lang}.{file}", fromlist=[""]).locale
			keys.add(len(translation.keys()))
			assert (
				len(keys) == 1
			), f"Missing/Unexpected translation key(s) in {file} for language: '{lang}'"
