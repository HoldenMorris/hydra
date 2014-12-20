<?php

$f3 = require('lib/base.php');

if ((float)PCRE_VERSION < 7.9)
  trigger_error('PCRE version is out of date');

$f3->config('config.ini');
$version_number = 0;
exec('git rev-list HEAD | wc -l',$version_number);
$f3->set('version','0.2.'.$version_number[0].'.'.microtime());
exec("git log -1 --pretty=format:'%ci'",$last_update);
$f3->set('last_update',$last_update[0]);

$f3->route('GET /',
  function ($f3) {
    $f3->set('content', 'content.htm');
    $f3->set('kbd', 'kbd.htm');
    echo View::instance()->render('layout.htm');
  }
);

$f3->route('GET /rss',
  function ($f3) {
    $f3->reroute('/rss/all');
  }
);

$f3->route('GET /rss/*',
  function ($f3, $args) {

    $items = array();
    $id = isset($args[1])?trim(strtolower($args[1])):'all';

    if($id=='all' || $id=='item1'){
      $lines = array();
      exec('service transmission-daemon status', $lines, $return_var );
      $title = 'Transmission Status: ['.$return_var.'] ';
      foreach($lines as $line){
        $title .= ' '.$line;
      }
      $items[] = array(
        '_id' => 'item1',
        'title' => $title,
        'content' => '',
        'date' => date("D, d M Y H:i:s O")
      );
    };

    if($id=='all' || $id=='item2'){
      $lines = array();
      exec('sudo -u holden -p hotdogflimflam /etc/init.d/sickbeard status', $lines, $return_var );
      $title = 'Sickbeard Status: ['.$return_var.'] ';
      foreach($lines as $line){
        $title .= ' '.$line;
      }
      $items[] = array(
        '_id' => 'item2',
        'title' => $title,
        'content' => '',
        'date' => date("D, d M Y H:i:s O")
      );
    }

    /*
    mysql start/running,
    nmbd start/running,
    smbd start/running,

    */

    $f3->set('items', $items);
    echo View::instance()->render('rss_feed.htm', 'application/rss+xml', NULL, 0 );
  }
);

$f3->route('GET /dh',
    function($f3) {
      require('lib/cypher/diffie-hellman-gmp.php');
      $dh_obj = genDiffieHellmanMsg(256);
      $f3->set('dh_gen', strtoupper($dh_obj['gen']));
      $f3->set('dh_mod', strtoupper($dh_obj['mod']));
      $f3->set('dh_A',   strtoupper($dh_obj['msg']));
      $f3->set('dh_rnd', getSecureRandomDH(128));
      new Session();
      $f3->set('SESSION.dh_obj',json_encode($dh_obj));
      echo View::instance()->render('dh.htm');
    }
);

$f3->route('GET /dh/@B',
    function($f3, $args) {
      require('lib/cypher/diffie-hellman-gmp.php');
      new Session();
      $dh_obj = json_decode($f3->get('SESSION.dh_obj'),true);
      $a_sec = strtoupper(calcDiffieHellmanSecret( $args['B'], $dh_obj['exp'], $dh_obj['mod'] ));
      $f3->set('SESSION.a_sec',$a_sec);
      echo $a_sec;
    }
);

$f3->route('POST /xxtea [ajax]',
    function($f3) {
      require_once("lib/cypher/xxtea.php");
      new Session();
      $a_sec = $f3->get('SESSION.a_sec');
      $data = base64_decode($f3->get('POST.data'));
      $decrypt_data = xxtea_decrypt($data, $a_sec).'- rx';
      $encrypt_data = xxtea_encrypt($decrypt_data, $a_sec);
      echo base64_encode($encrypt_data);
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

/**
 * Process api commands
 */
$f3->route('POST /api [ajax]',
    function($f3) {
      $cmd = trim(strtolower($f3->get('POST.cmd')));
      switch ($cmd){
        case 'help':
          $response = 'Help is at hand!';
          break;
        case 'ver':
          $response = 'Ver: '.$f3->get('version');
          break;
        case 'upd':
          $response = 'Last update: '.$f3->get('last_update');
          break;
        case 'whoami':
          $response = exec('whoami');
          break;
        case 'll':
          exec('ls -l', $lines, $return_var );
          $response = '<p class="cmd">&gt;&nbsp;'.$cmd.'</p>';
          foreach($lines as $line){
            $response .= '<p>'.$line.'</p>';
          }
          break;
        default:
          $response = $cmd.': command not found';
      }
      $json = array('msg'=>$response);
      $f3->set('json',json_encode($json));
      echo View::instance()->render('json.htm', 'application/json', NULL, 0 ); // cache for 0 seconds
    }
);

$f3->run();
