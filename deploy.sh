#!/usr/bin/env sh
rm -r build/
gulp build --prod
ssh deploy@web01.guardian.gg mkdir /tmp/ggg-release
scp -rp build/* deploy@web01.guardian.gg:/tmp/ggg-release
ssh deploy@web01.guardian.gg 'rm -rf /var/www/guardian.gg/* && mv /tmp/ggg-release/* /var/www/guardian.gg/ && rm -r /tmp/ggg-release'
