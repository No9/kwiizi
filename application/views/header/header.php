
<!DOCTYPE html>
<html lang="fr" manifestt="<?php echo base_url();?>manifest/hi.manifestt">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<title>{title}</title>
	
	<link rel="icon" href="<?php echo base_url(); ?>assets/img/favo_icon.png" />
	
	<link href="<?php echo base_url();?>assets/css/bootstrap.min.css" rel="stylesheet">   
	<link href="<?php echo base_url();?>assets/css/bootstrap-responsive.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/jquery-ui.css" rel="stylesheet">
	
    <link type="text/css" href="<?php echo base_url();?>assets/css/jquery.classynotty.css" rel="stylesheet"/>
	
	<link type="text/css" href="<?php echo base_url();?>assets/css/scrollToTop.css" rel="stylesheet"/>
	
	<link type="text/css" href="<?php echo base_url();?>assets/css/boldlight.css" rel="stylesheet"/>	
	<link type="text/css" href="<?php echo base_url();?>assets/css/video.css" rel="stylesheet"/>	
	<link type="text/css" href="<?php echo base_url();?>assets/css/ted.css" rel="stylesheet"/>	
	
    <link href="<?php echo base_url();?>assets/css/begoo.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/jquery.ui.chatbox.css" rel="stylesheet">
	
	
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jquery-ui.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/jstorage.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery/json2.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/node/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/node/peer.js"></script>
	
    <script type="text/javascript" src="<?php echo base_url();?>assets/js/app_socket.js"></script>
	
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/jquery.noty.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/default.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/bottomRight.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/centerLeft.js"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/topCenter.js"></script>
	
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/humane.min.js"></script>

</head>


<body>

<!-- Navbar   
    ================================================== -->
    <div class="navbar navbar-inverse">
    
        <div class="navbar-inner">
            <a class="brand listing one" href="#"><i class="icon-chevron-left"></i> &nbsp;&nbsp;Kwiizi v2.6</a>
            <a class="brand two" href="#"></i>Kwiizi v2.6</a>
            <ul class="nav pull-right">

            	<li class="">
                      <a href="<?php echo site_url().'/wikipedia/wiki'; ?>" class="bulle off_hider" data-placement="bottom" title="home"><i class="icon-home icon-white"></i>  <!-- <span class="lang"><?php echo $this->lang->line('form_home'); ?></span> --></a>
		        </li>
					
                <li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_call_note'); ?>" data-placement="bottom" class="bulle sender_message off_hider"><i class="icon-user icon-white"></i> <!-- <span class="lang"><?php echo $this->lang->line('form_call'); ?></span>--></a>
		        </li>

		        <li class="">
                      <a href="#" title="<?php echo $this->lang->line('form_videotek'); ?>" label="<?php echo $this->lang->line('form_videotek'); ?>" data-placement="bottom" class="bulle off_hider video_click"><i class="icon-youtube-play icon-white"></i> <!-- <span class="lang"><?php echo $this->lang->line('form_videotek'); ?></span>--></a>
		        </li>

		        <li class="">
                    <a href="<?php echo site_url().'/search/search_wiki/historic/'; ?>" data-placement="bottom" class=" bulle historic" title="<?php echo $this->lang->line('form_historic');?> !"><i class="icon-time icon-white"></i> <?php echo $this->lang->line('form_historic');?></a>
		        </li>
            </ul>
        </div>

    </div>
   
						 
		
		<div id="statuMessage" class="alert alert-info ">
		    <button type="button" class="close" data-dismiss="alert">×</button>
			<div id="Message">
			</div>
			
		</div>
		<div id="yann" style="display:none">		
		</div>

	