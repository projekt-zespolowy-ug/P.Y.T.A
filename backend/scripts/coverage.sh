#!/bin/bash

if ! poetry run coverage run -m pytest; then
	exit 1
fi

poetry run coverage report -m
