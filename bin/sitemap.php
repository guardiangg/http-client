<?php

if ($argc < 4) {
    echo 'Missing dsn, username or password' . PHP_EOL;
    echo 'php sitemap.php <dsn> <username> <password> [basedir]' . PHP_EOL;
    exit;
}

try {
    $dbh = new PDO($argv[1], $argv[2], $argv[3]);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage() . PHP_EOL;
    exit;
}

$basedir = $argc == 5 ? $argv[4] : __DIR__;

if (!file_exists($basedir)) {
    echo 'basedir "' . $basedir . '" does not exist' . PHP_EOL;
    exit;
}

$batch = 10000;
$outdir = $basedir . '/profiles';

if (!file_exists($outdir)) {
    mkdir($outdir, 0755, true);
}

while (true) {
    $query = "SELECT membership_type, name FROM player_name WHERE indexed = 0 ORDER BY name ASC LIMIT $batch";

    echo $query . PHP_EOL;

    $stmt = $dbh->query($query);

    if ($stmt->rowCount() == 0) {
        break;
    }

    $cacheKey = null;
    $xml = null;

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $key = str_replace(' ', '_', strtolower(substr($row['name'], 0, 3)));

        // only prep a new xml file if the old one is complete
        if ($cacheKey !== $key) {
            // write out previous xml file
            if ($cacheKey !== null) {
                file_put_contents($outdir . '/' . $cacheKey . '.xml', $xml->asXML());
            }

            $filename = $outdir . '/' . $key . '.xml';
            if (file_exists($filename)) {
                $xml = simplexml_load_file($filename);
            } else {
                $xml = new SimpleXMLElement('<urlset/>');
                $xml->addAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
            }

            $cacheKey = $key;
        }

        $url = $xml->addChild('url');
        $url->addChild('loc', 'https://guardian.gg/en/profile/' . $row['membership_type'] . '/' . str_replace('+', '%20', urlencode($row['name'])));
        $url->addChild('changefreq', 'always');

        $dbh->exec("UPDATE player_name SET indexed = 1 WHERE name = '{$row['name']}'");
    }
}

$files = glob($outdir . '/*.xml');
$xml = new SimpleXMLElement('<sitemapindex/>');
$xml->addAttribute('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

foreach ($files as $file) {
    $relative = str_replace($basedir, '', $file);

    $sitemap = $xml->addChild('sitemap');
    $sitemap->addChild('loc', 'https://guardian.gg/sitemap' . $relative);
    $sitemap->addChild('lastmod', date('c', filemtime($file)));
}

$out = $xml->asXML();

file_put_contents($basedir . '/sitemap.xml', $out);