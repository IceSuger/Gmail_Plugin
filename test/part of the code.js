for(i in parts)
					{
						var part = parts[i];
						if(part.filename)
						{
							document.getElementById('msgatt').innerHTML += '<br /><br />Filename:<br />';
							document.getElementById('msgatt').innerHTML += part.filename ;
							partid = part.partId;
							document.getElementById('msgatt').innerHTML += '<br />';
							
							var downbtn = document.createElement("a");
							var insertbtn = document.createElement("button");
							var node=document.createTextNode("下载");
							var node2=document.createTextNode("添加");
							
							downbtn.appendChild(node);
							insertbtn.appendChild(node2);
							document.getElementById("msgatt").appendChild(downbtn);
							document.getElementById("msgatt").appendChild(insertbtn);
							
							downbtn.href = 'https://mail.google.com/mail/u/0/?ui=2&ik=' + ik + '&view=att&th=' + MessageId + '&attid=0.' + partid +'&disp=safe&zw';
							downbtn.target = "nammme";
							
							insertbtn.id = "inserts_"+id;
							
							document.getElementById('inserts_'+id).onclick = function(){
								alert('what happend?');
								console.log('mesID:'+MessageId+' partid:'+partid+'\r\n');
							}
							
						}
						id++;
					}
					
					
					
					
					
					
					
					
					
					
					
					----------------
					
document.getElementById('inserts_'+fuck).onclick=function (){
									//1.获得当前的draft内容（非raw的字符串）
									var currentdraftid;
									var currentDraftString = '';
									var partBeingInserted = '';

									getCurrentDraftID(function ( draftID ){
										console.log('in func:'+draftID);
										currentdraftid = draftID;
										/*console.log('drafid:'+draftID);*/
										getCurrentRawDraft(currentdraftid,function ( draftmail ){
											/*console.log(draftmail);*/
											currentDraftString = draftmail;
											console.log('THE CURRENT DRAFT IS:' + draftmail);
												//2.获得当前message中相应的附件内容和信息（非raw的字符串）
												getAttPart(MessageId,partid,function( attachpart ){
													/*console.log(attachpart);*/
													partBeingInserted = attachpart;
													/*console.log('THE PART BEING APPENDED TO DRAFT IS:' + partBeingInserted);*/
												});
										});
										
									});//存到变量draftID中
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
									
											document.getElementById('inserts_'+fuck).onclick=function (){
									//1.获得当前的draft内容（非raw的字符串）
									var currentdraftid;
									var currentDraftString = '';
									var partBeingInserted = '';

									getCurrentDraftID(function ( draftID ){
										console.log('in func:'+draftID);
										currentdraftid = draftID;
										/*console.log('drafid:'+draftID);*/
										getCurrentRawDraft(currentdraftid,function ( draftmail ){
											/*console.log(draftmail);*/
											currentDraftString = draftmail;
											console.log('THE CURRENT DRAFT IS:' + draftmail);
												//2.获得当前message中相应的附件内容和信息（非raw的字符串）
												getAttPart(MessageId,partid,function( attachpart ){
													/*console.log(attachpart);*/
													partBeingInserted = attachpart;
													/*console.log('THE PART BEING APPENDED TO DRAFT IS:' + partBeingInserted);*/
												});
										});
										
									});//存到变量draftID中
									
				/*					//3.把2拼到1上
									var updatedRaw = joinPartToDraft(currentDraftString,partBeingInserted);
									//4.更新draft
									updateDraft(currentdraftid,updatedRaw);
				*/				
						}*/