import $ from "jquery";


const Loader = {

    on:()=>{

        $("body").css({"overflow": "hidden"});

        $(".div-loader").addClass("active-loader");
    },

    off:()=>{

        $("body").css({"overflow": "auto"});

        $(".div-loader").removeClass("active-loader");
    }

}


 
export default Loader;