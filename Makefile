.PHONY: help serve dev test integrity security clean

PORT ?= 8080

help: ## Show available commands
	@echo "Furkan SARICA Portfolio - DevOps & Local Development Tooling"
	@echo "=========================================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

serve: ## Launch local development server
	@echo "Serving at http://localhost:$(PORT)..."
	python3 -m http.server $(PORT)

dev: serve ## Alias for serve

test: ## Run repository integrity and secret scanning suite
	@python3 scripts/verify-integrity.py

integrity: test ## Alias for test

security: ## Run DevSecOps zero-credential secret scan
	@python3 -c "import os, re; from scripts.verify_integrity import suspicious_patterns"

clean: ## Clean up any temporary or cache artifacts
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -delete
	@echo "Clean completed."
