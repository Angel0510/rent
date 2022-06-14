const Extension = {

    htmlImage:(name)=>{

    	var ext=name.split(".").pop();

    	var formats=[

    		"jpg",
    		"jpeg",
    		"gif",
    		"png",
    		"webp",
    		"svg"
    	];


    	for (var i = 0; i < formats.length; i++) {
    		
    		if(formats[i]===ext.toLowerCase()){

    			return true
    		}
    	}

    	return false;
    	
    },

    htmlVideo:(name)=>{

    	var ext=name.split(".").pop();

    	var formats=[

    		"ogv",
    		"mp4",
    		"webm"
    	];


    	for (var i = 0; i < formats.length; i++) {
    		
    		if(formats[i]===ext.toLowerCase()){

    			return true
    		}
    	}

    	return false;

    },

    get:(name)=>{

    	var ext=name.split(".").pop();

        return ext.toLowerCase();
    }

}


 
export default Extension;