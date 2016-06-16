/*
 * jQuery Puzzle game Plugin
 * Copyright (c) 2011 Md. Rakibulalam
 * Version: 1.0.11 (22-07-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 */
/* -------------------------------Head Section------------------------------
 <script type="text/javascript">

		$('#puzzle').JsPuzzle({
			__rows:4,
			__columns:4,
		});
</script>

 <style type="text/css">
	#loader
		{
			background:url(images/loadssing.gif) no-repeat; 
			height:48px;
			width:47px;
			margin:0px;
			margin-top:150px;
			margin-left:50px;
		}
	#puzzle
		{			
			position:absolute;			
			z-index:50;
			margin:23PX;
			border:1px solid #EAEAEA;
			margin-top:-205px;
		}
	#puzzle IMG { position:absolute; z-index:50}
	#preview 
		{
			height:100px; width:43px;
			line-height:50px;
			cursor:pointer;
		}
</style>
-------------------------------Head Section------------------------------
-------------------------------Body Section------------------------------
<div id="puzzle">

	<img src="images/078kg1z07l.jpg">
	<img src="images/cute_fantasy.jpg">
	<img src="images/gal31abkay.jpg">

</div>
-------------------------------Body Section------------------------------*/


(function($){
	$.fn.puzzle=function(options){

	var __Settings=
		{				
		 __rows:4,
		 __columns:4,
		}
		
	return this.each(function() {        
		  if ( options ) { 
			$.extend( __Settings, options );
		  }


	
		var __obj_element=this;
		var __frame_height=0;
		var __frame_width=0;
		var __box_counter=0;
		var __image_src=new Array();
		var __image_index=0;
		var __block_id=__Settings.__rows*__Settings.__columns;
		var __permit_to_move=new Array();
		var __temp_id='';		
		var __rand_array=new Array();
		
		$(window).load(function(){
									/*__ShowLoader();*/
									__InitLoader();
									__ReadyForMove();			
									__RandomDecoration();
									__CheckCompleted();								
								});
		/*var __ShowLoader			=	function()
										{
											
											$(__obj_element).parent().append('<div id="loader"></div>');
											$('#loader').show();
											
										};
		var __HideLoader			=	function()
										{
											
											$(__obj_element).parent().find('#loader').fadeOut().remove();
											$(__obj_element).children('DIV').show();
											
											
										};*/
		var __InitLoader			=	function()
										{	
											var img_index=0;
											$(__obj_element).children('IMG').each(function(){
												__image_src[img_index]=$(this).attr('src');							
												img_index++;								
												});
											__frame_width=$(__obj_element).children('IMG').width()-(__Settings.__rows*2);
											__frame_height=$(__obj_element).children('IMG').height()-(__Settings.__columns*2);
											//__image_src=$(__obj_element).children('IMG').attr('src');							
											//$(__obj_element).css({'height':''+__frame_height+'','width':''+__frame_width+''});
											$(__obj_element).children('IMG').remove();																				
											__BoxGenerate();
											__ImagePreview();
											//alert(__image_src);
											
										};
		var __BoxGenerate			=	function()
										{
											var index=1;
											var top=0;
											var left=0;
											
											for(var c=1; c<=__Settings.__columns; c++)
											{
												for(var r=1; r<=__Settings.__rows; r++)
													{											
															__rand_array[index]=index;
															__BlockBox(index,top,left,__BoxHeight(),__BoxWidth(),__image_index);										
															left+=__BoxWidth();											
															index++;															 										
													}
												top+=__BoxHeight();
												left=0;
												
											}	
											$("div[class=puzzleimage]:last").remove();											
										};
		var __BlockBox				=	function(index,top,left,height,width,img_index)
										{							
											$(__obj_element).append("<div class='puzzleblock"+index+"' id='puzzleblock-"+index+"'></div>");
											$('.puzzleblock'+index).css({'margin-left':''+left+'px','margin-top':''+top+'px','height':''+height+'px','width':''+width+'px','background':'#fff','border':'solid 1px #CCCCCC','position':'absolute','z-index':'100'});
											__BindBlockBox('.puzzleblock'+index,index);
											__ImageBox('.puzzleblock'+index,index,top,left,height,width,img_index);
											$('.puzzleblock'+index).attr("class", "puzzleblock");																				
										};
		var __ImageBox				=	function(obj,index,top,left,height,width,img_index)
										{							
											$(obj).append("<div class='puzzleimage"+index+"' id='"+index+"'></div>");
											$('.puzzleimage'+index).css({'height':''+height+'px','width':''+width+'px',"background":"URL("+__image_src[img_index]+")",'border':'solid 1px #000',"background-position":"-"+left+"px -"+top+"px",'position':'absolute','z-index':'200'});
											__BindImageBox('.puzzleimage'+index,index,left,top);
											$('.puzzleimage'+index).attr("class", "puzzleimage");											
										};
		var __BoxHeight				=	function()
										{
											
											return Math.ceil(parseInt(__frame_height)/__Settings.__columns);	
										};						
		var __BoxWidth				=	function()
										{
											return Math.ceil(parseInt(__frame_width)/__Settings.__rows);
										};
		var __BoxTotal				=	function()
										{
											return Math.ceil(__BoxHeight()*__BoxWidth());
										};
		var __BindImageBox			=	function(bindobject,index,left,top)
										{
											$(bindobject).bind({								
												mouseenter:function(){
														$(this).css({"background-position":"-"+(left-(__Settings.__rows*2))+"px -"+(top-(__Settings.__columns*2))+"px",'margin-left':'-'+(__Settings.__rows*2)+'px','margin-top':'-'+(__Settings.__columns*2)+'px','width':''+(__BoxWidth()+12)+'','height':''+(__BoxHeight()+12)+'','box-shadow':' 0 0 2em #CC00FF','-webkit-box-shadow':'0 0 2em #CC00FF','-moz-box-shadow':'0 0 2em #CC00FF','z-index':'300'})
													},
												mouseleave:function(){										
														$(this).css({"background-position":"-"+left+"px -"+top+"px",'margin-left':''+0+'px','margin-top':''+0+'px','width':''+__BoxWidth()+'','height':''+__BoxHeight()+'','border':'solid 1px #000000','box-shadow':'none','-webkit-box-shadow':'none','-moz-box-shadow':'none','z-index':'300'});
														
													},
												click:function(){
														
														var id=$(this).parent('div').attr('id').split('-');
												
														
														if(__CheckPermission(parseInt(id[1]),__permit_to_move)==true)
														{
															$(this).fadeOut('fast');
															__MoveImage(this,left,top);														
															__block_id=parseInt(id[1]);										
															__ReadyForMove();
															__CheckCompleted();
														
														}
													}
												});
										};
		var __BindBlockBox			=	function(bindobject,index)
										{
											$(bindobject).bind({								
												mouseenter:function(e){
														e.preventDefault();
															$(this).css({'background':'#f3f3f3','z-index':'300'});
													},
												mouseleave:function(e){										
														e.preventDefault();
														$(this).css({'background':'#FFF','z-index':'150'});
														
													},
												click:function(e)
													{
														e.preventDefault();																		
													}
												});
										};
		var __ReadyForMove			=	function()
										{
											
											if(__block_id%__Settings.__rows==0)
											{					
				
												__permit_to_move=new Array();
												__permit_to_move[0]=parseInt(__block_id)-1;
												__permit_to_move[1]=parseInt(__block_id)-__Settings.__rows;
												__permit_to_move[2]=parseInt(__block_id)+__Settings.__rows;
											}else if(__block_id%__Settings.__rows==1)
											{				
											
												__permit_to_move=new Array();
												__permit_to_move[0]=parseInt(__block_id)+1;
												__permit_to_move[1]=parseInt(__block_id)-__Settings.__rows;
												__permit_to_move[2]=parseInt(__block_id)+__Settings.__rows;
											}else
											{
												
												__permit_to_move=new Array();
												__permit_to_move[0]=parseInt(__block_id)+1;
												__permit_to_move[1]=parseInt(__block_id)-1;
												__permit_to_move[2]=parseInt(__block_id)-__Settings.__rows;
												__permit_to_move[3]=parseInt(__block_id)+__Settings.__rows;
											}
											
										};
		var __MoveImage				=	function(obj,left,top)
										{
												$(obj).appendTo($('#puzzleblock-'+__block_id));	
												$(obj).fadeIn('fast');
												$(obj).css({"background-position":"-"+left+"px -"+top+"px",'margin-left':''+0+'px','margin-top':''+0+'px','width':''+__BoxWidth()+'','height':''+__BoxHeight()+'','border':'solid 1px #000000','box-shadow':'none','-webkit-box-shadow':'none','-moz-box-shadow':'none','z-index':'200'});																							
										
										};						
		var	__CheckPermission		=	function(id,__permit_to_move)
										{							
										  var Found = false;
										  for (var i = 0; i < __permit_to_move.length; i++){
											if (__permit_to_move[i] == parseInt(id)){
											  return true;
											  var Found = true;
											  break;
											}
											else if ((i == (__permit_to_move.length - 1)) && (!Found)){
											  if (__permit_to_move[i] != parseInt(id)){
												return false;
											  }
											}
										  }
										};
		var __PickNums				=	function(nums, numArr)
										{
										  if(nums>numArr.length)
										  {							
											return false;
										  }
										  var pickArr=new Array();
										  var tempArr=numArr;
										  for(var i=0; i<nums; i++)
										  {
											pickArr[pickArr.length]=tempArr[Math.round((tempArr.length-1)*Math.random())];
											var temp=pickArr[pickArr.length-1];
											for(var j=0; j<tempArr.length; j++)
											{
											  if(tempArr[j]==temp)
											  {
												tempArr[j]=null;
												var tempArr2=new Array();
												for(var k=0; k<tempArr.length; k++)
												  if(tempArr[k]!=null)
													tempArr2[tempArr2.length]=tempArr[k];
												tempArr=tempArr2;
												break;
											  }
											}
										  }
										  return pickArr;
										}; 
		var __RandomDecoration		=	function()
										{
											var newRandArray=__PickNums(__Settings.__rows*__Settings.__columns,__rand_array);
											var empty=0;
											
											for(var i=0; i<newRandArray.length; i++)
											{
												
												if(i==0)
												{
													$('#puzzleblock-'+newRandArray[i]).children().appendTo($('#puzzleblock-'+(__Settings.__rows*__Settings.__columns)));
													empty=newRandArray[i];
												}else 
												{
													$('#puzzleblock-'+newRandArray[i]).children().appendTo($('#puzzleblock-'+(empty)));
													empty=newRandArray[i];
												}								
											}
											__block_id=empty;
											__ReadyForMove();	
										};
			var __CheckCompleted	=	function()
										{
											var result=0;
											$('.puzzleblock').each(function(){
												var id=this.getAttribute('id').split('-');
												var id1=id[1];
												var id2=$(this).children('.puzzleimage').attr('id');								
													if(parseInt(id1)==parseInt(id2))							
													{
														result++;											
														if(result==parseInt((__Settings.__rows*__Settings.__columns)-1))
														{																						
															__RefreshScreen();											
															if(__image_src.length==(__image_index+1))
															{
																__image_index=0;
																
															}else
															{
																__image_index++;
															}
															__ThanksMessagScreen();
														}
													}
												});
											
										};
			var __ImagePreview		=	function()
										{
											$('#preview').bind({
													mouseenter:function(e){
															e.preventDefault();
															__ShowImage();
															
														},
													mouseleave:function(e){										
															e.preventDefault();									
															__RemoveImage();
														}	
													});
										};
			var __ShowImage			=	function()
										{
											$(__obj_element).append("<div id='imageprivew'></div>");
											$('#imageprivew').css({'height':''+(__frame_height+(Math.ceil(__Settings.__rows/2)))+'','width':''+(__frame_width+(Math.ceil(__Settings.__columns/2)))+'',"background":"URL("+__image_src[__image_index]+")",'position':'absolute','z-index':'500'}).hide();
											$('#imageprivew').slideDown();
										};
			var __RemoveImage		=	function()
										{
											$('#imageprivew').slideUp(function(){},function(){$(this).remove()});
										};
			var __RefreshScreen		=	function()
										{
											$(__obj_element).children('DIV').remove();
										};
			var __ThanksMessagScreen=	function()
										{
											$(__obj_element).append("<div id='thanks'></div>");
											$('#thanks').css({'height':''+(__frame_height+(Math.ceil(__Settings.__rows/2)))+'','width':''+(__frame_width+(Math.ceil(__Settings.__columns/2)))+'',"background":"URL("+__image_src[__image_index]+")",'position':'absolute','z-index':'500'}).hide();							
											$('#thanks').slideDown(function(){																	  
															__BoxGenerate();
															__ReadyForMove();			
															__RandomDecoration();
															});											
											$('#thanks').delay(2000).slideUp();																															
																			
										};
	});	
	};	  
 
		  
})(jQuery);