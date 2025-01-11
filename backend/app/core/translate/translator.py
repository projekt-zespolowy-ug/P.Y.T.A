import importlib

from typing import Any


class Translator:
	_instances: dict[str, "Translator"] = {}

	def __new__(cls, lang: str) -> "Translator":
		if lang not in cls._instances:
			cls._instances[lang] = super().__new__(cls)
		return cls._instances[lang]

	def __init__(self, lang: str):
		self.lang = lang

	def t(self, key: str, **kwargs: dict[str, Any]) -> str:
		file_key, *translation_keys = key.split(".")
		locale_module = importlib.import_module(f"app.lang.{self.lang}.{file_key}")
		translation = locale_module.locale

		for translation_key in translation_keys:
			translation = translation.get(translation_key, None)
			if translation is None:
				return f"Key {key} not found in {self.lang} locale"

		if kwargs:
			translation = translation.format(**kwargs)
		return str(translation)
