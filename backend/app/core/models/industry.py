from app.core.models.base_table import BaseTable


class Industry(BaseTable, table=True):
	name: str
