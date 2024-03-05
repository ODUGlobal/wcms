PANTHEON_PROJECT := $(if $(PANTHEON_PROJECT),$(PANTHEON_PROJECT),$(shell gitlab-variable PANTHEON_PROJECT))
BRANCH=$(shell git rev-parse --abbrev-ref HEAD | sed 's|^.*/||' | cut -c1-11 | tr -d '\-_')
ifeq ($(origin PANTHEON_ENV),undefined)
	ifeq ($(BRANCH),main)
		PANTHEON_ENV=live
	else
		PANTHEON_ENV=$(BRANCH)
	endif
endif
PANTHEON_SITE_ENV=$(PANTHEON_PROJECT).$(PANTHEON_ENV)
DB_SNAPSHOT=/tmp/db.sql
PANTHEON_MACHINE_TOKEN := $(if $(PANTHEON_MACHINE_TOKEN),$(PANTHEON_MACHINE_TOKEN),$(shell gitlab-variable PANTHEON_MACHINE_TOKEN))

default:
	@echo "Need a target. Pick one of these:"
	@# list the available targets (this cheats a bit)
	@grep '^[a-z]' Makefile | sed 's/:.*$$//' | sort

cr:
	drush cr

updatedb: login create_db_backup get_db_backup push_docker_db cr

login:
	@( ( terminus auth:whoami 2>&1 >/dev/null | grep -q "not logged in" ) && terminus auth:login --machine-token=$(PANTHEON_MACHINE_TOKEN) ) || true

create_db_backup:
	terminus backup:create $(PANTHEON_SITE_ENV) --element=db

get_db_backup:
	git config --global --add safe.directory /app
	rm -rf /tmp/db && mkdir /tmp/db
	curl $$(terminus backup:get $(PANTHEON_SITE_ENV) --element=db) | gunzip > $(DB_SNAPSHOT)
	# cd /tmp/db && split-dump db.sql && rm db.sql
	#@# kill sessions table, if it exists locally
	#-echo "SELECT 1 FROM sessions LIMIT 1;" | mysql -h database -u root drupal >/dev/null && cd /tmp/db && rm sessions.sql
	#cd /tmp/db && cat *.sql > $(DB_SNAPSHOT)

push_docker_db:
	mysqldump -h database -u root drupal --add-drop-table --no-data | grep ^DROP | mysql -h database -u root drupal
	cat $(DB_SNAPSHOT) | mysql -h database -u root drupal
