    <div class="row">
       
        <div class="col s5 liste side-nav fixed" id="nav-mobile" style="top:0px;position:fixed;" ref="yes"></div>

        <div class="col s7 principal" style="height:500px;">

            <div class="menu_header">
                <!-- Navbar ================================================== -->
                <nav>
                    <div class="nav-wrapper">
                        <a class="brand-logo right listing one" href="#"><i class="icon-chevron-left"></i> &nbsp;&nbsp;Kwiizi v3</a>
                        <a class="brand-logo right two" href="#"></i>Kwiizi v3</a>

                        <div class="input-field col s12">
                            <input id="searcher" type="text" class="input_search" placeholder="">
                            <label for="searcher"><i class="mdi-action-search"></i></label>
                        </div>          
                    </div>
                </nav>

                <div class="fixed-action-btn" style="bottom: 45px; right: 53%;">
                    <a class="btn-floating btn-large red">
                        <i class="large mdi-editor-mode-edit"></i>
                    </a>

                    <ul>
                        <li><a class="btn-floating red"><i class="large mdi-editor-insert-chart"></i></a></li>
                        <li><a class="btn-floating yellow darken-1"><i class="large mdi-editor-format-quote"></i></a></li>
                        <li><a class="btn-floating green"><i class="large mdi-editor-publish"></i></a></li>
                        <li><a class="btn-floating blue"><i class="large mdi-editor-attach-file"></i></a></li>
       
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
   
		        <div id="statuMessage" class="alert alert-info ">
		            <button type="button" class="close" data-dismiss="alert">×</button>
			        <div id="Message">
			        </div>		
		        </div>
		
		        <div id="yann" style="display:none">		
		        </div>
            </div>

            <div class="second_menu">
            	<div class="witch_zim" style="display:none;">
                    <div class="desktop hide-on-med-and-down">
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_wikipedia green" title="<?php echo $this->lang->line('form_wikipedia');?>"><?php echo $this->lang->line('form_wikipedia');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_gutenberg" title="<?php echo $this->lang->line('form_library');?>"><?php echo $this->lang->line('form_library');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_TED" title="<?php echo $this->lang->line('form_videotek');?>"><?php echo $this->lang->line('form_videotek');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_medecine" title="<?php echo $this->lang->line('form_medecine');?>"><?php echo $this->lang->line('form_medecine');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_linux" title="<?php echo $this->lang->line('form_linux');?>"><?php echo $this->lang->line('form_linux');?></a>
                    </div>

                    <div class="tablet hide-on-small-only hide-on-large-only">
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_wikipedia green" title="<?php echo $this->lang->line('form_wikipedia');?>"><?php echo $this->lang->line('form_wikipedia');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_gutenberg" title="<?php echo $this->lang->line('form_library');?>"><?php echo $this->lang->line('form_library');?></a>
                    	<a class="zim_click waves-effect waves-teal btn-flat zim_TED" title="<?php echo $this->lang->line('form_videotek');?>"><?php echo $this->lang->line('form_videotek');?></a>
                    	
                        <!-- Dropdown Trigger -->
                        <a class='dropdown-button waves-effect waves-teal btn-flat' href='#' data-activates='dropdown1'><?php echo $this->lang->line('form_plus');?></a>

                        <!-- Dropdown Structure -->
                        <ul id='dropdown1' class='dropdown-content'>
                            <li><a class="zim_click waves-effect waves-teal zim_medecine" title="<?php echo $this->lang->line('form_medecine');?>"><?php echo $this->lang->line('form_medecine');?></a></li>
                            <li><a class="zim_click waves-effect waves-teal zim_linux" title="<?php echo $this->lang->line('form_linux');?>"><?php echo $this->lang->line('form_linux');?></a></li>
                        </ul>
                    </div>

                    <div class="phone hide-on-med-and-up">
                    	<!-- Dropdown Trigger -->
                        <a class='dropdown-button waves-effect waves-teal btn-flat' href='#' data-activates='dropdown2'><?php echo $this->lang->line('form_plus');?></a>

                        <!-- Dropdown Structure -->
                        <ul id='dropdown2' class='dropdown-content'>
                           <li><a class="zim_click waves-effect waves-teal  zim_wikipedia green" title="<?php echo $this->lang->line('form_wikipedia');?>"><?php echo $this->lang->line('form_wikipedia');?></a></li>
                    	   <li><a class="zim_click waves-effect waves-teal  zim_gutenberg" title="<?php echo $this->lang->line('form_library');?>"><?php echo $this->lang->line('form_library');?></a></li>
                    	   <li><a class="zim_click waves-effect waves-teal  zim_TED" title="<?php echo $this->lang->line('form_videotek');?>"><?php echo $this->lang->line('form_videotek');?></a></li>
                    	   <li><a class="zim_click waves-effect waves-teal  zim_medecine" title="<?php echo $this->lang->line('form_medecine');?>"><?php echo $this->lang->line('form_medecine');?></a></li>
                    	   <li><a class="zim_click waves-effect waves-teal  zim_linux" title="<?php echo $this->lang->line('form_linux');?>"><?php echo $this->lang->line('form_linux');?></a></li>
                        </ul>
                    </div>
            	</div>
                <div class="row">
                    <div class="col s3"> 
				
					    <!--<img src="<?php echo base_url().'assets/smileys/lap_cretin.jpg'; ?>" class="profil_chiz img-polaroid"> -->				
				    </div>
                
				    <div class="col s9">
						
				        <a href="#" class="random bulle hide_list_mobil" data-placement="top" title="<?php echo $this->lang->line('bulle_radom_wiki');?>"><span class="label label-info jambo" > <?php echo $this->lang->line('form_random'); ?> <i class="icon-random icon-white"></i></span></a>
				
				        <ul class="breadcrumb dance_for_me push_liste" style="display:none;">    
                        </ul>
					
					
					    <div class="navigo">
					
					        <span class="look_wiki" page_title="" style="display:none;" if_article="no">0</span><!-- garde l'id de la page wikipedia -->
					
					        <span class="wiki_follow" style="display:none;"></span><!-- dit s'il suit,est suivi ou rien du tout -->
					
					        <span class="wiki_follow_user" url="<?php echo site_url().'/wikipedia/wiki/il_est_ou/'; ?>" style="display:none;"></span><!-- garde l'id de l'user suivi -->
                    
					        <span class="look_wiki_url"  page_consulte="<?php echo site_url().'/wikipedia/wiki/record_article'; ?>"  style="display:none;"></span><!-- garde le préfixe de l'url des articles wikipedia -->
					
				        </div>											
				    </div>
                </div> 
            </div>

            <div class="row main_container">
        	    <div class="contenu_wiki">
		
				    <div class="wiki_title"></div>
				
				    <div class="wiki_content">

					    <div class="parent_begoo" style="padding-top:100px;">
                            <img class="logo_kwiki" style="height:70px;" src="<?php echo base_url(); ?>assets/img/kwiki.png" /><span class="label label-success">Université de Douala </span><br>
                        
			                <div class="alert alert-info" style="width:20%;"><strong><?php echo $this->lang->line('form_term_search'); ?></strong></div>

					    </div>
				    </div>
				
	   
				    <a href="#do_you_nknow" class=" install special_nav critika" data-toggle="modal" data-target="#do_you_nknowLabel" style="display:none;"><span class="label label-info" > <?php echo $this->lang->line('form_do_you'); ?> </span></a>
	            </div>

	            <a href="#top" id="toTop"></a>
            </div>   
        </div>
    </div> 
   