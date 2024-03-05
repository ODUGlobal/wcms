BUILD_REPO=remote/
COMMIT_MESSAGE=BUILD: $(shell git log -1 --pretty=%B | cat | tr -d "\'\"")

default:
	@echo "Need a target. Pick one of these:"
	@# list the available targets (this cheats a bit)
	@grep '^[a-z]' Makefile | sed 's/:.*$$//' | sort

ci_init:
	test -d /root/.ssh || mkdir /root/.ssh
	chmod 700 /root/.ssh
	cp docker/ci/ci_ssh_config /root/.ssh/config
	chmod 600 /root/.ssh/config
	git config --global user.email "geeks@insidenewcity.com"
	git config --global user.name "CI Bot"

install:
	cp drupal/composer.json .
	COMPOSER_EXIT_ON_PATCH_FAILURE=1 composer install -o --no-dev

clone_artifact:
	until git clone --branch master $(ARTIFACT_REMOTE) $(BUILD_REPO); do :; done

copy_build:
	# assets and patterns to theme from webpack build
	# mv themes/custom/$(THEMENAME)/images themes/custom/$(THEMENAME)/images
	rm -rf themes/custom/$(THEMENAME)/dist && mkdir themes/custom/$(THEMENAME)/dist
	# rm -rf themes/custom/$(THEMENAME)/assets
	rsync -rlDv --delete --exclude=.git --exclude=.gitignore dist/css/ themes/custom/$(THEMENAME)/dist/css
	rsync -rlDv --delete --exclude=.git --exclude=.gitignore dist/components/ themes/custom/$(THEMENAME)/dist/components

	# from composer build
	rsync -rlD --delete --exclude=.git web $(BUILD_REPO)
	rsync -rlD --delete --exclude=.git vendor $(BUILD_REPO)

	# from repo
	rsync -rlDv --delete --exclude=.git --exclude=.gitignore themes/custom $(BUILD_REPO)web/themes/
	rsync -rlDv --delete --exclude=.git modules/custom $(BUILD_REPO)web/modules/

	# config, scripts, etc.
	rsync -rlDv --delete --exclude=.git --exclude=.gitignore drupal/config $(BUILD_REPO)web/sites/default/
	rsync -rlDv --exclude .git deploy/pantheon/ $(BUILD_REPO)
	rsync -rlDv --exclude .git deploy/drupal-settings/ $(BUILD_REPO)web/sites/default/
	rsync -rlDv --delete --exclude .git private $(BUILD_REPO)web/

	# webroot
	rsync -rlDv --exclude .git for_webroot/ $(BUILD_REPO)web/
	rsync -rlDv --delete --exclude .git storybook-static/ $(BUILD_REPO)web/sb/

	# drush seems to need composer
	rsync -rlDv --exclude .git drupal/composer.json $(BUILD_REPO)

build_site: install clone_artifact copy_build

push_test: terminus_auth
	terminus backup:create $(PANTHEON_PROJECT).dev --element=db
	terminus backup:create $(PANTHEON_PROJECT).live --element=db
	cd $(BUILD_REPO) && git add . && git commit -m "$(COMMIT_MESSAGE)" && git push origin master

push_branch:
	cd $(BUILD_REPO) && git checkout -b "$(MULTIDEV_BRANCH)" && git add . && git commit -m "$(COMMIT_MESSAGE)" && git push -fu origin $(MULTIDEV_BRANCH)

terminus_auth:
	@terminus auth:login --machine-token=$(PANTHEON_MACHINE_TOKEN)

test_sync:
	terminus env:deploy $(PANTHEON_PROJECT).test --sync-content --note="DEPLOY: $(COMMIT_MESSAGE)"
	docker/ci/waitforsync $(PANTHEON_PROJECT) test
	terminus drush $(PANTHEON_PROJECT).test -- cr
	terminus drush $(PANTHEON_PROJECT).test -- cim -y
	terminus drush $(PANTHEON_PROJECT).test -- cr
	terminus drush $(PANTHEON_PROJECT).test -- updatedb -y
	terminus drush $(PANTHEON_PROJECT).test -- cr
	# docker/ci/post-issue-note "Deployed to test (https://test-$(PANTHEON_PROJECT).pantheonsite.io/); will deploy to live after running CI testing"

live_sync:
	terminus env:deploy $(PANTHEON_PROJECT).live --note="DEPLOY: $(COMMIT_MESSAGE)"
	docker/ci/waitforsync $(PANTHEON_PROJECT) live
	terminus drush $(PANTHEON_PROJECT).live -- cr
	terminus drush $(PANTHEON_PROJECT).live -- cim -y
	terminus drush $(PANTHEON_PROJECT).live -- cr
	terminus drush $(PANTHEON_PROJECT).live -- updatedb -y
	terminus drush $(PANTHEON_PROJECT).live -- cr
	docker/ci/post-issue-note "Deployed to live: https://live-$(PANTHEON_PROJECT).pantheonsite.io/"

branch_sync:
	terminus multidev:list $(PANTHEON_PROJECT) | grep -q $(MULTIDEV_BRANCH) && docker/ci/waitforsync $(PANTHEON_PROJECT) $(MULTIDEV_BRANCH) || terminus multidev:create $(PANTHEON_PROJECT).live $(MULTIDEV_BRANCH)
	terminus drush $(PANTHEON_PROJECT).$(MULTIDEV_BRANCH) -- cr
	terminus drush $(PANTHEON_PROJECT).$(MULTIDEV_BRANCH) -- cim -y
	terminus drush $(PANTHEON_PROJECT).$(MULTIDEV_BRANCH) -- cr
	terminus drush $(PANTHEON_PROJECT).$(MULTIDEV_BRANCH) -- updatedb -y
	terminus drush $(PANTHEON_PROJECT).$(MULTIDEV_BRANCH) -- cr
	docker/ci/post-issue-note "Deployed to multidev branch $(MULTIDEV_BRANCH): https:://$(MULTIDEV_BRANCH)-$(PANTHEON_PROJECT).pantheonsite.io/"

create_artifact:
	rm -rf drupal_build
	mv $(BUILD_REPO) drupal_build
	rm -rf drupal_build/.git

deploy_test: terminus_auth test_sync

deploy_live: terminus_auth live_sync

deploy_multidev: terminus_auth branch_sync
