    
   <div class="container-fluid">
		    <div class="row-fluid">
                <div class="span3"> 
				
					<!--<img src="<?php echo base_url().'assets/smileys/lap_cretin.jpg'; ?>" class="profil_chiz img-polaroid"> -->
					<div class="input-append show_me_search" style="padding-top:10px;display:none;">
					   <input class="input-xlarge watermark_search wiper" type="text" placeholder="<?php echo $this->lang->line('form_search'); ?>"><button class="btn btn-primary watermark_search_valid" type="button"><i class="icon-search icon-white"> </i></button>
				    </div>				
				</div>
                
				<div class="span9">
				<ul class="nav nav-pills">
				        
						<li><a href="#" class="random bulle hide_list_mobil" data-placement="top" title="<?php echo $this->lang->line('bulle_radom_wiki');?>"><span class="label label-info jambo" > <?php echo $this->lang->line('form_random'); ?> <i class="icon-random icon-white"></i></span></a></li>
					    
						<!-- <li class="cacher"><a href="<?php echo site_url().'/search/search_wiki/historic/'; ?>" class="historic"><span class="label label-info karma"><?php echo $this->lang->line('form_historic');?> !</span></a></li> -->
					    
						<!--<li class="cacher"><a href="#" class="aspirated" category="<?php echo $this->lang->line('form_category');?>" back="<?php echo $this->lang->line('form_back');?>"><span class="label label-important"> <i class="icon-download-alt icon-white"></i> <?php echo $this->lang->line('form_cat_aspire');?> </span></a></li> -->
				
						<li class="special_navi" style="display:none;"><a href="#" class="favorite_wiki bulle" data-placement="top" title="<?php echo $this->lang->line('bulle_fav_article');?>" url_fav="<?php echo site_url().'/wikipedia/wiki/favorite/'; ?>"><span class="label label-info"><span class="fav_count"></span><i class="icon-heart icon-white"></i> <?php echo $this->lang->line('form_share'); ?> </span></a></li>
                        
						<li class="special_navi" style="display:none;"><a href="#" target="_blank" class="print_it bulle" data-placement="top" title="<?php echo $this->lang->line('bulle_print_me');?>"><img src="<?php echo base_url().'assets/smileys/pdf.png'; ?>" ></a></li>
				</ul>
				
				    
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