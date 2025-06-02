# docker helper commands
# NOTE: MAKE SURE TO RUN MAKE COMMANDS FROM THE ROOT DIRECTORY OR IT WONT WORK

DB_CONTAINER=factori-db
DB_USER=postgres
DB_NAME=factori-db

# go into a psql shell inside the container
psql:
	docker exec -it $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker logs -f $(DB_CONTAINER)

# wipe and bring up containers again
reset:
	docker compose down -v
	docker volume prune -f
	docker compose up -d

# run a sql script (from the different dev directories), ask Arsh if you need help or have questions on how to do do this.
# but the basic idea is to run: "make run-dev script=dev/my_script.sql"
# that command will (hopefully) run the sql script specified using "sript="
run-dev:
	@echo "Running script: ${script}"
	cat ${script} | docker exec -i $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME)

# run all *.sql in sql/dev
run-dev-all:
	@echo "Running all scripts in dev..."
	@for f in $(shell find sql/dev -type f -name '*.sql' | sort); do \
		echo "⮕ $$f"; \
		cat $$f | docker exec -i $(DB_CONTAINER) \
			psql -U $(DB_USER) -d $(DB_NAME); \
	done
	@echo "finished"

# given a common directory and a string parsable as a list of (space separated) sql files, inserts the common directory to all sql files and runs them
# e.g. make run-dev-scripts scripts="01_schema.sql 02_insert_materials.sql 03_insert_material_attributes.sql" common_dir="./sql/dev"
# will first run /sql/dev/01_schema.sql, then the second, and so on
run-dev-scripts:
	@for script in $(scripts); do \
		if [[ "$$script" == */* ]]; then \
            script_path="$$script"; \
        else \
            script_path="$(common_dir)/$$script"; \
        fi; \
        echo "Running script: $$script_path"; \
        cat $$script_path | docker exec -i $(DB_CONTAINER) psql -U $(DB_USER) -d $(DB_NAME); \
    done

# run the FastAPI backend development server on port 8000
run-backend:
	@echo "Starting backend server with Uvicorn..."
	cd backend && source .venv/Scripts/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# install backend dependencies on pip
install-backend:
	@echo "Installing backend dependencies..."
	cd backend && python -m venv .venv && source .venv/Scripts/activate && pip install -r requirements.txt

.PHONY: format

format:
	@echo "Running formatters..."
	pre-commit run black --all-files
	pre-commit run ruff --all-files
	pre-commit run prettier --all-files
	@echo "Formatting complete."

# A more concise way to run all hooks (including formatters and any other linters)
# You might prefer this if you want everything to run.
# If you only want to run formatters, the specific calls above are better.
format-all-hooks:
	@echo "Running all pre-commit hooks on all files..."
	pre-commit run --all-files
	@echo "All hooks run."
