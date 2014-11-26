<?php

$f3 = require('lib/base.php');

$f3->set('DEBUG',1);

if ((float)PCRE_VERSION < 7.9)
  trigger_error('PCRE version is out of date');

$f3->config('config.ini');

$f3->route('GET /',
  function ($f3) {
    $f3->set('content', 'content.htm');
    $f3->set('kbd', 'kbd.htm');
    $version_number = 0;
    exec('git rev-list HEAD | wc -l',$version_number);
    $f3->set('version','0.1.'.$version_number[0]);
    exec("git log -1 --pretty=format:'%ci'",$last_update);
    $f3->set('last_update',$last_update[0]);
    echo View::instance()->render('layout.htm');
  }
);

$f3->route('GET /about',
    function() {
        echo 'Donations go to a local charity... us!';
    }
);

$f3->route('GET /img/@file',
    function($f3, $args) {
      $img = new Image('img/'.$args['file']);
      //$img->resize( 20, 20, true, true );
      $img->render();
    }
);

$f3->route('GET /minify/@type',
  function ($f3, $args) {
    $f3->set('UI', $f3->get('UI') . $args['type'] . '/');
    echo Web::instance()->minify($_GET['files']);
  },
  3600 * 24
);

$f3->run();
