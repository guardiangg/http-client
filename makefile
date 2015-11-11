all: build deploy

build:
	gulp build --prod

deploy:
	ssh deploy@web01.guardian.gg mkdir /tmp/http-client
	scp -rp build/* deploy@web01.guardian.gg:/tmp/http-client
	ssh deploy@web01.guardian.gg 'rm -rf /var/www/guardian.gg/* && mv /tmp/http-client/* /var/www/guardian.gg/'

clean:
	rm -rf build/
	rm -rf /tmp/http-client
