const Sessions = {

    get:(name)=>{

    	if(localStorage.getItem('local')){

    		var local = JSON.parse(localStorage.getItem('local'));

	    	for (var i = 0; i < local.length; i++) {
	    			
	    		if(local[i].name==name){

	    			return local[i].value;
	    		}
	    	}

    	}else{

    		return false;
    	}

    	
    },


    set:(name,data)=>{

    	if(localStorage.getItem('local')){

    		var local = JSON.parse(localStorage.getItem('local'));

    		var exist = 0;

    		for (var i = 0; i < local.length; i++) {
    			
    			if(local[i].name===name){

    				local[i].value=data;

    				exist = 1;

    				break;
    			}
    		}

    		if(!exist){

    			local.push({"name":name,"value":data});
    		}

    	}else{

    		var local = [{"name":name,"value":data}];
    	}

        localStorage.setItem('local', JSON.stringify(local));

        return true;
    },

    remove:(name)=>{

        if(localStorage.getItem('local')){

            var local = JSON.parse(localStorage.getItem('local'));

            if(local.length>1){

                var index=0;

                for (var i = 0; i < local.length; i++) {
                    
                    if(local[i].name==name){

                        index=i;

                        break;
                    }
                }

                local.splice(index,1);

                localStorage.setItem('local', JSON.stringify(local));

            }else{

                localStorage.removeItem('local');

            }
 

        }else{

            return false;
        }

        
    },

}


 
export default Sessions;