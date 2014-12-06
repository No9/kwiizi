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
		socket.emit('welcome',$.trim($('.peer').text()));
		
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		
		var peer = new Peer($.trim($('.peer').text()), {host:$('#url_peer').attr('host'), port:$('#url_peer').attr('port'),debug: 3});
		
		
		peer.on('open', function(id) {
          console.log('My peer ID is: ' + id); 
        });
		
		
		
		
		/////////////////////////////////////////////DUO  chat/webrtc//////////////////////////////////////////////
 
		   //Cette fonction détecte les nouveaux messages de notification personnelle
		    socket.on('toc_toc',function(data){

             	toc_toc(data,'new')	;	
		    });
			
			
			//Cette fonction détecte les nouvelles photos envoyées
		    socket.on('da_tof',function(data){
             	
                humane.clickToClose = true;
                humane.timeout = 0;
				humane('<img src="'+data.image+'" /><br>'+data.sender_name);

                 //we play song
				$('#chatAudio')[0].play();				
		    });
			
			
			
			//on traite les nouveau message qui arrive
			function toc_toc(data,form)
			{
			   //S'il n'est pas en communication avec l'expéditeur
             var sender_num = $.trim(data.sender_num);
			 
			 var actual_friend = $.trim($('#interloc').attr('number'));
                
				if(sender_num !==actual_friend)
                {               
				  var user_name = '<br> <strong>'+$.trim(data.sender_name)+'</strong>';
				  
				  var message_text = $.trim(data.message);
				  
				  var notify = message_text + user_name;
				  
				  window.notificate_it(notify,'information','centerLeft');//j'affiche le message en notification
				  
				  window.unread_msg('add',1,data.sender_num,data.sender_name);//On ajoute +1 au nombre de message non lu
				  
				  //on ajoute dans la liste des messages si le my_pace est ouvert et qu'il n'est pas dans la liste qui est affiché
                }
                else
                {				
		          player_message(data.sender_name,data.message); //Affiche les message de mon interlocuteur en direct			  
				}
				
			 tab_recorder(data.sender_name,data.message,data.sender_num);

               //On enregistre le message en local
			   recorder_msg(data);


              //Ici on ajoute une nouvelle entré dans la liste qui s'affiche au my_space si c'est ouvert
			  push_number_to_my_space(data,'');

               //we play that song
               $('#chatAudio')[0].play();			   
			}
			
			
			//on regarde qui écrit le message actuellement
			socket.on('is_typing',function(data){
			
			  $('.pencil_'+data.sender_num).html($('#fade_pencil').html());				  		     
			});
			
			
			//on regarde qui écrit le message actuellement
			socket.on('not_typing',function(data){
			
			  $('.pencil_'+data.sender_num).html('');
			});
		   
		   
		   //cette socket demande mon numéro
		    socket.on('your_number', function (data) {
            
                socket.emit('my_number',{'interloc_num':my_numero,'interloc_name':my_username,'sender':data.sender});
			});
			
			
			
			//cette prend la socket contenant le numéro qui confirme que mon interlocuteur est en ligne
		    socket.on('his_number', function (data) {
			
			    if($.trim(data.interloc_name)!==$.trim($('#interloc').html()))
				{
				   $('#interloc').html(data.interloc_name);
				   
				   $('.username_'+data.interloc_num).html(data.interloc_name);
				}
            
                $('#interloc').attr('statu','on');
				
				$('#statu').html($('#statu_user').attr('connected'));

				window.memory_statu ='connected';
			});
		   
		   
       

        socket.on('disconnect', function () { //On fermet sa room
            
			socket.emit('bye',my_numero);
			
			//alert('disconnected');
        });
	
	    /////////////////////////////////////////////DUO  chat/webrtc  FIN//////////////////////////////////////////////	
		    

            window.my_space = 'off';
			
			window.open_my_space = function(ID)
			{
				window.caller_id = ID;
	            
				//Si jai le flux j'envoi le socket d'appel
				if(window.localStream){
                     
                    $('#my_person').modal('hide');//on cache la fenêtre modal
				  
                    //J'envoi mon flux directement
                    my_direct(ID);
                   
				}else{

					//Si je nai pas jouvre dabor le flux avant d'appeler
					navigator.getUserMedia({video: true, audio: true}, function(stream) {
		   
					    window.localStream = stream;

					    my_direct(ID);
                    },
                    function(err){
					 					
                        window.notificate_it(err.name,'error','bottomRight');

                        $('.waiting_response').fadeOut();
			            $('#facetimer').modal('hide');

			            streamed = false;     				  
			        });
			    }
		    }


        //Make call
		function my_direct(ID){

            streamed = true;

            $('#my_person').modal('hide');//on cache la fenêtre modal
			$('.number_phone').val('');

			var call = peer.call(ID,window.localStream);//je lui donne mon flux
			
			window.existingCall = call;

            $('#facetimer').modal('show');
			$('.waiting_response').html($('#Please_wait').html())
			$('.waiting_response').fadeIn(); 
  
            call.on('stream', function(remoteStream) {

            	$('.waiting_response').fadeOut();

	            // je recoit son flux
			    $('#caller').attr('src',window.URL.createObjectURL(remoteStream));
            });
				
		    call.on('error', function(err) {
				
			   window.notificate_it(err.type,'error','bottomRight');
			   $('.waiting_response').fadeOut();
			   $('#facetimer').modal('hide');

			   streamed = false; 	            		   
		    });	
		}


		peer.on('call', function(call) {
		
		    window.existingCall = call;

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

                    },function(err) {
                  
						
						var my_interloc_peer = call.peer;
						
						var my_interloc_num = my_interloc_peer;
						
					    socket.emit('zut',call.peer);
								
                        window.notificate_it(err.name,'error','bottomRight');

                        $('.waiting_response').fadeOut();
			            $('#facetimer').modal('hide');
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


        //Ici on regarde le numéro écrit au cas où il clique sur le bouton de validation
		$('.call_number').click(function() { 
			    
				var numero = parseInt($('.number_phone').val());
				
				if(numero)
			    {
	
				  numero = $.trim(htmlspecialchars(numero,'ENT_QUOTES'));
				  
				    if(numero==$.trim($('.peer').text()))//si cest mon propre numéro
					{
					  window.notificate_it($('#alert').attr('form_u_number'),'error','bottomRight');
					}
					else
					{
						//We open his camera
						window.open_my_space($.trim($('.number_phone').val()));
                    }					 
				
				}else{

					window.notificate_it($('#alert').attr('form_none_number'),'error','bottomRight');

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
		
		
        //cette fonction déclanche les notifications		
        window.notificate_it = function(text_msg,type,position) {
      
	     text_msg = text_msg.substr(0,150);//100 est le nombre limite de caractère
		 
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
	
	   
		
		socket.on('wat',function(data) {
                          
		      // son interlocuteur n'arrive pas a se connecté
			   window.notificate_it('<b>'+$.trim(data.sender_name)+'</b> '+$('#alert').attr('wat'),'error','bottomRight');	

               able_call();			   
        });

		
		
		
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
											   $('sub_hide').fadeOut(); 
											   $('.off_hist_caracter').text($('.off_hist').attr('data-original-title')); 
											   $('.off_note_caracter').text($('.off_note').attr('data-original-title'));
											   ////////////////////////Manage the menu top///////////////////////////

                                               
											   window.kwiki_inline ='off';
											},
							
				            success: function(data){
							
									    $('.attente').html('');//on efface l'attente

									    window.kwiki_inline ='on';


									    ////////////////////////Manage the menu top///////////////////////////
											   $('.off_hider').fadeIn();//Hide all menu on top 
											   $('sub_hide').fadeIn(); 
											   $('.off_hist_caracter').text(''); 
											   $('.off_note_caracter').text('');
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