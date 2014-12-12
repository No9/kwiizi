$(document).ready(function(){
				
		//Appending HTML5 Audio Tag in HTML Body
		
            $('<audio id="chatAudio"><source src="'+$('#song').attr('url_chat')+'.ogg" type="audio/ogg"><source src="'+$('#song').attr('url_chat')+'.wav" type="audio/wav"><source src="'+$('#song').attr('url_chat')+'.mp3" type="audio/mpeg"></audio>').appendTo('body');
		
		    $('<audio id="bellAudio" loop><source src="'+$('#song').attr('url_bell')+'.ogg" type="audio/ogg"><source src="'+$('#song').attr('url_bell')+'.wav" type="audio/wav"><source src="'+$('#song').attr('url_bell')+'.mp3" type="audio/mpeg"></audio>').appendTo('body');
		
		var unread = 0;//le nombre de message non lus
		
		var time_waiting_call = 10000 //temps d'attente du lancement d'un appel

		var delay_search_connected = 3000;
		
		var all_message = [];//ce tableau garde les conversations
		
		window.all_interloc = [];//ce tableau garde la liste des numéros avec qui je suis en conversation array numero(username,nbre_unread)
		
		window.all_interloc_tab = [];//ce tableau garde tous les interlocuteurs sous forme de taleau permettant une boucle
		
		
		var my_infos = my_info();
		
		var my_username,my_numero,my_user_id;
						
	//On enregistre les données de l'utilisateur en local(téléphone,username,userid,rtc_id)	
	function my_info()
	{
	    $.ajax({ 
    
		    url: $('.my_info').attr('url_info'),
                                        
		    type: 'POST',
							                            
			async : false,
							
			dataType:"json",
					                    
			error: function(data){
                                   my_username = $.jStorage.get('username');
                                   my_numero   = $.jStorage.get('numero');
                                   my_user_id  = $.jStorage.get('user_id');	
								   },
                                        
			success:function(data) {
			
			            if(data.statu =='connected')
						{					             
						
                            my_username = $.trim(data.username);
                            my_numero   = $.trim(data.numero);
                            my_user_id  = $.trim(data.user_id);			 
	                    }
					}
		});
	}

		//url de node js
		var socket  = io.connect($('#url_node').attr('url'));
		
		//On créee la room avec le numéro de téléphone 
		socket.emit('welcome',{'my_id':$.trim($('.peer').text()),'path_upload':$('.message_ajax').attr('url_for_file_upload_dir')});
		
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		if(!navigator.getUserMedia){

			if(!window.Notification){

                $('#browser').modal('show');
			}else{

				if(window.Notification.permission=='default' || window.Notification.permission=='denied'){
                     
                    window.Notification.requestPermission();
				}
			}		
		}

		var my_ID = $.trim($('.peer').text());
	
		var peer = new Peer(my_ID, {host:$('#url_peer').attr('host'), port:$('#url_peer').attr('port'),debug: 3});
		
		
		peer.on('open', function(id) {

            console.log('My peer ID is: ' + id); 
        });
		
		
		
		
		/////////////////////////////////////////////DUO  chat/webrtc//////////////////////////////////////////////    

            window.my_space = 'off';
			
			window.open_my_space = function(ID)
			{
				window.caller_id = ID;
	            
				//Si jai le flux j'envoi le socket d'appel
				if(window.localStream){
                     
                    $('#my_person').modal('hide');//on cache la fenêtre modal
				  
                    verif_if_called_busy(ID);
                   
				}else{

					//Si je nai pas jouvre dabor le flux avant d'appeler
					navigator.getUserMedia({video: true, audio: true}, function(stream) {
		   
					    window.localStream = stream;

					    verif_if_called_busy(ID);
                    },
                    function(err){
					 					
                        window.notificate_it(err,'error','bottomRight');

                        $('#my_person').modal('hide');//on cache la fenêtre modal
			            $('.number_phone').val('');

			            streamed = false;     				  
			        });
			    }
		    }


		$('#my_person').on('hidden', function () {
  
            $('.call_number').fadeIn();
        })


        
		function verif_if_called_busy(ID){

			socket.emit('verif_if_called_busy',{'caller_ID':my_ID,'called_ID':ID});
		}


		socket.on('verif_if_called_busy',function(data){

			if(window.calling == true){ 

				socket.emit('called_busy',data.caller_ID)
			}else{ 

				socket.emit('called_not_busy',data)
			}
		})



		socket.on('called_not_busy',function(ID){

			my_direct(ID);
		});



		socket.on('called_busy',function(){

			window.notificate_it($('#alert').attr('busy') ,'error','bottomRight');

			$('.call_number').fadeIn();

            $('.waiting_response').fadeOut();
			$('#facetimer').modal('hide');

			window.close_my_space();

			$('#my_person').modal('hide');//on cache la fenêtre modal
			$('.number_phone').val('');
		})


        //Make call
		function my_direct(ID){

            window.calling = true;
            play_bell();
            $('.call_number').fadeIn();
            $('#my_person').modal('hide');//on cache la fenêtre modal
			$('.number_phone').val('');

			var call = peer.call(ID,window.localStream);//je lui donne mon flux
			
			window.existingCall = call;

            $('#facetimer').modal('show');
          
			$('.waiting_response').html($('#Please_wait').html())
			$('.waiting_response').fadeIn();

  
            call.on('stream', function(remoteStream) {

            	stop_bell();

            	$('.waiting_response').fadeOut();

	            // je recoit son flux
			    $('#caller').attr('src',window.URL.createObjectURL(remoteStream));
            });
				
		    call.on('error', function(err) {
				
			   window.notificate_it(err.type,'error','bottomRight');
			   $('.waiting_response').fadeOut();
			   $('#facetimer').modal('hide');

			   window.calling = false;

		    });	
		}


		peer.on('call', function(call) {

			window.calling = true;
		
		    window.existingCall = call;

		    play_bell();

		    $('#facetimer').modal('show');
			$('.waiting_response').html($('#Please_wait').html())
			$('.waiting_response').fadeIn(); 

			$('#my_person').modal('hide');//on cache la fenêtre modal
			$('.number_phone').val('');

			window.caller_id = call.peer;
		   
		    if(streamed==true)
			{
				
			    call.answer(window.localStream); // Answer the call with an A/V stream.
			}
			else
			{
			    navigator.getUserMedia({video: true, audio: true}, function(stream) {
				
				     
					 window.localStream = stream;
 
					 streamed==true;
                     
					 call.answer(stream); // Answer the call with an A/V stream.
					 stop_bell();

                    },function(err) {
                  
						
						var my_interloc_peer = call.peer;
						
						var my_interloc_num = my_interloc_peer;
						
					    socket.emit('zut',call.peer);
								
                        window.notificate_it(err.name,'error','bottomRight');

                        $('.waiting_response').fadeOut();
			            $('#facetimer').modal('hide');

			            window.calling = false;
                    }
			    );					 
			}
           
		    call.on('stream', function(remoteStream) {
                          
		      // je recoit son flux
		      $('.waiting_response').fadeOut();
		      $('#caller').fadeIn();
			  $('#caller').attr('src',window.URL.createObjectURL(remoteStream));
            });
        });

        
        socket.on('zut',function() {
                          
		    // son interlocuteur n'arrive pas a se connecté
			window.notificate_it($('#alert').attr('wat'),'error','bottomRight');	

            window.close_my_space();		   
        });



        //Ici on regarde le numéro écrit au cas où il clique sur le bouton de validation
		$('.call_number').click(function() { 

			$('.call_number').fadeOut(); //Prevent double call which causes some bugs
			    
				var numero = parseInt($('.number_phone').val());
				
				if(numero)
			    {
	
				  numero = $.trim(htmlspecialchars(numero,'ENT_QUOTES'));
				  
				    if(numero==$.trim($('.peer').text()))//si cest mon propre numéro
					{
					  window.notificate_it($('#alert').attr('form_u_number'),'error','bottomRight');

					  $('.call_number').fadeIn();
					}
					else
					{
						//We open his camera
						window.open_my_space($.trim($('.number_phone').val()));
                    }					 
				
				}else{

					window.notificate_it($('#alert').attr('form_none_number'),'error','bottomRight');

					$('.call_number').fadeIn();

					$('#my_person').modal('hide');

				}		
		});



        $('#end_this_call').click(function(){

        	window.close_my_space();

            if(window.existingCall)
			{
			    window.existingCall.close();
			  
			    socket.emit('end_call',window.caller_id);
			  
			    window.existingCall = null;
                                
            }else{

                //On stoppe la sonerie de l'aure coté
                socket.emit('stop_belling',window.caller_id);
            }         
        });


        socket.on('stop_belling',function(){

        	abord_call()
        })


        socket.on('call_ended',function(){
		    
			window.notificate_it($('#alert').attr('end_call'),'end_call','bottomRight');
			
			window.close_my_space();
			 
			window.existingCall = null;
		});



		window.close_my_space = function()
		{
			if(window.localStream)
			{
			    window.localStream.stop(); 
                window.localStream = null;
			}
				
			streamed = false;

			window.calling = false;

			$('#facetimer').modal('hide');

			window.caller_id = null;

			$('#caller').attr('src','');
		}


        function abord_call()
		{
		    stop_bell();
		    $.noty.closeAll();;
		}

		function play_bell()
		{
		   //we play song
			var my_bell = $('#bellAudio')[0];
			  
			my_bell.play();
		}


		function stop_bell()
		{
		   var my_bell = $('#bellAudio')[0];
               my_bell.pause();
               my_bell.currentTime = 0;
		}
		


	/////////////////////////////////////////////DUO  chat/webrtc  FIN//////////////////////////////////////////////





	/////////////////////////////////////////////Share file///////////////////////////////////////////////////////////	
    //Testons si le navigateur est comaptible avec le partage de fichier
    if (window.File && window.FileReader && window.FileList && window.Blob){

        window.filer = true;
    }else{

        window.filer = false;
        $('#browser').modal('show');
    }


    $(".drag_file").on('dragover',dragover)
                   .on("drop",drop);


    $('.upload').on('change',function(evt){ 

        //On récupère le fichier
        window.files = evt.target.files;

        sender();

        $('.upload').val('');
    })

    
    function drop(e) { 
       
        e.stopPropagation();
        
        e.preventDefault();

        //On envoi le fichier en direct s'il est connecté
        var dt = e.dataTransfer || (e.originalEvent && e.originalEvent.dataTransfer);
        window.files = e.target.files || (dt && dt.files); 

        $('#form_up').attr('class','alert alert-info')

        sender();
  
        return false;
    }


    function dragover(){ 

       $('#form_up').attr('class','alert alert-success')
        return false;
    }


   
    function sender(){

        if(window.in_sending!=true){ //If we are not sending a file to another person

            //This is initaitor of multiupload
            window.denominator = window.files.length;
            window.numerator = 1;
            window.indice = 0;
            window.file_receiver = window.caller_id;
            window.in_sending = true;

            show_spinner();

            send_file(window.files);//We send files to this function
        }else{

        	window.notificate_it($('.upload_message').attr('in_sending'),'error','bottomRight');//Prevent if we are aready sending a file

        	window.force = true; //This variable determine if the user attempted to send a new file during another proccess
        }
    }


    //We display loading image
    function show_spinner(){

        $('.progressor').fadeIn();
        $('.ended').fadeOut();     
    }


    //We hide image loading
    function hide_spinner(){

        $('.progressor').fadeOut();
        $('.ended').fadeIn();
    }


     //We send file (Take one by one)
    function send_file(files){ 

        //We look at the number of file
        var nbre_file = files.length;

        if(window.indice < window.denominator){ //If we are allways a file to send

            var ftype = files[window.indice].type;
            
            var file = files[window.indice];

            var allowed = ['png','png','gif','zip','rar','pdf','doc','docx','ppt'];
 
            if( $.inArray(file.name.split('.').pop().toLowerCase() ,allowed)!= -1){ 
                
                if(file.size < 15728640){ //(15 Mo * 1024*1024)
                    
                    send_file_with_ajax(file);
                }else{

                    window.notificate_it($('.upload_message').attr('up_too_big'),'error','bottomRight');
                    window.in_sending = false;
                    hide_spinner();
                }     
            }else{

                window.notificate_it($('.upload_message').attr('up_not_supported'),'error','bottomRight');
                window.in_sending = false;
                hide_spinner();
            }
        }else{
            
            window.in_sending = false;//We tell him that the sending is finish
            hide_spinner();

            if(window.force==true){

            	window_web_notification('Yep!',{body:$('.upload_message').attr('end_sending')});

            	window.force = false;
            }
        }       
    }


    function send_file_with_ajax(file){

        window.file_name = file.name;//We take image file as an message
        window.type_mime = file.type;

        //We display popup of file
        play_file_loader();

        window.numerator = 1 + window.numerator;//We add +1 to the number of file to send
       
        show_spinner();

       var formdata = new FormData();
       formdata.append("fichier", file);
       var ajax = new XMLHttpRequest();
       ajax.addEventListener("load", actionTerminee, false);
       ajax.addEventListener("error", enErreur, false);
       ajax.addEventListener("abort", operationAnnulee, false);
       ajax.upload.addEventListener("progress", enProgression, false);
 
       ajax.open("POST", $('.message_ajax').attr('url_for_file_upload'));
       ajax.send(formdata);
    }



    function play_file_loader(){

        jQuery(document).ready(function(){
   
            percent_loader(0) ;   
        })
    }


    function percent_loader(percent){

        $('.bar').attr('style','width:'+percent+'%');
        $('.percenter').html(percent+'%');
    }


    function enProgression(e){
       var pourcentage = Math.round((e.loaded * 100) / e.total);
       percent_loader(pourcentage);
    }


    function actionTerminee(e){ 

        var file_name_md5 = e.target.responseText;
        
        var data = {'message':file_name_md5,'sender':my_ID,'receiver':window.caller_id,'file_name':window.file_name,'type_file':window.type_file};
 
        socket.emit('file_sended',data);
        percent_loader(0);

        //send_file_with_ajax_to_database(file_name_md5);

        //On efface le loader pour le remplacer par le nom du fichier envoyé
        $('.file_name').html(window.file_name+' <span class="glyphicon glyphicon-saved"></span>');

        hide_spinner();
        
        window.indice = window.indice + 1; //ON incrménte l'indicce du table pour passer à l'indice suivant

        send_file(window.files);//On r'appelle la fonction d'envo s'l ya d'autre fichier dans la lste d'attente
    }

    function enErreur(e){ 

        window.notificate_it('Upload Failed','error','bottomRight');

        window.indice = window.indice + 1; //ON incrménte l'indicce du table pour passer à l'indice suivant
        
        send_file(window.files);//On r'appelle la fonction d'envo s'l ya d'autre fichier dans la lste d'attente
        percent_loader(0);
    }

    function operationAnnulee(e){

        window.notificate_it($('.upload_message').attr('up_'+e),'error','bottomRight');

        window.indice = window.indice + 1; //ON incrménte l'indicce du table pour passer à l'indice suivant
        
        send_file(window.files);//On r'appelle la fonction d'envo s'l ya d'autre fichier dans la lste d'attente
        percent_loader(0);

    }



    socket.on('file_sended',function(data){ console.log(data);

    	//Hide the loader
    	hide_spinner();

    	//Put the link
        $('.file_name').html('<a href="'+$('.message_ajax').attr('url_for_file_upload_dir')+data.message+'" target="_blank" download="'+data.file_name+'" >' +data.file_name+' <span class="glyphicon glyphicon-saved"></span></a>');
    });


    function window_web_notification(title,message){

    	var notification = new Notification(title, {
            body: message
        });
    }


	/////////////////////////////////////////////Share file///////////////////////////////////////////////////////////	

		
        //cette fonction déclanche les notifications		
        window.notificate_it = function(text_msg,type,position) {
      
	    var text_msg = text_msg.substr(0,150);//100 est le nombre limite de caractère
		 
		    switch(type)
			{
			    case 'information':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            timeout: 5000,
			            maxVisible: 3
                    });
				break;
				
				case 'error':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            maxVisible: 3,
						buttons: [
                        {    addClass: 'btn btn-warning', text: 'Ok', onClick: function($noty) {
                              $noty.close();
                            }							
                        }]
                    });
				break;
				
				case 'end_call':
				    noty({
                        text: text_msg,
                        type: 'warning',
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
						timeout: 3000,
			            maxVisible: 3,
						
                    });
				break;
				
				case 'notification':
				    noty({
                        text: text_msg,
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            timeout: 5000,
			            maxVisible: 5,
                        buttons: [
                           {  addClass: 'btn btn-success', text: 'Prendre', onClick: function($noty) {
                                $noty.close();
							    accept_call();
					          }
                            },
							{
							    addClass: 'btn btn-warning', text: 'Rejeter', onClick: function($noty) {
                                    $noty.close();
							        reject_call();
                                }
							
							}]
                    });
				break;

                case 'error':
				    noty({
                        text: $('#alert').attr('error'),
                        type: type,
                        dismissQueue: true,
                        layout: position,
                        theme: 'defaultTheme',
			            force:false,
			            maxVisible: 3,
						buttons: [
                        {    addClass: 'btn btn-warning', text: 'Ok', onClick: function($noty) {
                              $noty.close();
                            }							
                        }]
                    });
				break;				
			}
		}
		
		
	
	//////////////////////////////////////////webrtc/////////////////////////////////////////////////

    var connected = false;
	
	var mediaStream;
		

       //Ici on envoi une photo à son interlocuteur
        $('#takePhoto').click(function() {
		
             var canvas = document.getElementById('photo_ready'); 
             
			 canvas.getContext('2d').drawImage(document.getElementById('my_self'),0,0,320,240);
              
			 var data = canvas.toDataURL('image/png');
              
			 $('#picture').attr('src', data);
			 
			 $('#my_space').fadeOut();//on ferme le my_space
		   		   
             $('#my_tof').modal('show');//on fait appataitre la photo
        });

  
        var streamed = false;//false si on déjà accès à sa caméra et true au cas contraire
	
		
		
		
		//Ici on envoi une photo à son interlocuteur
        $('#sendPhoto').click(function() {
		
		   socket.emit('my_tof',{'interloc_num':$('#interloc').attr('number'),'sender_name':my_username,'image':$('#picture').attr('src')});
		  
		  window.open_my_space();//on reouvre le my_space
		  
		  var notify = 'Photo envoyée';
		  window.notificate_it(notify,'information','centerLeft');//j'affiche le message en notification		
        });


        //Ici on annule l'envoi une photo à son interlocuteur
        $('#Cancel_sendPhoto').click(function() {
		
		   window.open_my_space();//on reouvre le my_space		
        }); 



        /////////////////////easyrtc//////////////////////////////////////
		

        
        function htmlspecialchars (string, quote_style, charset, double_encode) {
           // http://kevin.vanzonneveld.net
 
           var optTemp = 0,
           i = 0,
           noquotes = false;
            
			if (typeof quote_style === 'undefined' || quote_style === null) {
                      quote_style = 2;
            }
           string = string.toString();
  
            if (double_encode !== false) { // Put this first to avoid double-encoding
                   string = string.replace(/&/g, '&amp;');
            }
           string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');

           var OPTS = {
              'ENT_NOQUOTES': 0,
              'ENT_HTML_QUOTE_SINGLE': 1,
              'ENT_HTML_QUOTE_DOUBLE': 2,
              'ENT_COMPAT': 2,
              'ENT_QUOTES': 3,
              'ENT_IGNORE': 4
              };
            if (quote_style === 0) {
               noquotes = true;
            }
            if (typeof quote_style !== 'number') { // Allow for a single string or an array of string flags
               quote_style = [].concat(quote_style);
                for (i = 0; i < quote_style.length; i++) {
                  // Resolve string input to bitwise e.g. 'ENT_IGNORE' becomes 4
                    if (OPTS[quote_style[i]] === 0) {
                       noquotes = true;
                    }
                    else if (OPTS[quote_style[i]]) {
                       optTemp = optTemp | OPTS[quote_style[i]];
                    }
                }
              quote_style = optTemp;
            }
            if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
               // string = string.replace(/'/g, '&#039;');
            }
            if (!noquotes) {
              // string = string.replace(/"/g, '&quot;');
            }

           return string;
        }


        
        

         // Requesting to Database every 2 seconds
        var auto_refresher = setInterval(function ()
        { 
                  
				    $.ajax({

				            type: 'post',

				            url: $("#url_session").html(),

				            async : true,

				            error: function(){  //On dit kil est offline
											  $('.attente').html('<img style="width:50%;" class="bulle" title="'+$('#url_image_logo').attr('nothing')+'" data-placement="bottom" src="'+$('#url_image_logo').attr('url')+'begoo.png"> <br><br><br> <div class="alert alert-info">'+$('#url_image_logo').attr('mode_out')+' </div>');  
											
											   window.all_my_notification();//On affiche le nombre de notification en local

											   
											   ////////////////////////Manage the menu top///////////////////////////
											   $('.off_hider').fadeOut();//Hide all menu on top


											   ////////////////////////Manage the menu top///////////////////////////

                                               
											   window.kwiki_inline ='off';
											},
							
				            success: function(data){
							
									    $('.attente').html('');//on efface l'attente

									    window.kwiki_inline ='on';


									    ////////////////////////Manage the menu top///////////////////////////
											   $('.off_hider').fadeIn();//Hide all menu on top 
											   
									    ////////////////////////Manage the menu top///////////////////////////

									}
										 
			        });
        }, 5000);


        //C'est ici qu'on compte le nombre de notification
		window.all_my_notification = function()
		{
		    $.ajax({

				            type: 'post',

				            url: $("#url_maj").html(),

				            async : true,

				            error : function(){ //En cas d'erreur j'affice le nombre de notification en local
                                       
                                        if($.jStorage.get('note_nbre','nada')!=='nada'){

                                        	affiche_nbre_note(0);
                                        }                                    
				                   },
							
				            success: function(data){
		     
			                            if($.trim(data)!=='connect_him')
										{
										 
				                         var message = $.trim(data)*1;
										 
										 	///////////////////////////////Regardons s'il a des nouvelles notifications
										 	affiche_nbre_note(message);
											
				                        }
										else
										{
										  $(".mes_notes").attr('class','mes_notes');
										  $(".mes_notes").html('0');
										}										
									}
			});
		}

         //Lançon le chargement du nombre de notification
		var nbre_notification = window.all_my_notification();

         //Cette fonction affiche le nombre de notification
        function affiche_nbre_note(message){

        	    if(message > 0)  //Si oui
				{ 
				  $(".mes_notes").html(message);//On Donne le  nouveau nombre de message
				  $(".mes_notes").attr('class','badge badge-info mes_notes');//on applique les nouveaux styles											  											   
				}
											
				if(message == 0)//s'il nya  aucun nouveau msg
				{
				  $(".mes_notes").attr('class','mes_notes');
				  $(".mes_notes").html('');
				}
        }
		

    });