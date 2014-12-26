$(document).ready(function(){

     //ce fichier s'occupe de la recherche

        $('.watermark_search_valid').unbind('click');

        $('.watermark_search').unbind('focus');

		//C'est ici qu'on lis le contenu de rechercher en appuyant sur la touche "entré" pour traiter
		$('.watermark_search').focus(function() {

		    $('.watermark_search').unbind('keyup');

		    
		    //On fait le focus sur la vrai recherche 
           $('.begoo').val($('watermark_search').val());			
			
			$('.watermark_search').keyup(function(evenement){ 

				wipe_val();
			
			// Si evenement.which existe, codeTouche vaut celui-ci.
				 // Sinon codeTouche vaut evenement.keyCode.
                var codeTouche = evenement.which || evenement.keyCode;
               
			    if(codeTouche==13)//On lance la recherche si on appui sur la touche Entré
				{	
                  $('.watermark_search_valid').click();		   
			    }
            });
			
	     return false;	 
        });



          //Pour le focus sur Begoo
    $('.begoo').focus(function(){

    	 $('.begoo').unbind('keyup');

        $('.begoo').keyup(function(evenement){

        	wipe_val();

 
           //On fait le focus sur la vrai recherche 
           $('.watermark_search').val($('.begoo').val());

           // Si evenement.which existe, codeTouche vaut celui-ci.
				 // Sinon codeTouche vaut evenement.keyCode.
                var codeTouche = evenement.which || evenement.keyCode;

                if(codeTouche==13)//On lance la recherche si on appui sur la touche Entré
				{	
                  $('.watermark_search_valid').click();	  
			    }   
        })  
    })


    $('.begoo_click').click(function(){

    	$('.watermark_search_valid').click();
    })



    //This function wipe any value typed to the search engine if the app is offline
    function wipe_val(){

    	if(window.kwiki_inline=='off'){

    		$('.wiper').val('');

    		$('.wiper').attr('placeholder',$('.offline_app').attr('message'));
    	}
    }
		
		
		
		//C'est ici qu'on lit contenu de rechercher en appuyant sur recherche pour traiter
		$('.watermark_search_valid').click(function() {	 

						    
			if($.trim($('.watermark_search').val())!=='')
			{
				var chaine = $(".watermark_search").val().toLowerCase();

				if(chaine.length <= 2 ){

                    window.notificate_it($('.notif_search').attr('short'),'error','bottomRight');//ON affiche le msg d'échec
				}
				else{

					//On affiche certains menu cachés
					$('.install').fadeIn();

					$('.begoo').blur();

                        var form_data = {string: chaine};

						//On affiche la box pour patienter
                        $('#info_msg_wait').html($('#Please_wait').html()).fadeIn();
					   
				        $.ajax({ 

                         url: $('#get_API').attr('api_search'),

                         type: 'POST',

                         async : true,

						 dataType:"json",

						 error: function(e){

						 	           $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter

						 	           console.log(e);},

                         data: form_data,

                         success: function(papi) { 
                         	            if(window.device=='mobile'){

                         	            	window.hide_page();
                         	            }

									  //regardons si on a un résultat
										//sinon
										    if(papi.statu =='fail')
											{
										      //on affiche le message d'erreur
											  $('.liste').html('<div class="alert alert-block"> '+papi.result+' </div>');
											}
											
										//si oui
										    if(papi.statu =='success')
											{ 
											    //We look if there is a result on wikipedia or on Gutenberg
											    var wikipedia_result = $.trim(papi.wikipedia.header.toLowerCase()).split(' ');
											    var gutenberg_result = $.trim(papi.gutenberg.header.toLowerCase()).split(' ');


                                                var nav_wikipedia     = '<li class="active"><a href="#tab1" data-toggle="tab"><i class="icon-globe"></i> '+$('.result_label').attr('wikipedia')+'</a></li>';
                                                var nav_gutenberg     = '<li><a href="#tab2" data-toggle="tab"><i class="icon-book"></i> '+$('.result_label').attr('library')+'</a></li>';
                                                var content_wikipedia = '<div class="tab-pane active tab_wikipedia" id="tab1"><ul class="nav nav-list bs-docs-sidenav liste_click wikipedia" counter="50"><li class="nav-header"><i class="icon-globe icon-white"></i> '+$('.resultat').attr('message')+': <span class="badge badge-success header_result">'+papi.wikipedia.header+'</span></li></ul><button class="btn btn-info plus_wiki_wikipedia" type="button"><i class="icon-plus icon-white"></i></button></div>';
                                                var content_gutenberg = '<div class="tab-pane tab_gutenberg" id="tab2"><ul class="nav nav-list bs-docs-sidenav liste_click gutenberg" type="gutenberg" counter="50"><li class="nav-header"><i class="icon-book icon-white"></i> '+$('.resultat').attr('message')+': <span class="badge badge-success header_result">'+papi.gutenberg.header+'</span></li></ul><button class="btn btn-info plus_wiki_gutenberg" type="button"><i class="icon-plus icon-white"></i></button></div>';

                                                var all_list = nav_wikipedia+nav_gutenberg;
                                                var all_content = content_wikipedia+content_gutenberg;
												
												$('.liste').html('<div class="tabbable"><ul class="nav nav-tabs">'+all_list+'</ul><div class="tab-content">'+all_content+'</div></div>');
                                                
                                                if(wikipedia_result[0]=='no'){
                                                    
                                                    $('.tab_wikipedia').html('<div class="alert alert-error">'+papi.wikipedia.header+'</div>');  
											    }

											    if(gutenberg_result[0]=='no'){ 
                                                    
                                                    $('.tab_gutenberg').html('<div class="alert alert-error">'+papi.gutenberg.header+'</div>');  
											    } 

										        $('.stock_engine_wikipedia').html(papi.wikipedia.result);//ON met le résultal dans un div
										        $('.stock_engine_gutenberg').html(papi.gutenberg.result);//ON met le résultal dans un div

												$('.wikipedia').append($('.stock_engine_wikipedia .results ul').html()).fadeIn('slow');//On extrait du résultat ce qui nous interesse
												$('.gutenberg').append($('.stock_engine_gutenberg .results ul').html()).fadeIn('slow');//On extrait du résultat ce qui nous interesse

												$('.stock_engine_wikipedia').html('');//On efface le contenu de ce div pour économiser la mémoire de l'user
												$('.stock_engine_gutenberg').html('');//On efface le contenu de ce div pour économiser la mémoire de l'user

                                                
                                                  //The wikipedia pagination
												$('.stock_engine_wikipedia').html(papi.wikipedia.footer);//ON met les pagination des resultats

												var page_resultat_wikipedia = $('.stock_engine_wikipedia .footer li a').length;

												//Stockage des url des pages de resultat
												window.nbre_page_resultat_wikipedia = new Array();
												
												for(i=0;i<page_resultat_wikipedia;i++){

                                                    window.nbre_page_resultat_wikipedia.push($('.stock_engine_wikipedia .footer li a')[i].href);

                                                    if(i==page_resultat_wikipedia-1){
                                                    	
                                                    	$('.stock_engine_wikipedia').html('');//O efface le contenu de ce div pour économiser la mémoire de l'user

                                                    	window.nbre_page_resultat_actuel_wikipedia = 2;
                                                    }
												} 


												  //The gutenberg pagination
												$('.stock_engine_gutenberg').html(papi.gutenberg.footer);//ON met les pagination des resultats

												var page_resultat_gutenberg = $('.stock_engine_gutenberg .footer li a').length;

												//Stockage des url des pages de resultat
												window.nbre_page_resultat_gutenberg = new Array();
												
												for(i=0;i<page_resultat_gutenberg;i++){

                                                    window.nbre_page_resultat_gutenberg.push($('.stock_engine_gutenberg .footer li a')[i].href);

                                                    if(i==page_resultat_gutenberg-1){
                                                    	
                                                    	$('.stock_engine_gutenberg').html('');//O efface le contenu de ce div pour économiser la mémoire de l'user

                                                    	window.nbre_page_resultat_actuel_gutenberg = 2;
                                                    }
												} 
		

												$(document).ready(function(){

                                                    window.click_by_url();//Gestion des clicks des articles
                                                    //$(window).scrollTop($(document).height());	
												});					                         						                         
											}
                                 
                                 $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 		 
								}
                            });
                    }
			}			
            return false;
        });
		
});

	