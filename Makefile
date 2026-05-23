export PATH := ./node_modules/.bin:$(PATH)

.PHONY: dev db:migrate db:seed lint test clean

dev:
	docker compose up --build

db:migrate:
	npm run db:migrate

db:seed:
	npm run db:seed

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

clean:
	docker compose down --volumes --remove-orphans
