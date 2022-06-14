import React, {useState,useEffect,useRef,Fragment,useCallback} from 'react';

import $ from "jquery";

import axios from 'axios';

import swal from "sweetalert";

import Modal from 'react-bootstrap/Modal';


import { Fancybox } from "@fancyapps/ui";

import "@fancyapps/ui/dist/fancybox.css";


import { EditorState,convertToRaw,convertFromHTML,ContentState} from 'draft-js';

import { Editor } from "react-draft-wysiwyg";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import draftToHtml from 'draftjs-to-html';


import Config from "../../global/Config";

import Loader from "../../global/Loader";

import Extension from "../../global/Extension";


const AddProduct = () => {

  
  const [show, setShow] = useState(false);

  const [files, setFiles] = useState([]);

  const [submit,setSubmit] = useState(false);

  const [data,setData] = useState({

    title:"",
    description:""

  });

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());


  const CancelToken = axios.CancelToken;

  const maxNumber = 69;


  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);



  const handleInputChange = (event) =>{

    setData({
      ...data,
      [event.target.name] : event.target.value
    })
  }

  const onChangeFiles = (e) => {

    var files=e.target.files;

    for (var i = 0; i < files.length; i++){

      onloadFile(files[i]);
    }

    
  };


  const onloadFile=(f)=>{

    let file=f;

    var reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function(){

      file.src=reader.result;

      setFiles(files=>[...files,file]);
    }

  }



  const deleteFile = (indexItem) =>{
    setFiles(files =>
      files.filter((x,index) => index !== indexItem)
    );
  };


  const clear =()=>{

    setSubmit(false);

    data.title="";

    data.description="";

    setData(data);

    setEditorState(() => EditorState.createEmpty());

    setFiles([]);
  }



  const add = useCallback(event => {

    setSubmit(true);

    if(data.title && data.description){

      upload();
    }
        
  }, [data,files]);



  const upload =()=>{


    if(files.length>0){


      $("#bar").css("width","0%");

      $("#text-bar").html("0%");

      handleShow();



      let formData = new FormData();

      formData.append("title",data.title);

      formData.append("description",data.description);

      for (var i = 0; i < files.length; i++){
            
       formData.append("files",files[i]);

      }
      
      axios({

        method: 'post',
          url: Config.server+'/products',
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

            clear();

            window.dispatchEvent(new CustomEvent("getProducts", {detail: {}}));

            swal("Exito" ,"Producto agregado","success");
          }

      }).catch((e) =>{

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

        method: 'post',
        url: Config.server+'/products',
        data: {
          "title":data.title,
          "description":data.description,
        },
        responseType: 'json',
        responseEncoding: 'utf8',
        headers: {
          'Content-Type': 'application/json'
        }

      }).then((response) => {

          Loader.off();

          if(response.status===201){

            clear();

            window.dispatchEvent(new CustomEvent("getProducts", {detail: {}}));

            swal("Exito" ,"Producto agregado","success");
          }

        })
        .catch((e) => 
        {

          Loader.off();

          swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

          console.error(e);

        });

    }
  }


    const onEditorStateChange = (editorState) => {

      var html= draftToHtml(convertToRaw(editorState.getCurrentContent()));

      if(html==="<p></p>\n"){

        html="";
      }

      setData({
        ...data,
        ["description"] : html
      });
      
      setEditorState(editorState);
    };


    const close = useCallback(event => {

      clear();

      window.dispatchEvent(new CustomEvent("panelSlide",{detail:{ "action":0}}));
        
    }, []);


    const cancelToken=()=>{

      window.dispatchEvent(new CustomEvent("cancelToken"));
    }


    useEffect(() => {

        window.addEventListener('closeAddProduct',close);

        window.addEventListener('saveAddProduct',add);


        return () => {

            window.removeEventListener('closeAddProduct',close);

            window.removeEventListener('saveAddProduct',add);
        };
    
    
  }, [close,add]);



  return ( 

      <Fragment>

        <div className='panel-title'>
          <h2>Agregar Producto</h2>
        </div>
 
        <div className='container'>

            <div className="form-group">
              <label>Título: <label className='text-danger'><b>{(!data.title && submit)?" Título requerida":""}</b></label></label>
              <input type="text" className="form-control inpu-text" value={data.title} onChange={handleInputChange} name="title"/>
            </div>
            <div className="form-group">
              <label>Descripción: <label className='text-danger'><b>{(!data.description && submit)?" Descripción requerida":""}</b></label></label>
              <Editor
                editorState={editorState}
                toolbarClassName="editor-toolbar"
                wrapperClassName="editor-wrapper"
                editorClassName="editor-body"
                onEditorStateChange={onEditorStateChange}
              />
            
            </div>

            <div className="form-group">

              <label>Archivos relacionados al producto</label>

              <div className="custom-file">
                <input type="file" className="inpu-text custom-file-input" multiple onChange={onChangeFiles}/>
                <label className="custom-file-label">
                  {(files.length>0)?files.length+" archivos seleccionados":"Seleccione los archivos"}
                </label>
              </div>
                            
            </div>


          {files.length>0&&<div className="loading-zone">


            <div className="col-md-12">
              
              <button className="btn btn-sm btn-danger" onClick={()=>setFiles([])}><i className="fas fa-trash-alt"></i> <b>Eliminar todos</b></button>

            </div>


            <div className="row">
                              
              {files.map((x,index) => (

                <div key={index} className="col-sm-12 col-md-4 col-lg-3 col-xl-3">

                  <center>
                    {x.type.match('image.*')&&<div className="image-item">
                      {Extension.htmlImage(x.name)&&<a data-fancybox={"products"} data-src={x.src} data-caption={x.name}><img className="rounded" src={x.src} width="150px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>}
                      {(!Extension.htmlImage(x.name))&&<img className="rounded" src="./resources/img/image404.jpg" title="La imagen no es soportada por el navegador para su vista previa pero podra ser descargada" width="150px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>}
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                  
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteFile(index)}><i className="fas fa-trash-alt"></i></button>
                        </div>

                      </div>
                    </div>}

                    {x.type.match('pdf.*')&&<div className="image-item">
                      <a data-fancybox={"pdf"} data-type="pdf" data-src={x.src} data-caption={x.name}><img className="rounded" src="./resources/img/pdf.png" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteFile(index)}><i className="fas fa-trash-alt"></i></button>
                        </div>

                      </div>
                    </div>}


                    {x.type.match('video.*')&&<div className="image-item">
                      {Extension.htmlVideo(x.name)&&<a data-fancybox={"video"+index} data-type="video" data-src={x.src} data-caption={x.name}><img className="rounded" src="./resources/img/video.png" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>}
                      {(!Extension.htmlVideo(x.name))&&<img className="rounded" src="./resources/img/video.png" title="El video no es soportado por el navegador para su vista previa pero podra ser descargado" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>}
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                         
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteFile(index)}><i className="fas fa-trash-alt"></i></button>
                        </div>

                      </div>
                    </div>}


                    {(!x.type.match('image.*') && !x.type.match('video.*') && !x.type.match('pdf.*'))&&<div className="image-item">
                      <img className="rounded" src="./resources/img/file.png" title="El archivo no es soportado por el navegador para su vista previa pero podra ser descargado" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                         
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteFile(index)}><i className="fas fa-trash-alt"></i></button>
                        </div>

                      </div>
                    </div>}

                  </center>

                </div>
              ))}

            </div>

          </div>}

      
          
        </div>

        <Modal 

              show={show} 
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered

              >
              <Modal.Header>
                <Modal.Title><b><h3>Cargando archivos ...</h3></b></Modal.Title>
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
 
export default AddProduct;