import React, {Fragment,useEffect} from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Config from "./global/Config";
import Sessions from "./global/Sessions";
import Loader from "./global/Loader";
import $ from "jquery";
import swal from "sweetalert";

const Login = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm();


    const onSubmit = (data) => {

		Loader.on();

		axios({

            method: 'post',
            url: Config.server+'/login',
            data: {"nick":data.nick,"pass":data.pass},
            responseType: 'json',
            responseEncoding: 'utf8',
            headers: {
                'Content-Type': 'application/json'
            }

        }).then((response) => {

            if(response.status===200){

            	Sessions.set("user",response.data);

				window.location.href="/home";
              
            }else if(response.status===204){

				Loader.off();

				swal("Atencion" ,"Usuario o clave incorrectos","error");

			}
        })
        .catch((e) => 
        {
            console.error(e);
        });
    }


    useEffect(() => {

    	if(Sessions.get("user")){

        	window.location.href="/home";

        }else{

        	$(document).ready(function(){

        		$("body").addClass('overflow');

        	});

        	Loader.off();
        }

	}, []);


    return (
        
    	<section className="vh-100" style={{"background":"linear-gradient(-45deg,#06418e,#1572e8)"}}>
		  <div className="container py-5 h-100">
		    <div className="row d-flex justify-content-center align-items-center h-100">
		      <div className="col col-xl-10">
		        <div className="card" style={{"borderRadius":"1rem"}}>
		          <div className="row g-0">
		            <div className="col-md-6 col-lg-5 d-none d-md-block">
		              <img src="./resources/img/login.jpg"
		                alt="login form" className="img-fluid" style={{"borderRadius":"1rem 0 0 1rem","height":"100%"}} />
		            </div>
		            <div className="col-md-6 col-lg-7 d-flex align-items-center">
		              <div className="card-body p-4 p-lg-5 text-black">

		                <form onSubmit={handleSubmit(onSubmit)}>

		                  <div className="d-flex align-items-center mb-3 pb-1">
		                    <i className="fas fa-cubes fa-2x me-3" style={{"color":"#ff6219"}}></i>
		                    <span className="h1 fw-bold mb-0">Logo</span>
		                  </div>

		                  <h4 className="fw-normal mb-3 pb-3" style={{"letterSpacing":"1px"}}>Iniciar sesión en su cuenta</h4>

		                  <div className="form-outline mb-4">

		                    <label><label className="form-label">Nick:</label> <label className='text-danger'><b>{errors.nick?.message}</b></label></label>

		                    <input type="text" className="form-control form-control-lg inpu-text" {...register("nick",{required:"El campo nick es requerido"})}/>

		                  </div>

		                   

		                  <div className="form-outline mb-4">
		                  	<label><label className="form-label">Clave:</label> <label className='text-danger'><b>{errors.pass?.message}</b></label></label>
		                    <input type="password" className="form-control form-control-lg inpu-text" {...register("pass",{required:"El campo clave es requerido"})}/>
		                  </div>

		                  <div className="pt-1 mb-4">
		                    <button type="submit" className="btn btn-primary btn-lg btn-block">Iniciar sesión</button>
		                  </div>

		                  
		                </form>

		              </div>
		            </div>
		          </div>
		        </div>
		      </div>
		    </div>
		  </div>
		</section>
    );
}
 
export default Login;