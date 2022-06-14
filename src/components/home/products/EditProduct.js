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

import htmlToDraft from 'html-to-draftjs';


import fileDownload from 'js-file-download';


import Config from "../../global/Config";

import Loader from "../../global/Loader";

import Extension from "../../global/Extension";


const EditProduct = (props) => {

  
  const [show, setShow] = useState(false);

  const [files, setFiles] = useState([]);

  const [productFiles, setProductFiles] = useState([]);

  const [progressTitle,setProgressTitle] = useState("");

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

    console.log(data.title);

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

    setProductFiles([]);
  }




  const upload =()=>{


    if(files.length>0){

      setProgressTitle("Cargando archivos ...");

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

        method: 'put',
          url: Config.server+'/products/'+props.data.product.id,
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

            setProductFiles(response.data);

            window.dispatchEvent(new CustomEvent("getProducts", {detail: {}}));

            swal("Exito" ,"Producto editado","success");

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

        method: 'put',
        url: Config.server+'/products/'+props.data.product.id,
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


          $("body").css({"overflow":"hidden !important"});

          Loader.off();

          if(response.status===200){

            window.dispatchEvent(new CustomEvent("getProducts", {detail: {}}));

            swal("Exito" ,"Producto editado","success");
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

  const deleteAllUploadedFiles=()=>{

    Loader.on();

    axios({

      method: 'get',
      url: Config.server+'/deleteAllUploadedFiles/'+props.data.product.id,
      data:{},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

    }).then((response) => {

      Loader.off();

      if(response.status===200){

        setProductFiles([]);

        swal("Exito" ,"Archivos eliminados","success");
      }

    }).catch((e) =>{

        Loader.off();

        swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

        console.error(e);

      });
  }


  const deleteProductFile =(id,indexItem)=>{

    Loader.on();

    axios({

      method: 'get',
      url: Config.server+'/deleteProductFile/'+id,
      data:{},
      responseType: 'json',
      responseEncoding: 'utf8',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}

    }).then((response) => {

      Loader.off();

      if(response.status===200){

        setProductFiles(productFiles =>
          productFiles.filter((x,index) => index !== indexItem)
        );

        swal("Exito" ,"Archivo eliminado","success");
      }

    }).catch((e) =>{

        Loader.off();

        swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

        console.error(e);

      });
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



    const download = (url, filename) => {

      setProgressTitle("Descargando archivos ...");

      $("#bar").css("width","0%");

      $("#text-bar").html("0%");

      handleShow();

      axios.get(url, {
        responseType: 'blob',
        cancelToken: new CancelToken(function executor(c){
     
            window.addEventListener('cancelToken', (event) =>{

                c();

                window.removeEventListener("cancelToken",{}); 
            });

          }),
        

            onDownloadProgress: progressEvent => {

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
      })
      .then((res) => {

        fileDownload(res.data, filename)

        Loader.off();

        swal("Exito" ,"Descarga finalizada","success");

      }).catch((e) =>{

          if(axios.isCancel(e)){

            handleClose();

            Loader.off();

            swal("Atencion!" ,"Descarga cancelada por el usuario","error");

          }else{

            handleClose();

            Loader.off();

            swal("Atencion!" ,"Se a producido un error vuelva a intentarlo, si el error persiste contacte a soporte","error");

            console.error(e);
          }
      })
    }



    const edit = useCallback(event => {

      setSubmit(true);

      if(data.title && data.description){

        upload();
      }
        
    }, [data,files]);




    const close = useCallback(event => {

      clear();

      window.dispatchEvent(new CustomEvent("panelSlide",{detail:{ "action":0}}));
        
    }, []);


    const cancelToken=()=>{

      window.dispatchEvent(new CustomEvent("cancelToken"));
    }

    const _getInitialHTML=(html)=> {

      let contentBlock = htmlToDraft(html);
      let contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      return contentState;
    }


    useEffect(() => {

      data.title=props.data.product.name;

      data.description= props.data.product.description;

      setData(data);

      setProductFiles(props.data.files);

      setEditorState(EditorState.createWithContent(_getInitialHTML(props.data.product.description)));
      
    
    }, [props]);




    useEffect(() => {

      window.addEventListener('closeEditProduct',close);

      window.addEventListener('editProduct',edit);


      return () => {

        window.removeEventListener('closeEditProduct',close);

        window.removeEventListener('editProduct',edit);
      };
    
    }, [close,edit]);



  return ( 

      <Fragment>

        <div className='panel-title'>
          <h2>Agregar Producto</h2>
        </div>
 
        <div className='container'>

          <form>

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

          </form>


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


          {productFiles.length>0&&<div>


            <h4>Archivos cargados:</h4>


            <hr/>
            

            <div className="col-md-12">
              
              <button className="btn btn-sm btn-danger" onClick={deleteAllUploadedFiles}><i className="fas fa-trash-alt"></i> <b>Eliminar todos</b></button>

            </div>


            <div className="row">

              
                              
              {productFiles.map((x,index) => (

                <div key={index} className="col-sm-12 col-md-4 col-lg-3 col-xl-3">

                  <center>
                    {x.type.match('image.*')&&<div className="image-item">
                      {Extension.htmlImage(x.src)&&<a data-fancybox={"products"} data-src={Config.server+"/files/"+x.src} data-caption={x.name}><img className="rounded" src={Config.server+"/files/"+x.src} width="150px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>}
                      {(!Extension.htmlImage(x.src))&&<img className="rounded" src="./resources/img/image404.jpg" title="La imagen no es soportada por el navegador para su vista previa pero podra ser descargada" width="150px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>}
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                  
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteProductFile(x.id,index)}><i className="fas fa-trash-alt"></i></button>
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-primary" onClick={()=>download(Config.server+"/files/"+x.src,x.name)}><i className="fas fa-download"></i></button>

                        </div>

                      </div>
                    </div>}

                    {x.type.match('pdf.*')&&<div className="image-item">
                      <a data-fancybox={"pdf"} data-type="pdf" data-src={Config.server+"/files/"+x.src} data-caption={x.name}><img className="rounded" src="./resources/img/pdf.png" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteProductFile(x.id,index)}><i className="fas fa-trash-alt"></i></button>
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-primary" onClick={()=>download(Config.server+"/files/"+x.src,x.name)}><i className="fas fa-download"></i></button>
                        </div>

                      </div>
                    </div>}


                    {x.type.match('video.*')&&<div className="image-item">
                      {Extension.htmlVideo(x.src)&&<a data-fancybox={"video"+index} data-type="video" data-src={Config.server+"/files/"+x.src} data-caption={x.name}><img className="rounded" src="./resources/img/video.png" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/></a>}
                      {(!Extension.htmlVideo(x.src))&&<img className="rounded" src="./resources/img/video.png" title="El video no es soportado por el navegador para su vista previa pero podra ser descargado" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>}
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                         
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteProductFile(x.id,index)}><i className="fas fa-trash-alt"></i></button>
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-primary" onClick={()=>download(Config.server+"/files/"+x.src,x.name)}><i className="fas fa-download"></i></button>

                        </div>

                      </div>
                    </div>}


                    {(!x.type.match('image.*') && !x.type.match('video.*') && !x.type.match('pdf.*'))&&<div className="image-item">
                      <img className="rounded" src="./resources/img/file.png" title="El archivo no es soportado por el navegador para su vista previa pero podra ser descargado" width="100px" height="150px" style={{"margin":"5px","cursor":"pointer"}}/>
                      <center><h4>{x.name}</h4></center>
                      <div className="image-item__btn-wrapper">
                        <div className="btn-group" role="group">
                         
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-danger" onClick={()=>deleteProductFile(x.id,index)}><i className="fas fa-trash-alt"></i></button>
                          <button style={{"display":"block","margin":"5px"}} className="btn btn-sm btn-primary" onClick={()=>download(Config.server+"/files/"+x.src,x.name)}><i className="fas fa-download"></i></button>

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
 
export default EditProduct;