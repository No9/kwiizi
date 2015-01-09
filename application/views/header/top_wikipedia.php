    
   <div class="container-fluid">
		    <div class="row-fluid">
                <div class="span3"> 
				
					<!--<img src="<?php echo base_url().'assets/smileys/lap_cretin.jpg'; ?>" class="profil_chiz img-polaroid"> -->
					<div class="input-append show_me_search" style="padding-top:10px;display:none;">
					   <input class="input-xlarge watermark_search wiper" type="text" placeholder="<?php echo $this->lang->line('form_search'); ?>"><button class="btn btn-primary watermark_search_valid" type="button"><i class="icon-search icon-white"> </i></button>
				    </div>				
				</div>
                
				<div class="span9">
						
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
            <div class="row-fluid main_container">