$(document).ready(function(){

     //ce fichier s'occupe de la recherche

          //Pour le focus sur Begoo
    $('.input_search').focus(function(){ 

    	$('.input_search').unbind('keyup');

        $('.input_search').keyup(function(evenement){

        	wipe_val();

           // Si evenement.which existe, codeTouche vaut celui-ci.
		   // Sinon codeTouche vaut evenement.keyCode.
                var codeTouche = evenement.which || evenement.keyCode;

                if(codeTouche==13)//On lance la recherche si on appui sur la touche Entré
				{	
                  search_the_string();

                  $('.witch_zim').fadeIn();

                  return false;	  
			    }  
        });

        return false;  	 
    });

    $('.zim_click').click(function  () {
        
        $('.zim_click').removeClass('green');
        $('.zim_click').removeClass('disabled');
        $(this).addClass('green');
        $(this).addClass('disabled');
    })



    //This function wipe any value typed to the search engine if the app is offline
    function wipe_val(){

    	if(window.kwiki_inline=='off'){

    		$('.input_search').val('');

    		$('.input_search').attr('placeholder',$('.offline_app').attr('message'));
    	}
    }
		
		
		
		//C'est ici qu'on lit contenu de rechercher en appuyant sur recherche pour traiter
		function search_the_string() {	
						    
			if($.trim($('.input_search').val())!=='')
			{
				var chaine = $(".input_search").val().toLowerCase();

				if(chaine.length <= 2 ){

                    window.notificate_it($('.notif_search').attr('short'),'error','bottomRight');//ON affiche le msg d'échec
				}
				else{

					//On affiche certains menu cachés
					$('.install').fadeIn();

                    window.search_term = chaine;
                    
                    if(window.zim_tab){
                        go_search(chaine,window.zim_tab,false);

                    }else{

                        go_search(chaine,'wikipedia',false);
                        $('.zim_click').removeClass('green');
                        $('.zim_click').removeClass('disabled');
                        $('.zim_wikipedia').addClass('green');
                        $('.zim_wikipedia').addClass('disabled');     
                    }
					
                }
			}
        }


       
       //Make the search
        function go_search(string,zim,type_zim) { 
       	   
       	  var form_data = {string:string,zim:zim,type_zim:type_zim};

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

                        var result = no_result(papi,zim);//We display message if there is no zim

                        if(result==true){

                            switch (papi.zim){

                                case 'wikipedia':
                                list_wikipedia(papi);
                                break;

                                case 'gutenberg':
                                list_gutenberg(papi);
                                break;

                                case 'TED':
                                list_TED(papi);
                                break;

                                case 'ubuntu':
                                list_ubuntu(papi);
                                break;

                                case 'medecine':
                                list_medecine(papi);
                                break;
                            }
                        } 	
                    }
            });
        }



        function list_wikipedia (papi) {
             

        	//We get image of article in a json file
        	$.getJSON($('#url_json').attr('url')+'image.json?'+ new Date().getTime(), function(data) { 

                $('.stock_engine_wikipedia').html(papi.result);//ON met le résultal dans un div

                var nber_li = $('.stock_engine_wikipedia li').length;

                $('.liste').html('<div class="receive_list collection"></div>');

                for(i=0;i<nber_li;i++){

                	var src_image = data.image.page_url.indexOf($('.stock_engine_wikipedia li a').eq(i).text());

            	    if(src_image==-1){

            		    //We display list without image
            		    var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_wikipedia li a').eq(i).html()+'" href="'+$('.stock_engine_wikipedia li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
            		    var b = '<span class="titre_article">'+$('.stock_engine_wikipedia li a').eq(i).html()+'</span><br>';
            		    var c = '<span class="cite">'+$('.stock_engine_wikipedia li cite').eq(i).html()+'</span>';
            		    var d = '</a>';
            		    $('.receive_list').append(a+b+c+d);

            	    }else{
            		    //With image
            		    var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_wikipedia li a').eq(i).html()+'" href="'+$('.stock_engine_wikipedia li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
            		    var b = '<span><img style="float:left;margin-right:5px;height:100%;" src="'+data.image.src[src_image]+'">';
            		    var c = '<span class="titre_article">'+$('.stock_engine_wikipedia li a').eq(i).html()+'</span><br>';
            		    var d = '<span class="cite">'+$('.stock_engine_wikipedia li cite').eq(i).html()+'</span></span>';
            		    var e = '</a>';
            		   $('.receive_list').append(a+b+c+d+e);
            	    }

            	    if(i==nber_li-1){
                        
                        $(document).ready(function(){

                            window.click_by_url();//Gestion des clicks des articles
                            //$(window).scrollTop($(document).height());

                            $('.stock_engine_wikipedia').html('');//Wipe the temporally container

                            $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter	
					    });
            	    }
                }
            });  
        }



        function list_gutenberg (papi) {
            
            $('.stock_engine_gutenberg').html(papi.result);//ON met le résultal dans un div

            var nber_li = $('.stock_engine_gutenberg li').length;

            $('.liste').html('<div class="receive_list collection"></div>');

            for(i=0;i<nber_li;i++){

                    //We display list without image
                    var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_gutenberg li a').eq(i).html()+'" href="'+$('.stock_engine_gutenberg li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
                    var b = '<span class="titre_article">'+$('.stock_engine_gutenberg li a').eq(i).html()+'</span><br>';
                    var c = '<span class="cite">'+$('.stock_engine_gutenberg li cite').eq(i).html()+'</span>';
                    var d = '</a>';
                    $('.receive_list').append(a+b+c+d);
               

                if(i==nber_li-1){
                        
                        $(document).ready(function(){

                            window.click_by_url();//Gestion des clicks des articles
                            //$(window).scrollTop($(document).height());

                            $('.stock_engine_gutenberg').html('');//Wipe the temporally container

                            $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 
                        });
                }
            }   
        }


        function list_TED (papi) {

            var list_zim = papi.result; 
            
            window.list_find = [];
            window.zim_ted   = [];

            var string = window.search_term.toLowerCase();

            $('.liste').html('<div class="receive_list collection"></div>');
            $('.receive_list').html('<div class="display_no z-depth-3 card-panel red lighten-2"><span class="white-text text-darken-2"><i class="small mdi-alert-error"></i>'+$('.no_result').attr('message')+'</span></div>');

             
            for (var i = 0; i < list_zim.length; i++) {

                var zim_file = list_zim[i].split('#');

                zim_file = zim_file[1];

                $.ajax({ 

                    url: $('#url_json').attr('url')+'TED/'+zim_file+'.json?'+ new Date().getTime(),

                    type: 'POST',

                    async : false,

                    dataType:"json",

                    error: function(e){

                            $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter

                            console.log(e);},

                    success: function(data) {

                           //On fouille le terme
                        var regex = new RegExp(string, "i");
                        var counter = 0;

                        //We record this name of zim fie before get inside the $.each
                        window.this_zim = zim_file;

                        $.each(data, function(key, entry){ 
                                                
                            counter++;

                            var this_entry_speaker = entry.speaker.toLowerCase();
                            var this_entry_title = entry.title.toLowerCase();
                            var this_entry_description = entry.description.toLowerCase();

                            if((this_entry_speaker.search(regex) != -1) || (this_entry_title.search(regex) != -1) || (this_entry_description.search(regex) != -1)) {
                          
                                list_video (entry,window.this_zim);                               
                            }  
                        });
                    }
                });
                
               
                if(i==list_zim.length-1){ 

                    window.click_by_url();
                }    
            }
        }


        function list_video (entry,zim_file) {

            $('.display_no').hide();

            var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+entry.title+'" href="'+entry.id+'" zim="TED" zim_file="'+zim_file+'">';
            var b = '<span><img style="float:left;margin-right:5px;height:100%;" src="'+$('.hoster').attr('host_wiki')+'/'+zim_file+'/I/'+entry.id+'/thumbnail.jpg">';
            var c = '<span class="titre_article">'+entry.title+' <i>('+entry.speaker+')</i></span><br>';
            var d = '<span class="cite">'+entry.description+'</span></span>';
            var e = '</a>';
            $('.receive_list').append(a+b+c+d+e);
        }



         function list_ubuntu (papi) {

            $('.stock_engine_wikipedia').html(papi.result);//ON met le résultal dans un div

            var nber_li = $('.stock_engine_wikipedia li').length;

            $('.liste').html('<div class="receive_list collection"></div>');

            for(i=0;i<nber_li;i++){

                var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_wikipedia li a').eq(i).html()+'" href="'+$('.stock_engine_wikipedia li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
                var b = '<span class="titre_article">'+$('.stock_engine_wikipedia li a').eq(i).html()+'</span><br>';
                var c = '<span class="cite">'+$('.stock_engine_wikipedia li cite').eq(i).html()+'</span>';
                var d = '</a>';
                
                $('.receive_list').append(a+b+c+d);

                if(i==nber_li-1){
                        
                    $(document).ready(function(){

                        window.click_by_url();//Gestion des clicks des articles
                        //$(window).scrollTop($(document).height());

                        $('.stock_engine_wikipedia').html('');//Wipe the temporally container

                        $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 
                    });
                }
            }          
        }



        function list_medecine (papi) {

            //We get image of article in a json file
            $.getJSON($('#url_json').attr('url')+'image_medecine.json?'+ new Date().getTime(), function(data) { 

                $('.stock_engine_wikipedia').html(papi.result);//ON met le résultal dans un div

                var nber_li = $('.stock_engine_wikipedia li').length;

                $('.liste').html('<div class="receive_list collection"></div>');

                for(i=0;i<nber_li;i++){

                    var src_image = data.image.page_url.indexOf($('.stock_engine_wikipedia li a').eq(i).text());

                    if(src_image==-1){

                        //We display list without image
                        var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_wikipedia li a').eq(i).html()+'" href="'+$('.stock_engine_wikipedia li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
                        var b = '<span class="titre_article">'+$('.stock_engine_wikipedia li a').eq(i).html()+'</span><br>';
                        var c = '<span class="cite">'+$('.stock_engine_wikipedia li cite').eq(i).html()+'</span>';
                        var d = '</a>';
                        $('.receive_list').append(a+b+c+d);

                    }else{
                        //With image
                        var a ='<a class="list_link collection-item waves-effect waves-teal" title="'+$('.stock_engine_wikipedia li a').eq(i).html()+'" href="'+$('.stock_engine_wikipedia li a').eq(i).attr('href')+'" zim="'+papi.zim+'" zim_file="'+papi.zim_file+'">';
                        var b = '<span><img style="float:left;margin-right:5px;height:100%;" src="'+data.image.src[src_image]+'">';
                        var c = '<span class="titre_article">'+$('.stock_engine_wikipedia li a').eq(i).html()+'</span><br>';
                        var d = '<span class="cite">'+$('.stock_engine_wikipedia li cite').eq(i).html()+'</span></span>';
                        var e = '</a>';
                       $('.receive_list').append(a+b+c+d+e);
                    }

                    if(i==nber_li-1){
                        
                        $(document).ready(function(){

                            window.click_by_url();//Gestion des clicks des articles
                            //$(window).scrollTop($(document).height());

                            $('.stock_engine_wikipedia').html('');//Wipe the temporally container

                            $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter 
                        });
                    }
                }
            });  
        }




        function no_result (papi,zim) {

            if(zim=='TED'){ 
                return true;
              //action
            }else{
                var result = $.trim(papi.header);
                result = result.split(' ');
                result = result[0];

                if(result=='No'){

                   display_no_result();

                   $('#info_msg_wait').fadeOut();//On efface la box qui fait patienter

                   return false;              
                }else{
                    return true;
                }
            }          
        }


        function display_no_result () {
            
            $('.liste').html('<div class="z-depth-3 card-panel red lighten-2"><span class="white-text text-darken-2"><i class="small mdi-alert-error"></i>'+$('.no_result').attr('message')+'</span></div>');
        }
        

        $('.zim_wikipedia').click(function () {

            window.zim_tab = 'wikipedia';
            go_search($('.input_search').val(),window.zim_tab,false);
        });

        $('.zim_gutenberg').click(function () {

            window.zim_tab = 'gutenberg';           
            go_search($('.input_search').val(),window.zim_tab,false);
        });

        $('.zim_TED').click(function () {
            
            window.zim_tab = 'TED';
            go_search($('.input_search').val(),window.zim_tab,false);
        });

        $('.zim_linux').click(function () {
            
            window.zim_tab = 'ubuntu';
            go_search($('.input_search').val(),window.zim_tab,false);
        });


        $('.zim_medecine').click(function () {
            
            window.zim_tab = 'medecine';
            go_search($('.input_search').val(),window.zim_tab,false);
        });

        $('.zim_click').click(function(){
            
            $('.liste').animate({scrollTop : '0px'},1000);//on te scroll au debut de la page
        })



});

	