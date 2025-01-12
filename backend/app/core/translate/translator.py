import importlib

from typing import Any


class Translator:
	_instances: dict[str, "Translator"] = {}

	def __new__(cls, lang: str, file_key: str) -> "Translator":
		if f"{lang}.{file_key}" not in cls._instances:
			cls._instances[f"{lang}.{file_key}"] = super().__new__(cls)
		return cls._instances[f"{lang}.{file_key}"]

	def __init__(self, lang: str, file_key: str) -> None:
		self.lang = lang
		self.file_key = file_key
		self.locale_module = importlib.import_module(f"app.lang.{self.lang}.{self.file_key}")

	def t(self, key: str, **kwargs: dict[str, Any]) -> str:
		translation_keys = key.split(".")
		translation = self.locale_module.locale

		for translation_key in translation_keys:
			translation = translation.get(translation_key, None)
			if translation is None:
				return f"Key {key} not found in {self.lang} locale"

		if kwargs:
			translation = translation.format(**kwargs)
		return str(translation)
