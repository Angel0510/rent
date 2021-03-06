import React, {useState,useEffect,Fragment,useCallback} from 'react';

import $ from "jquery";

import axios from 'axios';

import swal from "sweetalert";

import Modal from 'react-bootstrap/Modal';


import { Fancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox.css";

import { useForm } from 'react-hook-form';


import Config from "../../global/Config";

import Loader from "../../global/Loader";

import Sessions from "../../global/Sessions";



const EditUser = (props) => {

    const [show, setShow] = useState(false);

    const [photo,setPhoto] = useState("");

    const [progressTitle,setProgressTitle] = useState("");

    const [dataReset,setDataReset] = useState({

        nick: "",
        pass: ""
    });

    const [files, setFiles] = useState([]);

    const { register, setValue,handleSubmit,reset, watch, formState: { errors } } = useForm({

        defaultValues: dataReset
    });


    const CancelToken = axios.CancelToken;


    const handleClose = () => setShow(false);

    const handleShow = () => setShow(true);


    const close = useCallback(event => {


        reset(dataReset);

        setFiles([]);

        window.dispatchEvent(new CustomEvent("panelSlide", {
            
            detail: { 
                
                "action":0
            }
        }));


        
    }, [dataReset]);



    const onChangeFiles = (e) => {

        var files=e.target.files;

        onloadFile(files[0]);
    };





    const onloadFile=(f)=>{

        let file=f;

        var reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = function(){

            setPhoto(reader.result);

            setFiles(files=>[...files,file]);
        }
    }





    const onSubmit = (data) => {


        let profile=false;


        if(Sessions.get("user").id==props.data.id){

            profile=true;
        }

        if(files.length>0){

            setProgressTitle("Cargando foto ...");

            $("#bar").css("width","0%");

            $("#text-bar").html("0%");

            handleShow();

            let formData = new FormData();

            formData.append("photo",files[0]);

            formData.append("id",props.data.id);

            formData.append("nick",data.nick);

            formData.append("pass",data.pass);

            formData.append("profile",profile);

            axios({

                method: 'put',
                url: Config.server+'/users',
                data: formData,
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded multipart/form-data'
                },
                cancelToken: new CancelToken(function executor(c){
             
                    window.addEventListener('cancelToken', (event) =>{

                        c();

                        window.removeEventListener("cancelToken",{}); 
                    });

                }),

                onUploadProgress: progressEvent => {

                    const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                    
                    if (totalLength !== null){

                        let percentage = Math.round((progressEvent.loaded * 100) / totalLength);
                      
                        $("#bar").css("width",percentage+"%");

                        $("#text-bar").html(percentage+"%");

                        if(percentage===100){

                        handleClose();

                        Loader.on();
                        }
                    }
                }

            }).then((response) => {

                Loader.off();

                if(response.status===201){

                    setFiles([]);

                    window.dispatchEvent(new CustomEvent("getUsers", {detail: {}}));

                    if(profile){

                        window.dispatchEvent(new CustomEvent("user", {detail: response.data}));
                    }


                    swal("Exito" ,"Usuario editado","success");

                   

                }else if(response.status===204){

                    swal("Atenci??n" ,"El nick de usuario ya exite","warning");
                }
                
            }).catch((e) => {

                if(axios.isCancel(e)){

                    handleClose();

                    Loader.off();

                    swal("Atencion!" ,"Carga cancelada por el usuario","error");

                }else{

                    handleClose();

                    Loader.off();

                    swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

                    console.error(e);
                }
            });


        }else{

            Loader.on();

            axios({

                method: 'put',
                url: Config.server+'/users',
                data: {
                  "id":props.data.id,
                  "nick":data.nick,
                  "pass":data.pass,
                  "profile":profile
                },
                responseType: 'json',
                responseEncoding: 'utf8',
                headers: {
                  'Content-Type': 'application/json'
                }

            }).then((response) => {


              Loader.off();

              if(response.status===201){

                window.dispatchEvent(new CustomEvent("getUsers", {detail: {}}));

                if(profile){

                    window.dispatchEvent(new CustomEvent("user", {detail: response.data}));
                }

                swal("Exito" ,"Usuario editado","success");

               

              }else if(response.status===204){

                swal("Atenci??n" ,"El nick de usuario ya exite","warning");
              }
                

            }).catch((e) =>{

              Loader.off();

              swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

              console.error(e);

            });

        }
    }


    const cancelToken=()=>{

      window.dispatchEvent(new CustomEvent("cancelToken"));
    }


    const edit = useCallback(event => {

        $('#editUser').trigger('click');
        
    }, []);



    
    useEffect(() => {

		window.addEventListener('editUser',edit);

        window.addEventListener('closeEditUser',close);


        return () => {
            
            window.removeEventListener("editUser", edit);

            window.removeEventListener('closeEditUser',close);
        };
    
		
	}, [edit,close]);



    useEffect(() => {

        setValue('nick',props.data.nick); 
        setValue('pass',props.data.pass); 
        setPhoto((props.data.photo!="no posee")?Config.server+"/files/"+props.data.photo:props.data.photo);

    }, [props]);

  

    return ( 

        <Fragment>

            <div className='panel-title'>

                <h2>Editar Usuario</h2>

            </div>


            <div className='container'>

        
                <form className='panel-content' onSubmit={handleSubmit(onSubmit)}>

                    <div className='row'>
                        
                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">

                            <div className="form-group">

                                <label style={(!errors.nick)?{"display":"block"}:{"display":"none"}}>Nick</label>

                                <label style={(errors.nick)?{"display":"block"}:{"display":"none"}} className='text-danger'>{errors.nick?.message}</label>

                                <input type="text" className="form-control inpu-text"  placeholder="Nick" {...register("nick",{required:"Nick requerido"})}/>
                                
                            </div>

                        </div>


                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">

                            <div className="form-group">

                                <label style={(!errors.pass)?{"display":"block"}:{"display":"none"}}>Clave</label>

                                <label style={(errors.pass)?{"display":"block"}:{"display":"none"}} className='text-danger'>{errors.pass?.message}</label>

                                <input type="text" className="form-control inpu-text" autoComplete="off" placeholder="Clave" {...register("pass",{required:"Clave requerida"})}/>
                                
                            </div>

                        </div>


                    </div>


                    <div className='row'>

                        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">

                            

                            {(photo!="no posee")?<a data-fancybox={props.data.nick.replace(/\s+/g,'')+"Edit"} data-src={photo} data-caption={props.data.nick}><img className="rounded" src={photo} width="80px" height="80px" style={{"margin":"5px","cursor":"pointer"}}/></a>:<img className="rounded" src={"./resources/img/user.jpg"} width="80px" height="80px" style={{"margin":"5px"}}/>}


                            <div className="form-group">

                                <label>Foto</label>

                                <div className="custom-file">
                                    <input type="file" className="inpu-text custom-file-input" onChange={onChangeFiles}/>
                                    <label className="custom-file-label">
                                    {(files.length>0)?files[0].name:"Seleccione la foto"}
                                    </label>
                                </div>
                                
                            </div>

                        </div>

                    </div>


                   
                    
                    <input id="editUser" style={{"display":"none"}} type="submit"/>  

                </form>

            </div>


            <Modal 

              show={show} 
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered

              >
              <Modal.Header>
                <Modal.Title><b><h3>{progressTitle}</h3></b></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                
                <div className="progress">
                  <div id="bar" className="progress-bar" role="progress-bar progress-bar-striped active" style={{"width": "0%"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><span id="text-bar"></span></div>
                </div>

              </Modal.Body>
              <Modal.Footer>
                
                  <button className="btn btn-sm btn-danger" onClick={cancelToken}> <b>Cancelar</b></button>
              
              </Modal.Footer>
            </Modal>

        </Fragment>
        
    );
}
 
export default EditUser;