.PHONY: help serve dev test integrity syntax smoke security clean

PORT ?= 8080

help: ## Show available commands
	@echo "Furkan SARICA Portfolio - DevOps & Local Development Tooling"
	@echo "=========================================================="
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

serve: ## Launch local development server
	@echo "Serving at http://localhost:$(PORT)..."
	python3 -m http.server $(PORT)

dev: serve ## Alias for serve

test: ## Bütünlük, syntax ve browser smoke testlerini çalıştır
	@npm test

integrity: ## Mevcut bütünlük ve secret taramasını çalıştır
	@python3 scripts/verify-integrity.py

syntax: ## HTML ve JavaScript syntax kontrolünü çalıştır
	@python3 scripts/verify-javascript.py

smoke: ## Masaüstü ve mobil browser smoke testini çalıştır
	@npm run test:smoke

security: ## Run DevSecOps zero-credential secret scan
	@npm run security:scan

clean: ## Clean up any temporary or cache artifacts
	@find . -name "*.pyc" -delete
	@find . -name "__pycache__" -delete
	@echo "Clean completed."
