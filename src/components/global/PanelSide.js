import React, {useState, useEffect,Fragment,useCallback,useMemo} from 'react';
import $ from "jquery";


const PanelSlide = () => {

    const [module, setModule] = useState();

    const [options, setOptions] = useState([]);

    
    const open=()=>{

        $("body").css({"overflow":"hidden"});

        $(".panel-side").animate({'right': '0px'},800);

        $(".footer-panel-side").animate({'right': '0px'},800);
    }

    const close=()=>{

        $(".footer-panel-side").animate({'right': '-100%'},800);

        $(".panel-side").animate({'right': '-100%'},800,()=>{

            $("body").css({"overflow":"visible"});
        });

        
    }


    const action=(data)=>{

        window.dispatchEvent(new CustomEvent(data.event, {detail: {"data":data.data}}));
    }



    const init= useCallback(event => {

       var data= event.detail;

       if(data.action===1){

            setModule(data.module); 

            if(data.options.length>0){

                setOptions(data.options);
            }

            open();

        }else{

            close();
        }
        
    }, []);




    useEffect(() => {

		window.addEventListener('panelSlide',init);


        return () => {
            
            window.removeEventListener("panelSlide",init);
        };
    
		
	}, [init]);


    return ( 

        <Fragment>

            <div className='panel-side'>

				{module}

            </div>

            <div className='footer-panel-side'>

                {options.map((x,index)=>
                
                    <button key={index} style={{"margin":"2px"}} className={x.class} onClick={()=>action(x.action)}><b>{x.name}</b></button>
                
                )}

            </div>

        </Fragment> 
        
        
    );
}
 
export default PanelSlide;